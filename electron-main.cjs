const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 830,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#0A0A0B',
    title: 'VisualVault — Obsidian Local-First Catalog',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Load compiled static files from dist directory
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  win.loadFile(indexPath).catch(err => {
    console.error('Failed to load local HTML entry in Electron:', err);
  });

  // Remove default top menu in windows/mac for a premium app feel
  Menu.setApplicationMenu(null);
  win.removeMenu();
}

app.whenReady().then(() => {
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
