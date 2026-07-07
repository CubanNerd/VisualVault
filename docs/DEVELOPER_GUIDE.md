# VisualVault Developer Architecture & Maintenance Guide

Welcome to the comprehensive **VisualVault Developer Architecture & Maintenance Guide**. This document outlines the application's design, architectural patterns, state managers, tech stack, build pipelines, and integrations, as well as native desktop compilation and SQLite database integration guide. It is written to aid developers with future maintenance, updates, or native platform ports.

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

```
/
├── package.json               # Script commands, dependencies, and metadata declarations
├── vite.config.ts             # Bundler settings configured with relative base output
├── electron-main.cjs          # Electron application bootstrap, window controller, and sandbox locks
├── src/
│   ├── main.tsx               # Main Application Controller (Custom Element Web Component 'VaultApp')
│   ├── index.css              # Global custom styling sheet, scrollbars, and Tailwind v4 themes
│   ├── App.tsx                # Client-Side SPA entry stub
│   └── lib/                   # Modular Helper Libraries
│       ├── types.ts           # Unified TypeScript schemas & default custom configurations
│       ├── procedural.ts      # Vector SVG graphic procedural rendering engine
│       ├── color.ts           # Advanced canvas color palette extractors and similarity calculus
│       ├── taxonomy.ts        # Tag categorization presets, storage synchronization, and UI controllers
│       ├── frontmatter.ts     # Obsidian markdown YAML frontmatter parser & writer engine
│       └── seeds.ts           # Dynamic default catalog databases & seed mock assets
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

To provide cross-app compatibility with Obsidian, VisualVault parses and writes metadata inside standard Markdown frontmatter blocks. This logic resides in the standalone `/src/lib/frontmatter.ts` utility library:

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

1. **`select-directory`**: Calls Electron's `dialog.showOpenDialog` with the `openDirectory` flag to return absolute folder path mappings safely.
2. **`scan-vault`**: Leverages native Node.js recursive directory reader utilities to crawl and scan folders, returning fully-indexed visual asset records (`Asset[]`) with automated YAML parsing of companion metadata markdown files.
3. **`write-companion-md`**: Writes custom configurations, status adjustments, notes, ratings, and tags as standard frontmatter blocks into physical `.md` files in real-time.
4. **`write-file-binary`**: Receives an `ArrayBuffer` payload from a drag-and-drop or upload operation, translating and writing the binary data directly to disk as a real `.png`, `.jpg`, etc.
5. **`delete-asset-file`**: Safely deletes both the physical image file and its companion markdown metadata file from the native filesystem on command.
6. **`create-board-directory`**: Dynamically creates real folders on the native storage using `fs.mkdirSync(..., { recursive: true })`.
7. **`delete-board-directory`**: Prunes physical folders. When configured to preserve files, it dynamically moves contained files to the vault root first using `fs.renameSync` before removing the board folder.

### 2. Silent Vault Auto-Restoration Lifecycle
To match the seamless experience of Obsidian, the `VaultApp` initializes an automated restoration cycle:
1. **Read Local Storage**: Reads the active vault's absolute path from the local catalog configuration cache (`storage.getVaultPath()`).
2. **Native Handshake**: If `window.electronAPI` is active, it calls the `scanVault` handler with the active path.
3. **Silent File Indexing**: Electron recursively reads the physical directories, registers subfolders as Visual Boards, matches visual assets to companion `.md` files, and returns the compiled list of records.
4. **Instant UI Rendering**: Updates the masonry view, renders visual board metrics, and resolves the local file URLs using the privileged `visual-vault://` protocol safely. The user has their entire workspace instantly restored without seeing a single permission dialog or file selection prompt!

---

## Desktop Compilation & Integration Guide

This section provides comprehensive, step-by-step instructions on how to compile VisualVault into a native desktop application using either **Tauri** or **Electron**, with local **SQLite** persistent database integration.

---

### 1. SQLite Integration

