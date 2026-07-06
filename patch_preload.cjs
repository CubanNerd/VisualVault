const fs = require('fs');
let code = fs.readFileSync('preload.cjs', 'utf8');

code = code.replace(
  "showInFolder: (fullPath) =>\n    ipcRenderer.invoke('show-in-folder', fullPath)",
  "showInFolder: (fullPath) =>\n    ipcRenderer.invoke('show-in-folder', fullPath),\n  grantPermissionAndSyncFolders: (vaultPath) =>\n    ipcRenderer.invoke('grant-permission-and-sync-folders', vaultPath)"
);

fs.writeFileSync('preload.cjs', code);
