# VisualVault — User Guide & Knowledge Base
*Last Updated: July 1, 2026*

Welcome to the **VisualVault User Guide**. This document serves as a comprehensive knowledge base for creative professionals, curators, and researchers. VisualVault is a high-speed, local-first workspace designed to catalog, inspect, and organize reference inspiration, design boards, blueprints, and concept catalogs in harmony with your local directories and Obsidian vaults.

---

## 📂 Understanding Vaults & Boards

At the core of VisualVault is a simple local-first directory layout:

1. **The Vault [Root]**: A single root directory on your local device (e.g., `/Users/design/Desktop/Concept_Universe` or a local Obsidian Vault). A vault holds your visual assets and associated metadata.
2. **1st Level Folders [Boards]**: Virtual subdirectories representing main conceptual boards (e.g., `Environment_Ref` or `Mech_Technical`).
3. **2nd Level Folders [Sections]**: Direct subsets inside the major boards (e.g., `Environment_Ref/Neo_Tokyo` or `Mech_Technical/Chassis`).
4. **3rd Level Files [Images & Companion Notes]**: Actual images and notes residing inside the second level folders.

---

## 📁 Nested Folders & Deeper Hierarchies

VisualVault maintains a clean workspace by projecting a structured folder layout. However, should your filesystem contain directory structures deeper than the typical format (e.g., folders nested *inside* the 2nd level, like `Environment_Ref/Neo_Tokyo/Streets` or `Character_Design/Mecha_Pilots/Anomalies/Elite/`):

- **Automatic Promotion & Flattening**: The UI automatically captures and promotes directories nested deeper than the 2nd level and displays them directly at the 2nd level (marked with a clean arrow `↳` indicator and custom tag coloring). This ensures you preserve complete visual exposure of your file repositories without getting them lost inside deep structural trees!
- **Path Preservations**: Your original directory names and structures are always fully preserved inside the physical vault catalog; only the visual interface pivots them dynamically to offer distraction-free curation.
- **Visual Alert**: When nested folders are detected inside your workspace, an informational helper banner appears inside the left-hand sidebar boards collection directory notifying you of active hierarchy promotions.

---

## 🎨 Tailoring Your Workspace: The User Profiles

VisualVault adapts dynamically to different styles of reference organization. In the left sidebar under the **Workspace View Mode** selector, you can toggle between two modes:

### 1. Unified Arena (User Profile 1: The Curatorial Workspace)
*For designers who prefer to inspect their entire concept library in one contiguous registry.*
- **Overview**: Selecting **Unified** scans and aggregates all files, tags, and sub-boards across all your registered vaults.
- **Workflow**: Ideal when cross-referencing ideas between different projects, search-filtering through thousands of pins, or matching color palettes globally.

### 2. Focused Solitude (User Profile 2: The Project-Driven Space)
*For curators who feel distracted or overwhelmed by seeing unrelated concept art when working on a single task.*
- **Overview**: Selecting **Focused** isolates the workspace. It loads assets, boards, and search terms strictly relevant to the active directory vault.
- **Workflow**: Hides background projects entirely so you can focus, review, and iterate on one isolated project at a time.

---

## 🗄️ Managing Boards & Subfolders

VisualVault offers nested directory management to easily create, rename, and prune boards directly from your browser sidebar, main dashboard, or active board header.

### 1. Creating Boards
Click the **+ Create New** section in your sidebar or header:
- Enter a name (e.g., `/ Character_Design/Mecha_Pilots`).
- Press **Enter** or click **Create** to instantly map a clean visual folder.

### 2. Renaming Boards
With a Board selected:
- Click the **Rename** button in the board header.
- Provide a new directory path.
- Your asset catalog updates references instantly, aligning tags and frontmatter coordinates effortlessly.

### 3. Deleting Boards (Dual Deletion Prompts)
You can delete a board folder from **three distinct access points**:
- **The Sidebar**: Hover over any board link on the left-hand sidebar and click the **Trash Icon** that appears.
- **The Main Panel (All Boards View)**: When looking at all boards as visual cards, click the **Trash Icon** appearing on the card hover state.
- **The Active Board Header**: While viewing a specific board, click the **Delete** button next to its path coordinates.

#### ⚠️ The File Retention Prompt
Upon clicking delete on a board, you will see a two-step prompt:
1. **Board Confirmation**: Verification that you intend to clear the folder configuration.
2. **File Retention Query**:
   - **Click OK (Yes)**: Deletes **both** the board registry and all the physical reference assets/pins currently residing inside that folder from the index.
   - **Click Cancel (No)**: Deletes the board folder **but preserves all images/files**. Preserved assets are safely redirected to the root level (`/`) of your vault so they can be re-categorized later.

