const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  getSavedFolder: () => ipcRenderer.invoke('get-saved-folder'),
  saveFolder: (folderPath) => ipcRenderer.invoke('save-folder', folderPath),
  getSavedVault: () => ipcRenderer.invoke('get-saved-vault'),
  saveVaultPath: (vaultPath) => ipcRenderer.invoke('save-vault-path', vaultPath),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  scanVault: (vaultPath) => ipcRenderer.invoke('scan-vault', vaultPath),
  writeCompanionMD: (vaultPath, board, assetName, yamlContent) => 
    ipcRenderer.invoke('write-companion-md', vaultPath, board, assetName, yamlContent),
  writeFileBinary: (vaultPath, board, assetName, arrayBuffer) => 
    ipcRenderer.invoke('write-file-binary', vaultPath, board, assetName, arrayBuffer),
  deleteAssetFile: (vaultPath, board, assetName) => 
    ipcRenderer.invoke('delete-asset-file', vaultPath, board, assetName),
  createBoardDirectory: (vaultPath, boardPath) => 
    ipcRenderer.invoke('create-board-directory', vaultPath, boardPath),
  deleteBoardDirectory: (vaultPath, boardPath, keepFiles) => 
    ipcRenderer.invoke('delete-board-directory', vaultPath, boardPath, keepFiles),
  moveAssetFile: (vaultPath, oldBoard, newBoard, assetName) =>
    ipcRenderer.invoke('move-asset-file', vaultPath, oldBoard, newBoard, assetName),
  renameBoardDirectory: (vaultPath, oldBoard, newBoard) =>
    ipcRenderer.invoke('rename-board-directory', vaultPath, oldBoard, newBoard)
});
