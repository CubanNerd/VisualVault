# VisualVault Desktop Compilation & Integration Guide
*Last Updated: June 20, 2026*

This guide provides comprehensive, step-by-step instructions on how to compile this Web Component-based **VisualVault** application into a native desktop application using either **Tauri** or **Electron**, with local **SQLite** persistent database integration.

---

## 1. Architectural Overview & SQLite Integration

Currently, VisualVault uses a custom `StorageService` that mocks database operations in standard browser `localStorage` (referred to in logs as `catalog.db`). 

To convert this to a native SQLite database on the desktop:
- **Tauri Route**: You will use Rust's `tauri-plugin-sql` or direct SQLite bindings with `rusqlite` to handle queries in the Rust core, exposed via Tauri Commands (`invoke`).
- **Electron Route**: You will use a Node.js SQLite driver such as `better-sqlite3` or `sqlite3` in the Node.js main process, bridged to the frontend using Electron's `ipcRenderer`/`contextBridge`.

Since our frontend is built with pure VanillaJS and reactive Web Components (`src/main.tsx` compile to `dist/`), the transition is exceptionally smooth—we simply replace or augment the `StorageService` class to call our desktop native APIs when running in a desktop environment.

---

## 2. Option A: Packaging with Tauri (Recommended)

Tauri produces extremely lightweight binaries (~10-15MB) because it leverages the operating system's native Webview (Webkit/WebView2) and uses Rust for its backend security and speed.

