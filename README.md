# VisualVault — Obsidian Local-First Catalog
*Last Updated: July 11, 2026 (v1.0.0)*

An Obsidian-style, local-first cataloging workspace for reference images, design assets, blueprints, and concept art. Built for creatives who need a fast, offline-capable asset inspector with dynamic tagging, companion YAML metadata, and color grid extraction.

---

## Repository Guides & Documentation

*   **[User Guide & Knowledge Base](./docs/USER_GUIDE.md)**: Workspace setup, vaults/boards, tags & Obsidian sync, and desktop folder restoration.
*   **[Developer Architecture & Integration Guide](./docs/DEVELOPER_GUIDE.md)**: Web component lifecycle, storage partitions, Electron IPC, `visual-vault://` protocol, and packaging.

---

## Key Features

- **Focused Folder Sync**: Connect a local vault directory and map boards/subfolders into visual cards.
- **Persistent Desktop Vault Sync**: Electron restores your last vault from OS `userData` settings (`vault-settings.json` / `user-settings.json`) and rescans the folder on startup—no repeated permission prompts.
- **Durable Tags & Metadata**: Tags, ratings, notes, and status write to companion `.md` YAML files next to each image. Disk is the source of truth on every Electron rescan; `localStorage` is only a runtime cache.
- **Native Image Protocol**: Packaged desktop builds serve vault images over a privileged `visual-vault://` protocol with Windows-safe path resolution.
- **Custom Desktop Icon**: Drop `icon.ico` / `icon.png` in `public/`; the icon generator packs branding into the Windows installer and executable.
- **Editable Smart Folders**: Live filters, names, icons, and tag rules via a modal editor.
- **Custom Schema & Status Configurator**: Adjust property names and statuses; import/export JSON configs.
- **Color Extraction Grid**: Derives palette swatches from imported images.
- **Typography & Themes**: Multiple Google Fonts plus Obsidian Charcoal, Notion Minimalist, and Y2K CRT Matrix themes.
- **Integrated Markdown/YAML Editor**: Inspect and edit Obsidian-compatible frontmatter beside each asset.

---

## Running From a Remote Web Server with Local Folders

Browsers cannot silently read absolute paths like `C:\Users\...`. Use one of these approaches:

### 1. File System Access API (Client-Side)
Chrome / Edge / Opera: `showDirectoryPicker()` indexes and writes locally. Nothing is uploaded to the remote server.

### 2. Local Companion Sync Daemon
A small local API (e.g. `http://localhost:8080`) can list and serve vault files to a remote UI.

### 3. Local-First Desktop Build (Electron)
Compile a native app with full filesystem access. This is the recommended path for Windows/macOS creatives who want Obsidian-style folder sync without browser sandbox limits.

---

## Development & Toolchain Guide

### 1. Setup Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 3. Desktop Preview (Electron)
```bash
# Production-style: build Vite output, then open Electron
npm run electron:start

# Dev: Electron + Vite on localhost:3000 (run `npm run dev` in another terminal)
npm run electron:dev
```

### 4. Build Desktop Installers

Windows and macOS packaging use **electron-builder**. The packaged app **must** include `preload.cjs` (declared in `package.json` → `build.files`) so `window.electronAPI` is available for vault scan, image serving, and companion `.md` writes.

*   **Windows (NSIS installer → `dist-win/`)**:
    ```bash
    npm run electron:build
    ```
    Output includes `VisualVault Setup 1.0.0.exe` and `win-unpacked/VisualVault.exe`.

*   **macOS**:
    ```bash
    npm run electron:build:mac
    ```
    Requires Xcode Command Line Tools (`xcode-select --install`).

*   **Windows + macOS**:
    ```bash
    npm run electron:build:all
    ```

Optional alternate packager (does not produce the NSIS installer):
```bash
npm run packager:build
```

---

## Themes Available

1. **Obsidian Dark**: Ambient dark layout with emerald accents.
2. **Notion Minimalist**: Off-white canvas with clean slate borders.
3. **Y2K CRT Matrix**: Scanline terminal greens.

---

## Open Source & Licensing

This repository is open-source, maintained by **90M Studio**. Anyone is free to clone, modify, and transform the functional application code.

- **Source Code**: Licensed under the highly permissive [MIT License](./LICENSE). You are fully authorized to clone the repo, transform the code, and build upon the catalog features.
- **Branding & Logo Exclusion**: The application name **VisualVault**, associated trademarks, developer credit references of **90M Studio**, and the application icons (`public/icon.png`, `public/icon.ico`, `public/icon.svg`) are **strictly proprietary** and excluded from the open-source license.

If you distribute, publish, or host a modified copy of this application, you must replace the logos, names, and trademark assets with your own custom identity.