Currently, VisualVault uses a custom `StorageService` that cache database operations in standard browser `localStorage` (referred to in logs as `catalog.db`). 

To convert this to a native SQLite database on the desktop:
- **Tauri Route**: You will use Rust's `tauri-plugin-sql` or direct SQLite bindings with `rusqlite` to handle queries in the Rust core, exposed via Tauri Commands (`invoke`).
- **Electron Route**: You will use a Node.js SQLite driver such as `better-sqlite3` or `sqlite3` in the Node.js main process, bridged to the frontend using Electron's `ipcRenderer`/`contextBridge`.

Since our frontend is built with pure VanillaJS and reactive Web Components (`src/main.tsx` compile to `dist/`), the transition is exceptionally smooth—we simply replace or augment the `StorageService` class to call our desktop native APIs when running in a desktop environment.

---

### 2. Option A: Packaging with Tauri (Recommended)

Tauri produces extremely lightweight binaries (~10-15MB) because it leverages the operating system's native Webview (Webkit/WebView2) and uses Rust for its backend security and speed.

#### Step 1: Prerequisites
Make sure you have Rust and Cargo installed on your system:
- **macOS / Linux**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Windows**: Install the Rustup installer from [rustup.rs](https://rustup.rs/) and Visual Studio Build Tools with C++ workloads.

#### Step 2: Initialize Tauri in the Project

Do **NOT** run `npm create tauri-app`. That command is designed for bootstrapping brand-new, empty projects from scratch and will create an independent nested folder with generic template files instead of integrating with your existing code.

Instead, to integrate Tauri directly into this **existing** codebase, you must initialize Tauri directly from the current root directory by running:
```bash
npx tauri init
```
This command will construct a `src-tauri` directory **internally within your current folder** and leverage your existing `package.json`, `src/`, `vite.config.ts`, and Vite build outputs (`dist/`), rather than creating a nested project.

Tauri will ask you several questions. Answer them as follows:
- **What is your app name?** `VisualVault`
- **What is the window title?** `VisualVault - Workspace Reference Library`
- **Where are your web assets located?** `../dist` (relative to the created `src-tauri` folder)
- **What is the url of your dev server?** `http://localhost:3000`
- **What is your frontend build command?** `npm run build`
- **What is your frontend dev command?** `npm run dev`

#### Step 3: Add SQLite Plugin to Tauri
Tauri officially supports SQL databases using the `tauri-plugin-sql` plugin.
1. Add the dependency to your `src-tauri/Cargo.toml`:
```toml
[dependencies]
tauri-plugin-sql = { version = "2", features = ["sqlite"] }
```
2. Initialize the plugin in your Rust main entry point (`src-tauri/src/main.rs` or `src-tauri/src/lib.rs`):
```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

#### Step 4: Bridge SQLite in Frontend (`StorageService`)
In your frontend code (inside the `StorageService` in `src/main.tsx`), import the Tauri SQL plugin dynamically. For example, replace or extend `StorageService`'s fetch helpers:

```typescript
import Database from "tauri-plugin-sql-api";

class StorageService {
  private db: Database | null = null;

  async initDatabase() {
    if (window.__TAURI__) {
      // Connects to a local SQLite file in the OS AppData/Documents directory automatically!
      this.db = await Database.load("sqlite:visual_vault.db");
      
      // Seed SQLite schema tables
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS assets (
          id TEXT PRIMARY KEY,
          name TEXT,
          board TEXT,
          resolution TEXT,
          approxSize TEXT,
          primaryColor TEXT,
          colors TEXT, -- JSON array of color hex codes
          vaultPath TEXT,
          metadata TEXT -- JSON stringified AssetMetadata
        )
      `);
    }
  }

  // Example of SQLite native save:
  async saveAsset(asset: Asset) {
    if (this.db) {
      await this.db.execute(`
        INSERT OR REPLACE INTO assets (id, name, board, resolution, approxSize, primaryColor, colors, vaultPath, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        asset.id, 
        asset.name, 
        asset.board, 
        asset.resolution, 
        asset.approxSize, 
        asset.primaryColor, 
        JSON.stringify(asset.colors), 
        asset.vaultPath, 
        JSON.stringify(asset.metadata)
      ]);
    }
  }
}
```

#### Step 5: Build the Tauri Desktop Executable
Run the Tauri compiler to bundle the production executable:
```bash
npm run build         # Compiles our Vite assets into dist/
npx tauri build       # Bundles high-performance Rust executable
```

---

### 3. Option B: Packaging with Electron

Electron runs on Node.js and Chromium. While heavier (80MB+), it provides unparalleled APIs and ecosystem compatibility.

#### Step 1: Install Electron Dependencies
Install electron and compiler development dependencies:
```bash
npm install electron electron-builder --save-dev
```

And install the SQLite native compiler package:
```bash
npm install better-sqlite3
```

*(Note: Sometimes better-sqlite3 requires rebuilding for electron targets using `electron-rebuild`)*:
```bash
npm install electron-rebuild --save-dev
npx electron-rebuild
```

#### Step 2: Create Electron Main Process File (`electron-main.js`)
Create a file named `electron-main.js` in your root directory:

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

// Setup standard SQLite native store in user directory path
const dbPath = path.join(app.getPath('userData'), 'visual_vault.db');
const db = new Database(dbPath);

// Initialize DB schema structures
db.prepare(`
  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    name TEXT,
    board TEXT,
    resolution TEXT,
    approxSize TEXT,
    primaryColor TEXT,
    colors TEXT,
    vaultPath TEXT,
    metadata TEXT
  )