### Step 1: Pre-requisites
Make sure you have Rust and Cargo installed on your system:
- **macOS / Linux**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Windows**: Install the Rustup installer from [rustup.rs](https://rustup.rs/) and Visual Studio Build Tools with C++ workloads.

### Step 2: Initialize Tauri in the Project

> **CRITICAL WARNING FOR EXISTING PROJECTS:**
> Do **NOT** run `npm create tauri-app` (or `npm create tauri-app@latest`). That command is designed for bootstrapping **brand-new, empty projects** from scratch and will create an independent nested folder with generic template files instead of integrating with your existing code.
> 
> Instead, to integrate Tauri directly into this **existing** React/TypeScript codebase, you must initialize Tauri directly from the current root directory by running:
> ```bash
> npx tauri init
> ```
> This command will construct a `src-tauri` directory **internally within your current folder** and leverage your existing `package.json`, `src/`, `vite.config.ts`, and Vite build outputs (`dist/`), rather than creating a nested project.
> 
> **How to fix this if you used `npm create tauri-app` by mistake:**
> 1. Delete the incorrect nested folder (or rename it):
>    ```bash
>    rm -rf "Visual Vault"
>    ```
> 2. Ensure you are in your actual existing project root folder in your terminal, and run:
>    ```bash
>    npx tauri init
>    ```

Tauri will ask you several questions. Answer them as follows:
- **What is your app name?** `VisualVault`
- **What is the window title?** `VisualVault - Workspace Reference Library`
- **Where are your web assets located?** `../dist` (relative to the created `src-tauri` folder)
- **What is the url of your dev server?** `http://localhost:3000`
- **What is your frontend build command?** `npm run build`
- **What is your frontend dev command?** `npm run dev`

### Step 3: Add SQLite Plugin to Tauri
Tauri officially supports SQL databases using the `tauri-plugin-sql` plugin.
1. Add the dependency to your `src-tauri/Cargo.toml`:
```toml
[dependencies]
tauri-plugin-sql = { version = "2", features = ["sqlite"] } # Use version compatible with your Tauri version
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

### Step 4: Bridge SQLite in Frontend (`StorageService`)
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
    } else {
      // Fallback to localStorage standard mechanisms
    }
  }
}
```

### Step 5: Build the Tauri Desktop Executable
Run the Tauri compiler to bundle the production executable:
```bash
npm run build         # Compiles our Vite assets into dist/
npx tauri build       # Bundles high-performance Rust executable for Windows (.msi/.exe), macOS (.app/.dmg), or Linux (.deb)
```

---

## 3. Option B: Packaging with Electron

Electron runs on Node.js and Chromium. While heavier (80MB+), it provides unparalleled APIs and ecosystem compatibility.

### Step 1: Install Electron Dependencies
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

### Step 2: Create Electron Main Process File (`electron-main.js`)
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

### Step 3: Create Preload Script (`electron-preload.js`)
Create a preload script to expose the IPC SQLite channels safely without exposing complete Node APIs:

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  getAllAssets: () => ipcRenderer.invoke('sqlite-all-assets'),
  insertAsset: (asset) => ipcRenderer.invoke('sqlite-insert-asset', asset)
});
```

### Step 4: Bridge SQLite in Frontend
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

### Step 5: Configure Build Action Script in `package.json`

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

### Step 6: Compile the Electron Executable for Windows & macOS

With the packaging configuration established, you can build production-ready binary distributions for Windows or macOS natively or via cross-compilation.

#### 1. Compiling for Windows (`.exe` / `win32`)

*   **Prerequisites**: Standard Node.js environment. No unique native compiler tools are required if packaging from a native Windows terminal.
*   **Target Architectures**: Configured for `x64` (64-bit systems).
*   **Compilation Command**:
    ```bash
    npm run electron:build
    ```
*   **Output Directory**: The compiled Windows folder containing `VisualVault.exe` and its supporting resources will be generated in `./dist-win/`.
*   **Cross-compilation Note**: If compiling for Windows from a macOS or Linux host, you must have `wine` (Wine Is Not an Emulator) installed on your development host in order to write appropriate executable metadata headers. Otherwise, it is highly recommended to run this command directly on a Windows platform.

#### 2. Compiling for macOS (`.app` / `darwin`)

*   **Prerequisites**: Apple hosts must have **Xcode Command Line Tools** installed. You can install them by running:
    ```bash
    xcode-select --install
    ```
*   **Target Architectures**: Configured for `all` targets, which bundles binaries for both **Apple Silicon** (M1/M2/M3/M4, `arm64`) and **Intel Processors** (`x64`) for seamless cross-architecture support.
*   **Compilation Command**:
    ```bash
    npm run electron:build:mac
    ```
*   **Output Directory**: The compiled macOS app bundle `VisualVault.app` will be created inside `./dist-mac/`.
*   **Packaging for Users**: To distribute the compiled macOS bundle, developers typically wrap the `.app` file in a DMG installer (using tools like `create-dmg` or `appdmg`) or compress it into a native `.zip` directory.
*   **Code Signing / Notarization**: To avoid the standard *"App is from an unidentified developer"* macOS Gatekeeper warning, you must sign the binary with an Apple Developer Account using `electron-osx-sign` or register it via `notarize`.

#### 3. Compiling for All Supported Platforms Simultaneously

*   To execute an encompassing sweep and output distributions for Windows, macOS, and Linux in a single package chain, execute:
    ```bash
    npm run electron:build:all
    ```
    This yields a master `./dist-all/` structure housing binaries mapped across all targeted target environments.

---

## 4. Native Filesystem Integration & Automated Obsidian-Style Vault Restoration

One of the secondary benefits of packaging as a desktop app is bypassing the browser's sandbox restrictions on local directories! VisualVault implements a **fully local-first, zero-prompt automated vault restoration system** that mimics Obsidian's native folder handling.

### How it works:
When running inside the Electron container, the app exposes a high-performance native bridge via `preload.cjs` (`window.electronAPI`), giving the React frontend access to Node's robust `fs` and `path` modules safely without exposing raw Node capabilities to the browser context directly.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               ELECTRON CONTAINER                            │
│                                                                             │
│  ┌──────────────────────┐   scanVault()   ┌──────────────────────────────┐  │
│  │   React/Vite Core    │ ──────────────> │      Electron Main Process   │  │
│  │  (main.tsx/index)    │ <────────────── │     (electron-main.cjs)      │  │
│  └──────────────────────┘   assets JSON   └──────────────────────────────┘  │
│              │                                           │                  │
│              ▼ (LocalStorage)                            ▼ (Physical Disk)  │
│     Saves vaultPath string                    Scans folders, reads/writes   │
│     e.g. "/Users/design/MyVault"              real image files & YAML .md   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### IPC Interface Architecture (`preload.cjs`):
The context bridge exposes several native APIs:
*   `selectDirectory()`: Invokes a native Electron directory selection dialog.
*   `scanVault(vaultPath)`: Recursively scans a selected directory on the user's disk, finding all image assets (`.png`, `.jpg`, `.webp`, `.svg`, etc.) and parsing any corresponding companion Markdown (`.md`) frontmatter descriptors.
*   `writeCompanionMD(vaultPath, board, assetName, yamlContent)`: Commits updated metadata configurations back to a physical Obsidian `.md` file inside the vault.
*   `writeFileBinary(vaultPath, board, assetName, arrayBuffer)`: Commits imported image uploads as real binary files back to the corresponding folders.
*   `deleteAssetFile(vaultPath, board, assetName)`: Removes both the physical image file and its companion markdown metadata file from the local disk when deleted.
*   `createBoardDirectory(vaultPath, boardPath)`: Dynamically creates new subdirectories inside the physical vault.
*   `deleteBoardDirectory(vaultPath, boardPath, keepFiles)`: Prunes physical subfolders, recursively handling file preservation or deletion safety parameters on-disk.

---

### Obsidian-Style Silent Vault Restoration:
Obsidian guarantees a seamless experience by storing the last opened vault's absolute directory path inside a configuration cache. When the app launches, it reads that path and re-opens the directory immediately without bothering the user with file explorer pickers or permission dialogues. 

VisualVault achieves this by running a restoration checklist on startup:
1. When `checkAndRestoreLocalVaults()` executes inside `src/main.tsx`, it checks if the platform is running inside Electron (`window.electronAPI`).
2. If it is, and a stored vault path is retrieved via `storage.getVaultPath()`, the app calls `window.electronAPI.scanVault(activePath)` directly.
3. The folder is scanned, its files are re-indexed, and their custom metadata is parsed and loaded **silently and automatically in milliseconds**, with zero user permission popups required!
4. The visual cards are rendered immediately, and the custom scheme `visual-vault://` handles secure native loading of files from the absolute path.

---

## 5. Security & Custom Protocol Handlers

Standard browser contexts block loading local assets via absolute `file://` URLs for security reasons (cross-origin script checks). To solve this gracefully in the desktop app, VisualVault registers a privileged custom protocol handler:

*   **Protocol Name**: `visual-vault://`
*   **Main Process Registration**:
    ```javascript
    protocol.registerSchemesAsPrivileged([
      { scheme: 'visual-vault', privileges: { bypassCSP: true, secure: true, supportFetchAPI: true } }
    ]);
    ```
*   **Usage**: Absolute paths such as `/Users/design/Concept_Universe/Environment_Ref/city.png` are dynamically translated on the frontend into `visual-vault:///Users/design/Concept_Universe/Environment_Ref/city.png`. Electron safely intercepts these network streams, decodes the absolute local path, and pipes the binary asset directly to the layout viewer safely!