### 4. Pinterest-Style Board Sections
When viewing any 1st-level Board (e.g., `/ Environment_Ref`), a dedicated **Pinterest Board Sections** panel activates right above your main asset grid:
- **Visual Sections Deck**: View all subsections nested within the current board as beautiful, scrollable cards featuring image-preview collages of contained pins.
- **Inline Creating**: Add new sections seamlessly without leaving your focus! Click **Create Section** to toggle an interactive input card in the sections deck, type your section name, and hit **Create**. The platform will immediately map the folder path (e.g., `/ Environment_Ref/Neo_Tokyo`), auto-navigate you inside, and let you import references straight into it!
- **Pin Relocation**: Relocate assets into sections smoothly by selecting the section path inside the Inspector's **Change Board / Relocate Pin** dropdown.
- **Section Pruning**: Delete sections easily using the hover **Trash Icon** directly on the section card, wrapped with the same secure file retention safeguards.

---

## 📝 Obsidian Sync & Sidebar YAML Editor

Each image card represents a reference asset. These are synchronized on-the-fly with companion `.md` files containing YAML front-matter blocks, matching Obsidian's standard metadata catalog.

### 1. Interactive Sidebar Metadata Controls
Click any asset card to open the **Metadata Inspector** sidebar:
- **Details**: Change names, assign ratings, edit descriptions, list color metrics, and add tags.
- **Obsidian Sync Logs**: Inspect live YAML front-matter changes instantly translated into standard Markdown notes.
- **Manual YAML Editor**: Click the **Edit Raw YAML** switch to edit the raw text file representation. The UI automatically re-parses your changes instantly.

### 2. Native Obsidian Launch Integration (`obsidian://` Protocol)
Click the **Launch in Obsidian** action inside an asset's sidebar details:
- VisualVault fires an automated local system payload using the protocol handler:
  `obsidian://open?vault=VaultName&file=Board/Asset.md`
- If you have Obsidian installed, this command launches the application and opens the catalog file directly, synchronized to your exact line of notes.

---

## ⚙️ Setting Up Remote Access to Local Folders

If you run VisualVault from a remote web server (rather than your local machine), the browser's sandbox model naturally blocks direct, silent scans of absolute paths. You have **three seamless approaches** to load local assets:

### Approach A: File System Access API (Immediate & Direct)
1. Inside the **Vault Settings**, click **Sync Local folder Directory**.
2. Select your local asset folder via the native browser dialog.
3. This indexes your local directory, parses YAML annotations, and extracts file representations fully client-side. **No files or metadata are uploaded to a remote server.**
4. Changes write directly back to your local files on the fly.

### Approach B: Companion Sync Daemon (For Native Workflows)
Run a lightweight, private companion script on your machine to host a local directory scanner (e.g., `http://localhost:8080/index`):
1. VisualVault targets this local agent for folder queries.
2. Direct disk read-and-writes are performed through the API agent, yielding lightning-fast updates.

### Approach C: Isolated Desktop Client (Electron)
Compile, download, and run the companion binary locally (fully supported and verified for both **Windows** and **macOS**):
1. This integrates the interface with your physical operating system.
2. Run direct directory queries and local integrations without browser sandboxing alerts.
3. Windows build script generates a standalone `VisualVault.exe` (inside `dist-win/`) which has been proven to build and run seamlessly, while the macOS script outputs a native `VisualVault.app` bundle (inside `dist-mac/`) encompassing both Intel and Apple Silicon (M1/M2/M3/M4) devices.

---

## ⌨️ Productivity Shortcuts & Tips

- **Targeted Drag-and-Drop**: You can drag an image file from your OS desktop directly onto a custom Board link in your sidebar, or onto one of the **Pinterest Board Sections** cards on your dashboard. VisualVault instantly detects the drop target, copies the file into the corresponding physical directory on-disk, and catalogs the new visual reference inside that targeted category/board automatically.
- **Color Extraction Grid**: Hover over the color blocks in an asset's footer to instantly view color hex values. Clicking one copies the value to your clipboard.
- **Search Logic**: Real-time filtering scans descriptions, titles, tags, and paths. Visual ratio indicators (e.g., `4/12 pins`) highlight matches inside closed boards.
- **Theme Selection**: Switch between Obsidian Dark, Notion Light, and Y2K Matrix inside the vault settings menu to suit your environment.
