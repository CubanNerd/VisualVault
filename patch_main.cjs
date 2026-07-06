const fs = require('fs');
let code = fs.readFileSync('electron-main.cjs', 'utf8');

const permCode = `
  // Automatically grant permission & sync folders
  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    return true;
  });
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
    callback(true);
  });
`;

code = code.replace(
  "const indexPath = path.join(__dirname, 'dist', 'index.html');",
  permCode + "\n  const indexPath = path.join(__dirname, 'dist', 'index.html');"
);

// also add grantPermissionAndSyncFolders IPC handler just in case
const ipcCode = `
ipcMain.handle('grant-permission-and-sync-folders', async (event, vaultPath) => {
  try {
    return scanFolder(vaultPath, '/', vaultPath);
  } catch (err) {
    console.error('Failed to auto-grant and sync folders:', err);
    return [];
  }
});
`;
code = code + ipcCode;

fs.writeFileSync('electron-main.cjs', code);