`).run();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "VisualVault - Workspace Reference Library",
    backgroundColor: '#0A0A0B',
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the web app compiled in Vite's dist folders
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  
  // Close handler
  mainWindow.on('closed', () => { mainWindow = null; });
}

// Inter-process communication handler for SQLite queries
ipcMain.handle('sqlite-all-assets', async () => {
  return db.prepare("SELECT * FROM assets").all();
});

ipcMain.handle('sqlite-insert-asset', async (event, asset) => {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO assets (id, name, board, resolution, approxSize, primaryColor, colors, vaultPath, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return insert.run(
    asset.id,
    asset.name,
    asset.board,
    asset.resolution,
    asset.approxSize,
    asset.primaryColor,
    JSON.stringify(asset.colors),
    asset.vaultPath,
    JSON.stringify(asset.metadata)
  );
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

#### Step 3: Create Preload Script (`electron-preload.js`)
Create a preload script to expose the IPC SQLite channels safely without exposing complete Node APIs:

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  getAllAssets: () => ipcRenderer.invoke('sqlite-all-assets'),
  insertAsset: (asset) => ipcRenderer.invoke('sqlite-insert-asset', asset)
});
```

#### Step 4: Bridge SQLite in Frontend
Update your `StorageService` client in `src/main.tsx` to utilize the Electron desktop context bridge:

```typescript
class StorageService {
  async getAllAssets() {
    if ((window as any).desktopAPI) {
      // Direct SQLite query from native process!
      const raw = await (window as any).desktopAPI.getAllAssets();
      return raw.map((item: any) => ({
        ...item,
        colors: JSON.parse(item.colors),
        metadata: JSON.parse(item.metadata)
      }));
    }
    
    // Fallback if running on the web browser sandbox
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }
}
```

#### Step 5: Configure Build Action Script in `package.json`

To package this workspace seamlessly, ensure that your `package.json` designates `electron-main.cjs` as the primary entrypoint and includes compilation targets for Windows and macOS. The scripts have been pre-configured as follows:

