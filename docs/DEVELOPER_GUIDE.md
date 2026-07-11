# VisualVault Developer Architecture & Maintenance Guide
*Last Updated: July 11, 2026 (v1.0.0)*

Welcome to the comprehensive **VisualVault Developer Architecture & Maintenance Guide**. This document outlines the application's design, architectural patterns, state managers, tech stack, build pipelines, and Electron desktop integration. It is written to aid developers with future maintenance, updates, or native platform ports.

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
| **Vite** | `^6.2.3` | Development server, asset packager, and ES module builder (`base: './'` for Electron). |
| **Tailwind CSS (v4)** | `^4.1.14` | Utility-first styling with `@tailwindcss/vite`. |
| **Electron** | `^42.4.1` | Desktop runtime with IPC, custom protocol, and native filesystem access. |
| **electron-builder** | `^24.13.3` | Primary Windows/macOS packaging (NSIS installer on Windows). |
| **electron-packager** | `^17.1.2` | Optional alternate packager (`npm run packager:build`). |
| **lucide** | `^1.23.0` | SVG icon set for toolbars and Smart Folder icons. |

---

## Core Modules & Workspace Structure

```
/
├── package.json               # Scripts, dependencies, electron-builder `build.files`
├── vite.config.ts             # Bundler settings (`base: './'` for packaged relative assets)
├── electron-main.cjs          # Main process: window, IPC, visual-vault protocol, vault scan
├── preload.cjs                # Context bridge → window.electronAPI (MUST be packaged)
├── public/                    # Icons (icon.png, icon.ico) copied into builds
├── src/
│   ├── main.tsx               # VaultApp Web Component (UI, storage, Electron restore)
│   ├── index.css              # Global styles + Tailwind v4
│   └── lib/
│       ├── types.ts           # Asset / metadata schemas
│       ├── procedural.ts      # SVG fallbacks when an image fails to load
│       ├── color.ts           # Palette extraction
│       ├── taxonomy.ts        # Tag presets
│       ├── frontmatter.ts     # YAML companion .md read/write
│       ├── visual-vault-url.ts# Absolute path → visual-vault:// URL helper
│       └── seeds.ts           # Demo mock assets
├── docs/                      # USER_GUIDE.md, DEVELOPER_GUIDE.md
└── README.md
```

**Packaging note:** `package.json` → `build.files` must include `dist/**/*`, `electron-main.cjs`, `preload.cjs`, `public/icon.png`, and `package.json`. Omitting `preload.cjs` disables `window.electronAPI` in production (no vault scan, no companion `.md` writes, broken image restore).

---

## State Partitioning & Storage System

VisualVault functions as an offline-first catalog wrapper. It manages assets, boards, active vaults, and companion settings purely on the client side using unique, namespaced local caching channels. This mirrors the behavior of Obsidian's offline-first vault catalog.

