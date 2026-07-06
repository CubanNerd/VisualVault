# VisualVault Developer Architecture & Maintenance Guide

Welcome to the comprehensive **VisualVault Developer Architecture & Maintenance Guide**. This document outlines the application's design, architectural patterns, state managers, tech stack, build pipelines, and integrations. It is written to aid developers with future maintenance, updates, or native platform ports.

---

## Architectural Overview

VisualVault is a high-performance, local-first design asset catalog styled like an Obsidian workstation.

### Custom Elements (Web Components) Paradigm
Rather than relying on virtual DOM overhead, VisualVault is engineered as a standard native **TypeScript Web Component** class (`VaultApp`) that inherits from `HTMLElement` and is registered via `customElements.define('vault-app', VaultApp)`.

This approach provides several core benefits:
- **Sub-millisecond DOM updates**: Dynamic insertions and DOM selections execute directly via native document queries, offering UI responsiveness.
- **Self-contained Logic**: Event bindings, layout systems, overlays, theme injections, and storage bridges are cleanly coupled inside a single core class.
- **Frictionless Portability**: It bootstraps immediately inside a standard browser environment or nested inside native hybrid desktop web wrappers (Electron).

### The Web Component Lifecycle (`VaultApp`)
The primary controller is the `VaultApp` class defined in `src/main.tsx`, which extends `HTMLElement` and is registered via `customElements.define('vault-app', VaultApp)`.

```
                    [ Constructor ]
              Seeds default state structures
                           │
                           ▼
                  [ connectedCallback ]
              Loads settings & initiates storage observer
                           │
                           ▼
                     [ renderShell ]
              Builds skeletal DOM layout structures
                           │
                           ▼
                 [ attachEventListeners ]
              Wires static events & handlers
                           │
                           ▼
                     [ updateLayout ]
    Gathers assets ➔ Filters list ➔ Renders Masonry & Cards
```

1. **`connectedCallback()`**: Initializes options, maps workspace settings, binds global window events, and loads the storage system.
2. **`renderShell()`**: Translates raw HTML strings directly into the DOM container. It establishes the workspace layout, including the sidebar and the main viewport.
3. **`attachEventListeners()`**: Hooks up handlers like search listeners, lightbox close buttons, board inputs, and category tab actions.
4. **`updateLayout()`**: The main render pipeline. It reads filters, runs real-time search match calculations, and populates both the directory lists and the masonry portfolio.

---

## The Tech Stack

| Technology / Library | Version | Purpose |
| :--- | :--- | :--- |
| **TypeScript** | `~5.8.2` | Strong type definitions, compilation checks, and strict interface schemas. |
| **Vite** | `^6.2.3` | Development server, asset packager, and ES module builder. |
| **Tailwind CSS (v4)** | `^4.1.14` | Localized utility-first styling with native CSS variables and `@theme` extension hooks. |
| **Electron** | `^42.2.0` | Local desktop runtime wrapper to bypass browser security sandboxes. |
| **electron-packager** | `^17.1.2` | Executable compressor that bundles files for Win32 (x64) desktop targets. |
| **lucide-react** | `^0.546.0` | Accessible, scale-independent SVG icons for toolbars, menus, and status dots. |

---

## Core Modules & Workspace Structure

```bash
/
├── package.json               # Script commands, dependencies, and metadata declarations
├── vite.config.ts             # Bundler settings configured with relative base output
├── electron-main.cjs          # Electron application bootstrap, window controller, and sandbox locks
├── src/
│   ├── main.tsx               # The Core Application Core Module (State, UI, Events inside VaultApp)
│   ├── types.ts               # Shared TypeScript schemas (Asset, AssetMetadata, Vault)
│   ├── index.css              # Global custom styling sheet, scrollbars, and Tailwind v4 themes
│   └── App.tsx                # Client-Side SPA entry stub
└── README.md                  # High-level end-user user documentation
```

---

## State Partitioning & Storage System

VisualVault functions as an offline-first catalog wrapper. It manages assets, boards, active vaults, and companion settings purely on the client side, using unique, namespaced local caching channels. This mirrors the behavior of Obsidian's offline-first vault catalog.

