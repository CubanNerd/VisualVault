# VisualVault Developer Maintenance & Architecture Guide

Welcome to the **VisualVault Developer Maintenance Guide**. This document outlines the application's design, architectural patterns, state managers, tech stack, and build pipelines. It is designed to help maintain, expand, or refactor the codebase.

---

### 📖 Essential Documentation
- **[Detailed Developer Architecture Guide](./docs/DEVELOPER_GUIDE.md)**: Deep dive into the native Custom Element rendering lifecycle, multi-vault dynamic partitioning state engine, regex-based Obsidian YAML frontmaster stringify/parser utilities, and Electron desktop wrappers.
- **[User Operation Manual](./docs/USER_GUIDE.md)**: Describes end-user features, search mechanics, localized user profile view-modes, and subdirectory preservation loops during folder deletion chores.

---

## 🏗️ Architectural Overview

VisualVault is a high-performance, local-first design asset catalog styled like an Obsidian workstation. 

### ⚡ Custom Elements (Web Components) Paradigm
Rather than relying on virtual DOM overhead, VisualVault is engineered as a standard native **TypeScript Web Component** class (`VaultApp`) that inherits from `HTMLElement` and is registered via `customElements.define('vault-app', VaultApp)`. 

This approach provides several core benefits:
- **Sub-millisecond DOM updates**: Dynamic insertions and DOM selections execute directly via native document queries, offering unparalleled UI responsiveness.
- **Self-contained Logic**: Event bindings, layout systems, overlays, theme injections, and storage bridges are cleanly coupled inside a single core class.
- **Frictionless Portability**: It bootstraps immediately inside a standard browser environment or nested inside native hybrid desktop web wrappers (Electron).

---

## 🛠️ The Tech Stack

| Technology / Library | Version | Purpose |
| :--- | :--- | :--- |
| **TypeScript** | `~5.8.2` | Strong type definitions, compilation checks, and strict interface schemas. |
| **Vite** | `^6.2.3` | Ultra-fast development server, asset packager, and ES module builder. |
| **Tailwind CSS (v4)** | `^4.1.14` | Localized utility-first styling with native CSS variables and `@theme` extension hooks. |
| **Electron** | `^42.2.0` | Local desktop runtime wrapper to bypass browser security sandboxes. |
| **electron-packager** | `^17.1.2` | Executable compressor that bundles files for Win32 (x64) desktop targets. |
| **lucide-react** | `^0.546.0` | Accessible, scale-independent SVG icons for toolbars, menus, and status dots. |

---

## 📂 Core Modules & Workspace Structure

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

## 💾 State & Storage Sync Engine

The application manages assets, boards, active vaults, and companion settings purely on the client side, using unique, namespaced local caching channels. This mirrors the behavior of Obsidian's offline-first vault catalog.

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

---

## 🎨 Layout Modifiers & Custom Themes

VisualVault includes three distinctive user interface states handled via theme stylesheets dynamically written into the core app's layout.

### Injected Style Blocks
The themes are managed by injecting styling adjustments dynamically:
1. **Obsidian Dark (Default)**: Deep carbon canvas (`#0F0F11`), slate borders, emerald inputs, and glowing high-contrast outline states.
2. **Notion Minimalist (Light)**: Cool gray borders, pristine off-white frames, and classic typography.
3. **Y2K CRT Matrix**: Glowing lime greens, stark black backgrounds, scanline CSS overlays, and monospace console fonts.

---

## 🤖 Companion Obsidian Front-Matter Engine

A critical core feature of VisualVault is its inline metadata sync. Reference images inside the grid contain custom companion `.md` files containing YAML front-matter metadata blocks.

### Parse & Stringify Routines
Inside `src/main.tsx`, text data edited inside the sidebar is compiled using regex-based utility parsers:

- **`stringifyYAMLFrontmatter(metadata: AssetMetadata): string`**  
  Transforms JavaScript options (arrays, strings, ratings) into standard Obsidian-compatible blocks:
  ```yaml
  ---
  artist: Chen-K design team
  rating: 5
  status: completed
  tags:
    - environment_ref
    - concept_art
  ---
  ```
- **`parseYAMLFrontmatter(text: string, current: AssetMetadata): AssetMetadata`**  
  Reads direct developer edits inside the code textarea, parses values on-the-fly, and mirrors options back to visual switches instantly.

---

## 💻 Desktop Compilations & Core Build Steps

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

- **Standard Local Hot Dev**:
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
- **Build & Package Windows Executable**:
  ```bash
  npm run electron:build
  ```

---

## 📝 Maintenance Checklist for Future Developers

1. **Keep Web Components Native**: If integrating libraries like Recharts or D3 in future updates, ensure they mount inside the native element's DOM nodes or within shadow contexts without disrupting event flows.
2. **Ensure File Path Safety**: When writing absolute file paths via custom scripts, sanitize paths with URL encoding to prevent system crashes across different operating systems.
3. **Optimize Procedural Mocking**: Ensure changes to standard visual asset blueprints are registered in `defaultMockAssets()` in `src/main.tsx` to preserve default values for first-time builders.
