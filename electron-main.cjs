const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

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

  const isDev = process.argv.includes('--dev') || process.env.ELECTRON_DEV === 'true';
  const indexPath = path.join(__dirname, 'dist', 'index.html');

  if (isDev) {
    // In development mode, load directly from the Vite dev server for HMR
    win.loadURL('http://localhost:3000').catch(() => {
      console.warn('Vite dev server not reached on localhost:3000. Trying fallback...');
      if (fs.existsSync(indexPath)) {
        win.loadFile(indexPath);
      } else {
        showBuildRequiredPage(win);
      }
    });
    // Open devtools automatically in dev mode
    win.webContents.openDevTools();
  } else {
    // In production/normal mode, load compiled static files from dist directory
    if (!fs.existsSync(indexPath)) {
      showBuildRequiredPage(win);
    } else {
      win.loadFile(indexPath).catch(err => {
        console.error('Failed to load local HTML entry in Electron:', err);
      });
    }
  }

  // Key Event delegation to allow F12 or Ctrl+Shift+I (Cmd+Option+I on mac) to toggle Developer Tools
  win.webContents.on('before-input-event', (event, input) => {
    const isControlOrCmd = process.platform === 'darwin' ? input.meta : input.control;
    const isToggleHotkey = (isControlOrCmd && input.shift && input.key.toLowerCase() === 'i') || input.key === 'F12';
    
    if (isToggleHotkey) {
      win.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  // Remove default top menu in windows/mac for a premium app feel
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