```
┌───────────────────────────────── StorageService ─────────────────────────────────┐
│                                                                                  │
│   Active Path Target Tracker: "visual_vault_active_path_v1"                      │
│   Directory Vault Registry Key: "visual_vaults_list_v1"                          │
│                                                                                  │
│   ┌────────────────────────────── Multi-Vault partition tables ──────────────┐   │
│   │                                                                          │   │
│   │   Vault Key: "visual_catalog_db_v3_Users_design_Desktop_Concept"          │   │
│   │   ↳ [ Asset { id: 101, path: "cyberpunk_1.jpg", vaultPath: ... } ]       │   │
│   │                                                                          │   │
│   │   Vault Key: "visual_catalog_db_v3_Users_design_Documents_Mech"          │   │
│   │   ↳ [ Asset { id: 201, path: "blueprint_5.png", vaultPath: ... } ]       │   │
│   │                                                                          │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 1. The Directory Vault Key-Map
To support isolated files across multiple project references, the application registers vaults using a root workspace tracker:
- **Registry Key**: `visual_vaults_list_v1`
  - Stores list array of registered folders: `{ name: string, path: string, lastOpened: number }[]`
- **Active Path Identifier**: `visual_vault_active_path_v1`
  - Stores string path reference of the active directory vault (e.g., `/Users/projects/Cyberpunk_Grid`).

### 2. Isolated Workspace Databases
Individual asset lists (including metadata stars, custom notes, color palettes, and tag meshes) are isolated by vault-path to prevent crosstalk.
Each vault has its own database key constructed dynamically in `src/main.tsx` via `StorageManager`:

```ts
getVaultKey(): string {
  const path = this.getVaultPath();
  return `visual_catalog_db_v3_${path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
}
```

This dynamic mapping separates your data, ensuring that when a developer switches from the *Neo-Tokyo Concept Art* library to the *Mechanic Parts & Blueprint* catalog, only the assets mapped to that specific filesystem folder are loaded.

### 3. Unified Arena vs. Focused Solitude Views
The **Workspace View Mode** switch changes how files are indexed and rendered in memory:

```ts
// src/main.tsx
private loadAssets() {
  if (this.workspaceMode === 'unified') {
    const vaults = storage.getVaults();
    let combined: Asset[] = [];
    const seenIds = new Set<string>();

    const activePath = storage.getVaultPath();
    const activeAssets = storage.getAllAssets();
    activeAssets.forEach(a => {
      if (!seenIds.has(a.id)) {
        a.vaultPath = a.vaultPath || activePath;
        seenIds.add(a.id);
        combined.push(a);
      }
    });

    vaults.forEach(v => {
      if (v.path !== activePath) {
        try {
          const pathKey = `visual_catalog_db_v3_${v.path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
          const data = localStorage.getItem(pathKey);
          if (data) {
            const loaded = JSON.parse(data) as Asset[];
            loaded.forEach(a => {
              if (!seenIds.has(a.id)) {
                a.vaultPath = a.vaultPath || v.path;
                seenIds.add(a.id);
                combined.push(a);
              }
            });
          }
        } catch (e) {
          console.error('Failed to parse assets for vault ' + v.name, e);
        }
      }
    });
    this.assets = combined;
  } else {
    this.assets = storage.getAllAssets();
  }
}
```

- **In Focused Mode**: Read operations target the active key mapped strictly to `storage.getVaultPath()`. Only local directory assets load.
- **In Unified Mode**: The engine reads records from **all** registered vaults in the catalog, appends an originating `.vaultPath` track token, deduplicates references, and merges them into a collective array.

### 4. Multi-Vault Partition Saving
When saving modified metadata properties, the `StorageService` partitions and maps assets back to their respective origin filesystems. This ensures that assets keep their correct vault paths even in **Unified** viewing mode:

```ts
saveAllAssets(assets: Asset[]) {
  const activePath = this.getVaultPath();
  const partitions: Record<string, Asset[]> = {};

  assets.forEach(a => {
    const p = a.vaultPath || activePath;
    if (!partitions[p]) {
      partitions[p] = [];
    }
    partitions[p].push(a);
  });

  Object.keys(partitions).forEach(p => {
    const vk = `visual_catalog_db_v3_${p.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    localStorage.setItem(vk, JSON.stringify(partitions[p]));
  });

  if (!partitions[activePath]) {
    localStorage.setItem(this.getVaultKey(), JSON.stringify([]));
  }
}
```

---

## Directory Parsing & Multi-Level Folder Promotion

To match standard user filesystem structures, VisualVault conforms to the following directory layout tracking:
- **Vault [Root/Workspace]** (Base level path)
- **1st Level Folder [Boards]** (Primary conceptual category folder)
- **2nd Level Folder [Sections]** (Conceptual subdivisions)
- **3rd Level Files [Images / Markdowns]** (Files residing directly inside subdivision levels)

### Promotions of 3rd+ Level Subfolders
If physical paths inside a directory scan have folders nested deeper than the 2nd level (such as `1stLevel_Board/2ndLevel_Section/3rdLevel_Subfolder`), standard view trees would hide these subfolders from broad category indices. VisualVault handles this by dynamically scanning folder depths in `renderBoardNavigation()` and promoting them:

```ts
const parts = board.replace(/^\/\s*/, '').split('/');
const isDeeper = parts.length > 2;

if (isDeeper) {
  // Promotes and visualizes the nested subfolders as a 2nd level tree leaf
  displayLabel = `↳ ${parts.slice(1).join(' › ')}`;
}
```

- **Sidebar Integration**: Promoted subfolders are styled with a distinct cyan accent (`text-cyan-400`), highlighted with a nested icon badge, shifted to `pl-8` to differentiate from baseline subfolders, and labeled with a clean directional relative breadcrumb (e.g. `↳ Neo_Tokyo › Streets`).
- **Conditional Informational Notices**: The navigation header dynamically detects whether the active vault repository context contains these promoted nested trees. If `containsDeeperFolders` flags true, the UI displays a helpful instructional box to the curator describing how hierarchy layout projection optimization works.

---

## Board Management Operations & Event Flows

### 1. Board Deletion System with File Preservation Option
When deleting folder boards, the system provides a protective confirm routing that prompts users regarding their structural file assets.

The `deleteBoard(boardName)` method executes the following steps:
- Prompts for confirmation to remove the board.
- Asks whether to delete the mapped assets inside that board.
- **Wipe Mode (User chose YES)**: Filters the asset list to purge all matches, writes changes to the partition table via `storage.saveAllAssets()`, and pushes updates back to the disk.
- **Preserve Mode (User chose NO)**: Re-maps the board attribute of matched assets to the root level (`/`), ensuring files remain safely in local directories.

```ts
private deleteBoard(boardName: string) {
  if (!boardName || boardName === 'ALL') return;

  if (confirm(`Are you sure you want to delete the board "${boardName}"?`)) {
    const deleteFiles = confirm(
      `Would you also like to delete all reference files currently inside "${boardName}"?\n\n` +
      `- Click OK (Yes) to delete both the board and its files.\n` +
      `- Click Cancel (No) to delete the board but keep the files in the vault folder.`
    );

    const vaultPath = storage.getVaultPath();
    const customKey = `visual_vault_created_boards_list_${vaultPath.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const allBoards = this.getUniqueBoards();
    const updatedBoards = allBoards.filter(b => b !== boardName);
    localStorage.setItem(customKey, JSON.stringify(updatedBoards));

    if (deleteFiles) {
      const fileCount = this.assets.filter(a => a.board === boardName).length;
      this.assets = this.assets.filter(a => a.board !== boardName);
      storage.saveAllAssets(this.assets);
      this.addLog('success', `Wiped board "${boardName}" and deleted all ${fileCount} reference files.`);
    } else {
      let movedCount = 0;
      this.assets.forEach(a => {
        if (a.board === boardName) {
          a.board = '/';
          movedCount++;
        }
      });
      storage.saveAllAssets(this.assets);
      this.addLog('success', `Wiped board "${boardName}". Kept ${movedCount} reference files at root.`);
    }

    if (this.selectedBoard === boardName) {
      this.selectedBoard = 'ALL';
    }
    this.updateLayout();
  }
}
```

### 2. Event Delegation Interceptors
Since dashboard elements map dynamically on layout updates, static DOM hooks to buttons will fail. VisualVault avoids this by binding single-point listeners inside `attachEventListeners()` using event delegation:

- **Sidebar Folder Deletions**:
  ```ts
  const listsDiv = this.querySelector('#sidebar-lists');
  listsDiv.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const deleteBtn = target.closest('[data-delete-board]');
    if (deleteBtn) {
      e.stopPropagation();
      this.deleteBoard((deleteBtn as HTMLElement).dataset.deleteBoard || '');
      return;
    }
    // Handle switching logic...
  });
  ```
- **Masonry card folder deletions** are intercepted similarly inside `#masonry-grid-view`.

