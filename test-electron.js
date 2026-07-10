const { app, protocol, net, BrowserWindow } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

protocol.registerSchemesAsPrivileged([
  { scheme: 'visual-vault', privileges: { standard: true, bypassCSP: true, secure: true, supportFetchAPI: true } }
]);

app.whenReady().then(() => {
  if (protocol.handle) {
    protocol.handle('visual-vault', (request) => {
      let urlPath = request.url.replace(/^visual-vault:\/\//i, '');
      const fileUri = pathToFileURL(path.normalize(decodeURIComponent(urlPath))).toString();
      return net.fetch(fileUri);
    });
  }

  const win = new BrowserWindow();
  win.loadURL(`data:text/html,<html><body><img src="visual-vault://${__filename}"></body></html>`);
});
