const { app, BrowserWindow, Menu, ipcMain, dialog, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// Register the custom protocol 'visual-vault'
protocol.registerSchemesAsPrivileged([
  { scheme: 'visual-vault', privileges: { standard: true, bypassCSP: true, secure: true, supportFetchAPI: true } }
]);

function parseYAMLFrontmatterNode(yaml, originalMeta) {
  const meta = { ...originalMeta };
  try {
    const cleanYaml = yaml.replace(/^---/, '').replace(/---$/, '').trim();
    const rows = cleanYaml.split('\n');
    for (const row of rows) {
      const colIdx = row.indexOf(':');
      if (colIdx === -1) continue;
      const key = row.substring(0, colIdx).trim().toLowerCase();
      const val = row.substring(colIdx + 1).trim();

      if (key === 'tags') {
        const bracketMatch = val.match(/\[(.*)\]/);
        if (bracketMatch) {
          meta.tags = bracketMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        } else {
          meta.tags = val.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (key === 'artist') {
        meta.artist = val;
      } else if (key === 'rating') {
        meta.rating = val;
      } else if (key === 'status') {
         meta.status = val;
      } else if (key === 'title') {
         meta.title = val;
      } else if (key === 'notes') {
         meta.notes = val;
      }
    }
  } catch (err) {
    console.error('YAML frontmatter parsing failed. Using original', err);
  }
  return meta;
}

function scanFolder(currentDir, relativeBoard, vaultPath) {
  let list = [];
  if (!fs.existsSync(currentDir)) return list;
  
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // ignore hidden files/folders

    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      const subBoard = relativeBoard === '/' ? `/${entry.name}` : `${relativeBoard}/${entry.name}`;
      list = list.concat(scanFolder(fullPath, subBoard, vaultPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase().replace('.', '');
      const supportedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'avif', 'tiff', 'jfif', 'heic', 'heif'];
      if (supportedExtensions.includes(ext)) {
        // Find companion md
        const fileNameNoExt = path.basename(entry.name, path.extname(entry.name));
        const mdPath = path.join(currentDir, `${fileNameNoExt}.md`);
        
        let metadata = {
          tags: ['Local-Sync', 'Imported'],
          artist: 'Local Computer',
          rating: '5',
          status: 'completed',
          title: fileNameNoExt.replace(/[-_]/g, ' '),
          notes: 'Natively connected local directory database sync.'
        };

        if (fs.existsSync(mdPath)) {
          try {
            const mdText = fs.readFileSync(mdPath, 'utf-8');
            metadata = parseYAMLFrontmatterNode(mdText, metadata);
          } catch (e) {
            console.error('Error reading/parsing companion md:', e);
          }
        }

        // Generate a stable ID based on the relative file path to preserve user ratings/tags/positions!
        const relativePath = path.join(relativeBoard, entry.name).replace(/\\/g, '/');
        const id = `electron_ref_${Buffer.from(relativePath).toString('hex')}`;

        const stats = fs.statSync(fullPath);
        const size = stats.size > 1024 * 1024 
          ? `${(stats.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(stats.size / 1024).toFixed(0)} KB`;

        const colors = ['#0F0F11', '#1A2B3C', '#10B981', '#1E293B', '#111827'];

        // File URL on disk using visual-vault:// scheme
        const urlSafePath = fullPath.replace(/\\/g, '/');
        const imageUrl = `visual-vault://${urlSafePath}`;

        list.push({
          id,
          name: entry.name,
          board: relativeBoard,
          resolution: 'Loading...',
          size,
          colors,
          tags: metadata.tags || [],
          metadata,
          imageUrl,
          lastModified: new Date(stats.mtime).toLocaleString(),
          vaultPath
        });
      }
    }
  }
  return list;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 830,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#0A0A0B',
    title: 'VisualVault — Obsidian Local-First Catalog',
    icon: path.join(__dirname, 'public', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  const isDev = process.argv.includes('--dev') || process.env.ELECTRON_DEV === 'true';
  const indexPath = path.join(__dirname, 'dist', 'index.html');

  if (isDev) {
    win.loadURL('http://localhost:3000').catch(() => {
      console.warn('Vite dev server not reached on localhost:3000. Trying fallback...');
      if (fs.existsSync(indexPath)) {
        win.loadFile(indexPath);
      } else {
        showBuildRequiredPage(win);
      }
    });
    win.webContents.openDevTools();
  } else {
    if (!fs.existsSync(indexPath)) {
      showBuildRequiredPage(win);
    } else {
      win.loadFile(indexPath).catch(err => {
        console.error('Failed to load local HTML entry in Electron:', err);
      });
    }
  }

  win.webContents.on('before-input-event', (event, input) => {
    const isControlOrCmd = process.platform === 'darwin' ? input.meta : input.control;
    const isToggleHotkey = (isControlOrCmd && input.shift && input.key.toLowerCase() === 'i') || input.key === 'F12';
    
    if (isToggleHotkey) {
      win.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  Menu.setApplicationMenu(null);
  win.removeMenu();
}

function showBuildRequiredPage(win) {
  const errorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>VisualVault — Build Assets Required</title>
      <style>
        body {
          background-color: #0A0A0B;
          color: #94A3B8;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .card {
          max-width: 480px;
          padding: 40px;
          background: #111113;
          border: 1px solid #1F1F23;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        }
        h1 {
          font-size: 22px;
          margin-bottom: 12px;
          color: #F8FAFC;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        p {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .code-block {
          background: #060608;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #1F1F23;
          font-family: "JetBrains Mono", Courier, monospace;
          font-size: 13px;
          color: #F43F5E;
          margin: 16px 0 24px 0;
          text-align: left;
        }
        .highlight {
          color: #3B82F6;
        }
        .btn {
          background: #000000;
          color: #F8FAFC;
          border: 1px solid #27272A;
          padding: 10px 22px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .btn:hover {
          background: #09090B;
          border-color: #3F3F46;
          color: #FFFFFF;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Static Assets Missing</h1>
        <p>VisualVault is offline-first, but your production distribution directory (<code class="highlight">dist/</code>) is currently empty.</p>
        <p>Please compile the application by typing this in your project terminal directory first:</p>
        <div class="code-block">
          $ npm run build
        </div>
        <p style="font-size: 12px; color: #64748B;">Alternatively, run <strong class="highlight">npm run electron:dev</strong> to run with a live-reloading Vite developer connection.</p>
        <button class="btn" onclick="window.location.reload()">Check Again & Reload</button>
      </div>
    </body>
    </html>
  `;
  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
}

// Setup safe protocol handling
app.whenReady().then(() => {
  if (protocol.handle) {
    protocol.handle('visual-vault', (request) => {
      let urlPath = request.url.replace(/^visual-vault:\/\//i, '');
      if (process.platform === 'win32' && urlPath.startsWith('/')) {
        urlPath = urlPath.slice(1);
      }
      const decodedPath = decodeURIComponent(urlPath);
      const normalizedPath = path.normalize(decodedPath);
      // Safely construct file URI encoding spaces and special characters
      const fileUri = pathToFileURL(normalizedPath).toString();
      return net.fetch(fileUri);
    });
  } else if (protocol.registerFileProtocol) {
    protocol.registerFileProtocol('visual-vault', (request, callback) => {
      let urlPath = request.url.replace(/^visual-vault:\/\//i, '');
      if (process.platform === 'win32' && urlPath.startsWith('/')) {
        urlPath = urlPath.slice(1);
      }
      const decodedPath = decodeURIComponent(urlPath);
      callback({ path: path.normalize(decodedPath) });
    });
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Native IPC handlers
function loadSettings() {
  try {
    const settingsPath = path.join(app.getPath('userData'), 'user-settings.json');
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
  return {};
}

function saveSettings(settings) {
  try {
    const settingsPath = path.join(app.getPath('userData'), 'user-settings.json');
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save settings:', err);
    return false;
  }
}

ipcMain.handle('get-saved-folder', async () => {
  const settings = loadSettings();
  return settings.savedFolder || null;
});

ipcMain.handle('save-folder', async (event, folderPath) => {
  const settings = loadSettings();
  settings.savedFolder = folderPath;
  return saveSettings(settings);
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('scan-vault', async (event, vaultPath) => {
  try {
    return scanFolder(vaultPath, '/', vaultPath);
  } catch (err) {
    console.error('Failed to scan vault natively:', err);
    return [];
  }
});

ipcMain.handle('write-companion-md', async (event, vaultPath, board, assetName, yamlContent) => {
  try {
    const boardPath = board === '/' ? '' : board;
    const fileNameNoExt = assetName.replace(/\.[a-zA-Z0-9]+$/, '');
    const mdFilePath = path.join(vaultPath, boardPath, `${fileNameNoExt}.md`);
    
    fs.mkdirSync(path.dirname(mdFilePath), { recursive: true });
    fs.writeFileSync(mdFilePath, yamlContent, 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Failed to write companion MD natively:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('write-file-binary', async (event, vaultPath, board, assetName, fileData) => {
  try {
    const boardPath = board === '/' ? '' : board;
    const destPath = path.join(vaultPath, boardPath, assetName);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    if (typeof fileData === 'string') {
      fs.copyFileSync(fileData, destPath);
    } else {
      fs.writeFileSync(destPath, Buffer.from(fileData));
    }
    return { success: true };
  } catch (err) {
    console.error('Failed to write binary file natively:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-asset-file', async (event, vaultPath, board, assetName) => {
  try {
    const boardPath = board === '/' ? '' : board;
    const fullImagePath = path.join(vaultPath, boardPath, assetName);
    const fileNameNoExt = assetName.replace(/\.[a-zA-Z0-9]+$/, '');
    const fullMDPath = path.join(vaultPath, boardPath, `${fileNameNoExt}.md`);

    if (fs.existsSync(fullImagePath)) {
      fs.unlinkSync(fullImagePath);
    }
    if (fs.existsSync(fullMDPath)) {
      fs.unlinkSync(fullMDPath);
    }
    return { success: true };
  } catch (err) {
    console.error('Failed to delete asset natively:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('create-board-directory', async (event, vaultPath, boardPath) => {
  try {
    const fullDir = path.join(vaultPath, boardPath);
    fs.mkdirSync(fullDir, { recursive: true });
    return { success: true };
  } catch (err) {
    console.error('Failed to create board directory natively:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-board-directory', async (event, vaultPath, boardPath, keepFiles) => {
  try {
    const fullDir = path.join(vaultPath, boardPath);
    if (!fs.existsSync(fullDir)) return { success: true };

    if (keepFiles) {
      const files = fs.readdirSync(fullDir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const srcPath = path.join(fullDir, file);
        const destPath = path.join(vaultPath, file);
        if (fs.existsSync(srcPath) && !fs.statSync(srcPath).isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.renameSync(srcPath, destPath);
          } else {
            const nameNoExt = path.basename(file, ext);
            const uniqueDest = path.join(vaultPath, `${nameNoExt}_moved_${Date.now()}${ext}`);
            fs.renameSync(srcPath, uniqueDest);
          }
        }
      }
    }

    fs.rmSync(fullDir, { recursive: true, force: true });
    return { success: true };
  } catch (err) {
    console.error('Failed to delete board natively:', err);
    return { success: false, error: err.message };
  }
});