---

## Layout Modifiers, Custom Themes & Google Web Fonts

VisualVault includes distinctive user interface states, accent colors, and custom typefaces handled via injected CSS stylesheets configured dynamically.

### System Typography Options
We support interactive, high-fidelity Google Fonts and System Typefaces:
- **Default Sans**: Inter Sans
- **Tech / Futuristic Display**: Space Grotesk, Tektur Futuristic
- **Legibility**: Outfit (Geometric), Lexend Sans
- **Editorial / Serif**: Playfair Display, Georgia Serif
- **Developer / Monospace**: JetBrains Mono, Space Mono, IBM Plex Mono, Courier Classic

The selected font is persisted via local storage element `visual_vault_system_font` and applied globally on change using dynamic runtime CSS template strings in `injectThemeStyles()`.

### Injected Style Blocks
The layout themes are managed by injecting styling variables dynamically:
1. **Obsidian Dark (Default)**: Deep carbon canvas (`#0F0F11`), slate borders, emerald inputs, and glowing high-contrast outline states.
2. **Notion Minimalist (Light)**: Cool gray borders, pristine off-white frames, and classic typography.
3. **Y2K CRT Matrix**: Glowing lime greens, stark black backgrounds, scanline CSS overlays, and monospace console fonts.

---

## Customizable Schema & Status Sync

