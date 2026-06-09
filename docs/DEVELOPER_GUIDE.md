# VisualVault — Developer Architecture & Integration Guide

Welcome to the **VisualVault Developer Architecture & Integration Guide**. This document serves as a standard reference manual for core workflows, state lifecycles, storage partitioning patterns, and layout render targets. It is written to aid developers with future maintenance, updates, or native platform ports.

---

## 🏗️ Core architectural Paradigm

Instead of using virtual DOM abstraction layers or reactive compilation cycles that add microsecond execution delays, VisualVault leverages a **Native Custom element Component model** styled entirely via Tailwind CSS (v4).

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

## 💾 State Partitioning & Storage System

VisualVault functions as an offline-first catalog wrapper. It segregates asset records, YAML notes, and boards according to **Vault Paths** to prevent data bleeding.

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

### 1. Unified Arena vs. Focused Solitude Views
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

### 2. Multi-Vault Partition Saving
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

## 📁 Directory Parsing & Multi-Level Folder Promotion

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

## 🛠️ Board Management Operations & Event Flows

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

## 📝 Parsing & RegEx Engines for Obsidian Notes

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

## 💻 Electron Interface Integration

VisualVault is designed to bundle into a lightweight web view container:

- **Asset Root Support**: To prevent Electron from failing to resolve paths when loading from `file://` filesystems, the `vite.config.ts` has compile coordinates set:
  ```ts
  base: './' // Resolves paths relative to index.html instead of expecting absolute root references
  ```
- **System Command Protocols**: Launch coordinates use native deep system URL hooks:
  `obsidian://open?vault=${VaultName}&file=${AssetNotePath}`
