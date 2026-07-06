const fs = require('fs');
let code = fs.readFileSync('electron-main.cjs', 'utf8');

const permCode = `
  // Automatically grant permission & sync folders (File System, etc.)
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

fs.writeFileSync('electron-main.cjs', code);