VisualVault provides an advanced **Custom Schema & Status Configurator** to align the application metadata with specific database design taxonomies or studio workflows.

### Structure & Layout Schema Interfacing
Developers and users can custom-label field variables, change placeholder descriptions, or alter dropdown selection status values. The configuration uses the `CustomSchemaConfig` interface:
```ts
interface PropertyConfig {
  label: string;
  placeholder?: string;
}

interface CustomSchemaConfig {
  statuses: { value: string; label: string }[];
  properties: {
    title: PropertyConfig;
    notes: PropertyConfig;
    artist: PropertyConfig;
    rating: PropertyConfig;
    status: PropertyConfig;
  };
}
```

### Persistence & Portability
- **Storage Target**: Local Storage key `visual_vault_schema_config_v1`.
- **JSON Import/Export Hooks**: The Settings panel features quick click action triggers to save down custom configurations as `visual_vault_config.json`, or upload and apply schemas instantly.
- **Form Mapping Sync**: All changed property labels immediately rewrite input fields across both the main inspector panel and active lightbox overlays.

---

## Parsing & RegEx Engines for Obsidian Notes

To provide cross-app compatibility with Obsidian, VisualVault parses and writes metadata inside standard Markdown frontmatter blocks:

- **YAML Reader (`parseYAMLFrontmatter`)**:
  Separates the standard Markdown body from triple-dash YAML headings using a strict regex parser:
  ```ts
  const match = text.match(/^---\r?\n([\s\S]*?)\n---\r?\n?([\s\S]*)$/);
  ```
  It splits lines by colons, converts ratings to numbers, and splits array indicators safely.

- **YAML Writer (`stringifyYAMLFrontmatter`)**:
  Builds clean blocks and appends descriptions below the YAML enclosure details:
  ```yaml
  ---
  artist: Concept Studio
  rating: 4
  status: backlog
  tags:
    - architecture
    - cyberpunk
  ---
  Description notes written here...
  ```

---

## Electron Interface Integration

VisualVault is designed to run seamlessly both in a sandboxed web browser environment and as a highly privileged native desktop companion using Electron:

- **Asset Root Support**: To prevent Electron from failing to resolve assets when loading from local disk filesystems, the `vite.config.ts` compiles output dependencies relatively:
  ```ts
  base: './' // Resolves assets relative to index.html instead of expecting root-level paths
  ```
- **System Command Protocols**: Launches corresponding system actions via URL handlers (e.g. `obsidian://open?vault=${VaultName}&file=${AssetNotePath}`).
- **Native Context Bridge**: The application checks for the presence of `window.electronAPI` to switch dynamically between browser sandboxed Fallback APIs and raw native Node.js capability blocks:

