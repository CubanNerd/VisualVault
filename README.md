# VisualVault — Obsidian Local-First Catalog
*Last Updated: July 8, 2026 (v1.1.0)*

An obsidian-style, local-first cataloging workspace for reference images, design assets, blueprints, and concept art databases. Designed for creatives who need a fast, eye-safe, high-contrast, offline-capable asset inspector with dynamic tagging meshes and color grid extraction.

---

## Repository Guides & Documentation

To help you get started quickly or inspect the internal architecture, we have created dedicated knowledge base modules:
*   **[User Guide & Knowledge Base](./docs/USER_GUIDE.md)**: Standard operations guide detailing workspace configuration options, the two core user profiles, folder management, dynamic YAML metadata sync, and local folder permission overrides.
*   **[Developer Architecture & Integration Guide](./docs/DEVELOPER_GUIDE.md)**: Technical maintenance manual detailing custom web component lifecycles, database partitions, event delegator tracking, regex YAML parsing engines, and local Electron wrappers.

---

## Key Features

- **Obsidian-Style Vault Manager**: Switch smoothly between isolated physical directories (e.g., `/Users/design/...`), persist distinct databases in Indexed/Local Storage, and register new vaults dynamically.
- **Persistent Vault Sync (New in v1.1.0)**: In Electron mode, the app automatically persists and restores your selected local vault path across desktop sessions by maintaining a native `user-settings.json` file inside the application data directory.
- **Editable Smart Folders (New in v1.1.0)**: Configure and live-update filters, names, custom icons, and tag rules for virtual containers on the fly via a dedicated modal editor.
- **Custom Schema & Status Configurator**: Dynamically adjust metadata property names, placeholder values, and asset statuses. Supports importing and exporting configurations using structured `.json` files.
- **Color Extraction Grid**: Built-in visual palette calculator that derives prominent color blocks from imported images.
- **Google Fonts & Typography System**: Shift layout typefaces between highly readable fonts including **Space Mono**, **Space Grotesk**, **Lexend**, **Tektur**, and **IBM Plex Mono**, on top of classic Inter, Outfit, and Playfair Display styles.
- **Design Typography Themes**: Shift layouts dynamically between Obsidian Charcoal, Notion Minimalist (Off-White), and Y2K CRT Matrix terminal interfaces.
- **Integrated Markdown/YAML Editor**: Inspect, edit, and write asset metadata sidebars directly synced with local Obsidian `.md` vault specifications.

---

## Running From a Remote Web Server with Local Folders

In response to: *"is it possible to run this from a remote web server but load local folders?"*

**Yes!** It is fully possible, though standard browser sandboxing prevents a remote website from directly and silently reading raw absolute filesystem paths (like `/Users/design/...` or `C:\Users\...`). 

To achieve this in a remote environment, you can use one of these three elegant approaches:

### 1. The File System Access API (Fully Client-Side)
Modern browsers (Chrome, Edge, Opera) support the `showDirectoryPicker()` API.
- **How it works**: The remote web page prompts you once to select your local folder.
- **No Uploading**: The browser indexes files, parses metadata, and extracts images completely locally in memory. **None** of your assets are uploaded to the remote server.
- **Sync**: Changes can be saved directly back to the local folder.

### 2. Local Companion Sync Daemon (Recommended for Native Obsidian Workflows)
Run a lightweight, private local script (e.g., Python or Node.js Express server) on your local machine that exposes a secure CORS API (e.g., `http://localhost:8080/index`):
- **How it works**: The remote web app sends queries to your local daemon to list and parse assets inside specified vault folders.
- **Storage**: Highly secure and extremely fast, functioning exactly like Obsidian's native system connectors.

### 3. Local-First Build (Electron Wrapper)
You can compile this web project into a native executable app (Windows/macOS/Linux). It runs locally as a desktop companion, granting it full native permissions to read and monitor directories without browser sandbox restrictions.

---

## Development & Toolchain Guide

### 1. Setup Dependencies
To load and synchronize standard package dependencies:
```bash
npm install
```

### 2. Launch Local Dev Server
To start the standard web application workspace locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the workspace in your browser.

### 3. Desktop Application Preview (Electron)
To launch this workspace in an isolated native desktop window wrapper:
```bash
npm run electron:start
```

### 4. Build Desktop Executables (Windows & macOS)

*   **For Windows Platform (`.exe` output inside `/dist-win`)**:
    The Windows configuration has been thoroughly compiled and tested to execute flawlessly out-of-the-box on Windows hosts:
    ```bash
    npm run electron:build
    ```
    This command bundles all static assets into `dist/` and runs `electron-packager` to release a standalone Windows directory.
    
*   **For macOS Platform (`.app` output inside `/dist-mac` for Intel & Apple Silicon)**:
    Ensure Xcode Command Line Tools are initialized (`xcode-select --install`) and execute:
    ```bash
    npm run electron:build:mac
    ```

*   **For All Supported Platforms (`dist-all/` output for cross-distribution sweeps)**:
    ```bash
    npm run electron:build:all
    ```

---

## Themes Available

1. **Obsidian Dark**: Safe, ambient dark layout with emerald and glowing obsidian purple accent tones.
2. **Notion Minimalist**: Pristine Notion-inspired off-white canvas with clean typography and slate gray borders.
3. **Y2K CRT Matrix**: Retro hacker console theme with scanline effects and glowing terminal matrix greens.