```json
{
  "main": "electron-main.cjs",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "electron:start": "npm run build && electron electron-main.cjs",
    "electron:dev": "electron electron-main.cjs --dev",
    "electron:build": "npm run build && electron-packager . VisualVault --platform=win32 --arch=x64 --out=dist-win --overwrite --ignore=\"(dist-win|src|tsconfig.json|vite.config.ts)\"",
    "electron:build:mac": "npm run build && electron-packager . VisualVault --platform=darwin --arch=all --out=dist-mac --overwrite --ignore=\"(dist-mac|src|tsconfig.json|vite.config.ts)\"",
    "electron:build:all": "npm run build && electron-packager . VisualVault --platform=all --arch=all --out=dist-all --overwrite --ignore=\"(dist-all|src|tsconfig.json|vite.config.ts)\""
  }
}
```

---

#### Step 6: Compile the Electron Executable for Windows & macOS

With the packaging configuration established, you can build production-ready binary distributions for Windows or macOS natively or via cross-compilation.

##### 1. Compiling for Windows (`.exe` / `win32`)

- **Prerequisites**: Standard Node.js environment. No unique native compiler tools are required if packaging from a native Windows terminal.
- **Target Architectures**: Configured for `x64` (64-bit systems).
- **Compilation Command**:
  ```bash
  npm run electron:build
  ```
- **Output Directory**: The compiled Windows folder containing `VisualVault.exe` and its supporting resources will be generated in `./dist-win/`.
- **Cross-compilation Note**: If compiling for Windows from a macOS or Linux host, you must have `wine` (Wine Is Not an Emulator) installed on your development host in order to write appropriate executable metadata headers. Otherwise, it is highly recommended to run this command directly on a Windows platform.

##### 2. Compiling for macOS (`.app` / `darwin`)

- **Prerequisites**: Apple hosts must have **Xcode Command Line Tools** installed. You can install them by running:
  ```bash
  xcode-select --install
  ```
- **Target Architectures**: Configured for `all` targets, which bundles binaries for both **Apple Silicon** (M1/M2/M3/M4, `arm64`) and **Intel Processors** (`x64`) for seamless cross-architecture support.
- **Compilation Command**:
  ```bash
  npm run electron:build:mac
  ```
- **Output Directory**: The compiled macOS app bundle `VisualVault.app` will be created inside `./dist-mac/`.
- **Packaging for Users**: To distribute the compiled macOS bundle, developers typically wrap the `.app` file in a DMG installer or compress it into a native `.zip` directory.
- **Code Signing / Notarization**: To avoid the standard Gatekeeper warning, sign the binary with an Apple Developer Account using `electron-osx-sign` or register it via `notarize`.

##### 3. Compiling for All Supported Platforms Simultaneously

To execute an encompassing sweep and output distributions for Windows, macOS, and Linux in a single package chain, execute:
```bash
npm run electron:build:all
```
This yields a master `./dist-all/` structure housing binaries mapped across all targeted target environments.

---

## Security & Custom Protocol Handlers

Standard browser contexts block loading local assets via absolute `file://` URLs for security reasons (cross-origin script checks). To solve this gracefully in the desktop app, VisualVault registers a privileged custom protocol handler:

* **Protocol Name**: `visual-vault://`
* **Main Process Registration**:
  ```javascript
  protocol.registerSchemesAsPrivileged([
    { scheme: 'visual-vault', privileges: { bypassCSP: true, secure: true, supportFetchAPI: true } }
  ]);
  ```
* **Usage**: Absolute paths such as `/Users/design/Concept_Universe/Environment_Ref/city.png` are dynamically translated on the frontend into `visual-vault:///Users/design/Concept_Universe/Environment_Ref/city.png`. Electron safely intercepts these network streams, decodes the absolute local path, and pipes the binary asset directly to the layout viewer safely!

---

## Maintenance Checklist for Future Developers

1. **Keep Web Components Native**: If integrating libraries like Recharts or D3 in future updates, ensure they mount inside the native element's DOM nodes or within shadow contexts without disrupting event flows.
2. **Ensure File Path Safety**: When writing absolute file paths via custom scripts, sanitize paths with URL encoding to prevent system crashes across different operating systems.
3. **Optimize Procedural Mocking**: Ensure changes to standard visual asset blueprints are registered in `defaultMockAssets()` in `src/main.tsx` to preserve default values for first-time builders.