```ts
// Example of native detection in src/main.tsx
const electronAPI = (window as any).electronAPI;
if (electronAPI) {
  // Use high-performance physical disk channels
} else {
  // Fallback to standard client-side IndexedDB/localStorage/Webkit Directory handles
}
```

### 1. Inter-Process Communication (IPC) Handlers
The native layer uses secure, standardized IPC channels to carry out system-level directory and file modifications requested by the custom Web Component frontend:

1.  **`select-directory`**: Calls Electron's `dialog.showOpenDialog` with the `openDirectory` flag to return absolute folder path mappings safely.
2.  **`scan-vault`**: Leverages native Node.js recursive directory reader utilities to crawl and scan folders, returning fully-indexed visual asset records (`Asset[]`) with automated YAML parsing of companion metadata markdown files.
3.  **`write-companion-md`**: Writes custom configurations, status adjustments, notes, ratings, and tags as standard frontmatter blocks into physical `.md` files in real-time.
4.  **`write-file-binary`**: Receives an `ArrayBuffer` payload from a drag-and-drop or upload operation, translating and writing the binary data directly to disk as a real `.png`, `.jpg`, etc.
5.  **`delete-asset-file`**: Safely deletes both the physical image file and its companion markdown metadata file from the native filesystem on command.
6.  **`create-board-directory`**: Dynamically creates real folders on the native storage using `fs.mkdirSync(..., { recursive: true })`.
7.  **`delete-board-directory`**: Prunes physical folders. When configured to preserve files, it dynamically moves contained files to the vault root first using `fs.renameSync` before removing the board folder.

### 2. Silent Vault Auto-Restoration Lifecycle
To match the seamless experience of Obsidian, the `VaultApp` initializes an automated restoration cycle:
1.  **Read Local Storage**: Reads the active vault's absolute path from the local catalog configuration cache (`storage.getVaultPath()`).
2.  **Native Handshake**: If `window.electronAPI` is active, it calls the `scanVault` handler with the active path.
3.  **Silent File Indexing**: Electron recursively reads the physical directories, registers subfolders as Visual Boards, matches visual assets to companion `.md` files, and returns the compiled list of records.
4.  **Instant UI Rendering**: Updates the masonry view, renders visual board metrics, and resolves the local file URLs using the privileged `visual-vault://` protocol safely. The user has their entire workspace instantly restored without seeing a single permission dialog or file selection prompt!

---

## Desktop Compilations & Core Build Steps

Vite compiles code to static ES files. Electron picks these up directly from the `/dist` directory.

### Relative Import Configuration (`vite.config.ts`)
To allow Electron's file loader (`win.loadFile()`) to successfully find built assets relative to the local directories rather than expecting an absolute server root, the `config` has `base` redirected:
```ts
export default defineConfig({
  base: './', // Crucial: Ensures dist/index.html reads scripts as ./assets/ instead of /assets/
  plugins: [react(), tailwindcss()],
});
```

### Script Execution Commands

During project updates, use these actions inside your package manager shell:

- **Standard Local Hot Dev** (bypasses Electron wrappers for fast web iterations):
  ```bash
  npm run dev
  ```
- **Local Application Lint Verification**:
  ```bash
  npm run lint
  ```
- **Electron Container Sandbox Run**:
  ```bash
  npm run electron:start
  ```
- **Build & Package Windows Executable (`.exe` in `dist-win/`)**:
  ```bash
  npm run electron:build
  ```
- **Build & Package macOS App Bundle (`.app` in `dist-mac/` for Intel & Apple Silicon)**:
  ```bash
  npm run electron:build:mac
  ```
- **Build & Package All Platforms Simultaneously (`dist-all/`)**:
  ```bash
  npm run electron:build:all
  ```

---

## Maintenance Checklist for Future Developers

1. **Keep Web Components Native**: If integrating libraries like Recharts or D3 in future updates, ensure they mount inside the native element's DOM nodes or within shadow contexts without disrupting event flows.
2. **Ensure File Path Safety**: When writing absolute file paths via custom scripts, sanitize paths with URL encoding to prevent system crashes across different operating systems.
3. **Optimize Procedural Mocking**: Ensure changes to standard visual asset blueprints are registered in `defaultMockAssets()` in `src/main.tsx` to preserve default values for first-time builders.