```
┌───────────────────────────────── StorageService ─────────────────────────────────┐
│                                                                                  │
│   Active Path Target Tracker: "visual_catalog_vault_path_v2"                    │
│                                                                                  │
│   ┌────────────────────────────── Connected Vault Partition ─────────────────┐   │
│   │                                                                          │   │
│   │   Vault Key: "visual_catalog_db_v3_Users_design_Desktop_Concept"          │   │
│   │   ↳ [ Asset { id: 101, path: "cyberpunk_1.jpg", board: ... } ]           │   │
│   │                                                                          │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Active Path Target Tracker
The application tracks the connected local folder path using a persistent preference key:
- **Active Path Key**: `visual_catalog_vault_path_v2`
  - Stores string path reference of the active folder directory (e.g., `/Users/projects/Cyberpunk_Grid`).

### 2. Mapped Directory Databases
To support isolated datasets for each workspace, individual asset records (including metadata stars, custom notes, color palettes, and tag meshes) are indexed separately based on the connected folder's path to prevent crosstalk.
Each connected directory compiles assets inside its own database key constructed dynamically in `src/main.tsx` via `StorageService`:

```ts
getVaultKey(): string {
  const path = this.getVaultPath();
  return `visual_catalog_db_v3_${path.replace(/[^a-zA-Z0-9_]/g, '_')}`;
}
```

This dynamic mapping separates your metadata, ensuring that when the application connects to a different workspace (e.g. from *Neo-Tokyo Concept Art* to *Mechanic Parts & Blueprint*), only the assets and annotations mapped to that specific directory folder are loaded.

### 3. Isolated Workspace Loading (Focused Solitude)
To prevent cross-talk and metadata corruption, the engine operates in a dedicated single-vault Focused Solitude state. Read and write operations target the key mapped strictly to the connected path:

```ts
// src/main.tsx
private loadAssets() {
  this.assets = storage.getAllAssets();
}
```

This ensures complete data integrity. When assets are updated or saved, they write directly to the active folder's key via:

```ts
saveAllAssets(assets: Asset[]) {
  const activeKey = this.getVaultKey();
  localStorage.setItem(activeKey, JSON.stringify(assets));
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

To provide cross-app compatibility with Obsidian, VisualVault parses and writes metadata inside standard Markdown frontmatter blocks. This logic resides in the standalone `/src/lib/frontmatter.ts` utility library:

- **YAML Reader (`parseYAMLFrontmatter`)**:
  Separates the standard Markdown body from triple-dash YAML headings using a strict regex parser:
  ```ts
  const match = text.match(/^---\r?\n([\s\S]*?)\n---\r?\n?([\s\S]*)$/);
  ```
  It splits lines by colons, converts ratings to numbers, and splits array indicators safely.

- **YAML Writer (`stringifyYAMLFrontmatter`)**:
  Builds inline-array frontmatter (parser also accepts list-style tags):
  ```yaml
  ---
  title: city skyline 01
  tags: [skyline, hologram, dense]
  artist: Studio-K
  rating: 4
  status: in-progress
  notes: Optional freeform notes
  ---
  ```

---

## Native Electron Integration

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

1. **`get-saved-vault` (New in v1.2.0)**: Reads the user's previously opened local vault directory natively from a standalone `vault-settings.json` file inside the operating system's `userData` folder.
2. **`save-vault-path` (New in v1.2.0)**: Persists the active local vault directory natively in `vault-settings.json` to enable automated vault sync.
3. **`get-saved-folder` (New in v1.1.0)**: Reads the user's previously opened local vault directory natively from a standalone `user-settings.json` file inside the operating system's `userData` folder.
4. **`save-folder` (New in v1.1.0)**: Persists the active local vault directory natively in `user-settings.json` so it can be restored on subsequent runs.
5. **`select-directory`**: Calls Electron's `dialog.showOpenDialog` with the `openDirectory` flag to return absolute folder path mappings safely.
6. **`scan-vault`**: Leverages native Node.js recursive directory reader utilities to crawl and scan folders, returning fully-indexed visual asset records (`Asset[]`) with automated YAML parsing of companion metadata markdown files.
7. **`write-companion-md`**: Writes custom configurations, status adjustments, notes, ratings, and tags as standard frontmatter blocks into physical `.md` files in real-time.
8. **`write-file-binary`**: Receives an `ArrayBuffer` payload from a drag-and-drop or upload operation, translating and writing the binary data directly to disk as a real `.png`, `.jpg`, etc.
9. **`delete-asset-file`**: Safely deletes both the physical image file and its companion markdown metadata file from the native filesystem on command.
10. **`create-board-directory`**: Dynamically creates real folders on the native storage using `fs.mkdirSync(..., { recursive: true })`.
11. **`delete-board-directory`**: Prunes physical folders. When configured to preserve files, it dynamically moves contained files to the vault root first using `fs.renameSync` before removing the board folder.

### 2. Silent Vault Auto-Restoration Lifecycle
To match the seamless experience of Obsidian, `VaultApp.checkAndRestoreLocalVaults()` runs on `connectedCallback`:

1. **Prefer native storage**: If `window.electronAPI` is present, call `getSavedVault()` then fall back to `getSavedFolder()`. These read `%APPDATA%\VisualVault\vault-settings.json` / `user-settings.json` on Windows.
2. **Do not overwrite native settings from localStorage on startup**: Paths are written to native settings only when the user explicitly picks a folder via `selectDirectory` / Sync Local Folder. A legacy demo path (`/Users/design/Desktop/Ref_Library`) is treated as invalid and cleared.
3. **Scan disk**: `scanVault(activePath)` recursively indexes images and parses companion `{basename}.md` YAML into `Asset.metadata` / `Asset.tags`.
4. **Replace localStorage cache**: `storage.saveAllAssets(assetsList)` overwrites the per-vault `visual_catalog_db_v3_*` cache. Tags survive **only** if they were on disk in companion `.md` files.
5. **Render**: Masonry cards use `visual-vault://` URLs produced by `toVisualVaultUrl()` / the scanner.

Board paths passed into IPC (e.g. `/ Environment_Ref/Neo_Tokyo`) are normalized with `normalizeBoardPath()` in `electron-main.cjs` before `path.join` so Windows joins stay under the vault root.

### 3. Tag & Metadata Persistence Model

| Layer | Location | Role |
| :--- | :--- | :--- |
| **Canonical (durable)** | `{vault}/{board}/{imageBasename}.md` | YAML frontmatter: tags, artist, rating, status, notes |
| **Runtime cache** | `localStorage` → `visual_catalog_db_v3_{sanitizedPath}` | Fast UI; replaced on every Electron rescan |
| **Vault path** | `userData` JSON + optional `visual_catalog_vault_path_v2` | Which folder to open next launch |

`updateAssetMetadata` → `saveCompanionMDFile` → `write-companion-md` IPC. Requires `window.electronAPI` (preload loaded). Without preload, tags stay in localStorage only and disappear on the next disk rescan.

---

## Desktop Compilation & Integration Guide

VisualVault ships as an Electron app. The **production** packaging path is **electron-builder** (NSIS on Windows). Companion `.md` files on the vault folder are the durable metadata store; `localStorage` is a cache. Optional SQLite migration notes are retained below for future work—they are **not** required for current tag/image persistence.

---

### 1. Runtime Storage (Current)

`StorageService` in `src/main.tsx` partitions asset JSON under `visual_catalog_db_v3_*` keys. In Electron:

- Startup **rescans the vault from disk** and overwrites that cache.
- Tag edits call `writeCompanionMD` so YAML lands next to each image.
- Do not rely on `localStorage` alone for durability in desktop builds.

### 2. Packaging with Electron (Current)

#### Required files in the asar

`BrowserWindow` loads:

```javascript
preload: path.join(__dirname, 'preload.cjs')
```

`preload.cjs` exposes `window.electronAPI` (`scanVault`, `writeCompanionMD`, `selectDirectory`, vault path getters/setters, etc.). Confirm a built package includes it:

```bash
npx asar list dist-win/win-unpacked/resources/app.asar | findstr preload
```

#### `package.json` scripts & builder config

```json
{
  "main": "electron-main.cjs",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "electron:start": "npm run build && electron electron-main.cjs",
    "electron:dev": "electron electron-main.cjs --dev",
    "electron:build": "node generate-icons.js && npm run build && electron-builder --win --x64",
    "electron:build:mac": "node generate-icons.js && npm run build && electron-builder --mac",
    "electron:build:all": "node generate-icons.js && npm run build && electron-builder --win --mac",
    "packager:build": "node generate-icons.js && npm run build && electron-packager . VisualVault --platform=win32 --arch=x64 --out=dist-win --overwrite --icon=build/icon.ico --ignore=\"(dist-win|src|tsconfig.json|vite.config.ts)\""
  },
  "build": {
    "appId": "com.visualvault.app",
    "productName": "VisualVault",
    "directories": { "output": "dist-win" },
    "files": [
      "dist/**/*",
      "electron-main.cjs",
      "preload.cjs",
      "public/icon.png",
      "package.json"
    ],
    "win": { "target": ["nsis"], "icon": "build/icon.ico" }
  }
}
```

#### Compile for Windows

```bash
npm run electron:build
```

- Output: `dist-win/VisualVault Setup *.exe` and `dist-win/win-unpacked/`.
- Close any running `VisualVault.exe` before rebuilding or `app.asar` may be locked.

#### Compile for macOS

```bash
xcode-select --install   # once
npm run electron:build:mac
```

#### Optional: electron-packager

```bash
npm run packager:build
```

---

### 3. Optional Future: SQLite

The following is a **future** migration sketch (not the current production path). Today, durable metadata is companion `.md` YAML + Electron `userData` path settings.

Install a native driver if you later move the catalog cache out of `localStorage`:

```bash
npm install better-sqlite3
npm install electron-rebuild --save-dev
npx electron-rebuild
```

Bridge via IPC/`contextBridge` similar to the existing `preload.cjs` pattern (`window.electronAPI`), keeping vault image bytes on disk and protocol-served through `visual-vault://`.

---

## Security & Custom Protocol Handlers

Browsers block arbitrary `file://` loads from app pages. VisualVault registers a privileged scheme:

* **Protocol**: `visual-vault://`
* **Privileges**: `standard`, `bypassCSP`, `secure`, `supportFetchAPI`, `stream`
* **URL helper**: `src/lib/visual-vault-url.ts` → `toVisualVaultUrl(absolutePath)` (also used in `electron-main.cjs` during vault scan)

### Windows path caveat (fixed in v1.2.0)

Chromium may rewrite:

`visual-vault:///D:/Vault/image.png`

into:

`visual-vault://d/Vault/image.png`

treating the drive letter as a hostname. The main-process handler uses `resolveVisualVaultFilePath()` to rebuild `D:\Vault\image.png`, then serves bytes with `fs.readFileSync` and the correct `Content-Type`. Do **not** naively map `visual-vault:` → `file:` and `net.fetch` on Windows without that reconstruction—images will fail with “Failed to load resource.”

### Example registration

```javascript
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'visual-vault',
    privileges: {
      standard: true,
      bypassCSP: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
]);
```

---

## Maintenance Checklist for Future Developers

1. **Keep Web Components Native**: If integrating charting libraries, mount them inside `VaultApp` DOM without breaking delegated events.
2. **Always ship `preload.cjs`**: Verify packaged `app.asar` after every electron-builder change.
3. **Ensure File Path Safety**: Use `normalizeBoardPath()` / `toVisualVaultUrl()` / `resolveVisualVaultFilePath()` for cross-platform vault I/O.
4. **Treat companion `.md` as canonical metadata**: Never assume `localStorage` alone persists tags across Electron rescans.
5. **Optimize Procedural Mocking**: Demo assets come from `defaultMockAssets()` in `src/lib/seeds.ts` when no vault is linked.
