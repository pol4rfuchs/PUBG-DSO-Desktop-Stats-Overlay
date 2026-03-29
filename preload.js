const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow:    () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  toggleOverlay:  () => ipcRenderer.send('toggle-overlay'),
  onSetMode: (cb) => ipcRenderer.on('set-mode', (_e, mode) => cb(mode)),
});
