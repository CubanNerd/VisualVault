# VisualVault — Obsidian Local-First Catalog

An obsidian-style, local-first cataloging workspace for reference images, design assets, blueprints, and concept art databases. Designed for creatives who need a fast, eye-safe, high-contrast, offline-capable asset inspector with dynamic tagging meshes and color grid extraction.

---

## 🚀 Key Features

- **Obsidian-Style Vault Manager**: Switch smoothly between isolated physical directories (e.g., `/Users/design/...`), persist distinct databases in Indexed/Local Storage, and register new vaults dynamically.
- **Color Extraction Grid**: Built-in visual palette calculator that derives prominent color blocks from imported images.
- **Design Typography Themes**: Shift layouts dynamically between Obsidian Charcoal, Notion Minimalist (Off-White), and Y2K CRT Matrix terminal interfaces.
- **Integrated Markdown/YAML Editor**: Inspect, edit, and write asset metadata sidebars directly synced with local Obsidian `.md` vault specifications.

---

## 🌐 Running From a Remote Web Server with Local Folders

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

## 🛠️ Development & Toolchain Guide

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

### 4. Build Windows Executable (.exe)
Since packaging a Windows executable directly requires native system tools (such as `wine64` on UNIX environments), compiling from Linux/macOS to Windows requires a target machine or local node packaging client:
```bash
npm run electron:build
```
This script compiles production-ready assets and triggers `electron-packager` to output a win32 distribution folder inside the `/dist-win` directory.

---

## 🎨 Themes Available

1. **Obsidian Dark**: Safe, ambient dark layout with emerald and glowing obsidian purple accent tones.
2. **Notion Minimalist**: Pristine Notion-inspired off-white canvas with clean typography and slate gray borders.
3. **Y2K CRT Matrix**: Retro hacker console theme with scanline effects and glowing terminal matrix greens.
