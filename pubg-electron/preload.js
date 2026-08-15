const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow:    () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  toggleOverlay:  () => ipcRenderer.send('toggle-overlay'),
  onSetMode: (cb) => ipcRenderer.on('set-mode', (_e, mode) => cb(mode)),

  // Config is persisted in the main process via safeStorage (OS keychain),
  // never in renderer localStorage.
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (cfg) => ipcRenderer.invoke('save-config', cfg),

  // Routes external links through the main process, which only allows
  // https:// URLs and always opens them in the OS browser, never in-app.
  openExternal: (url) => ipcRenderer.send('open-external', url),

  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (_e, info) => cb(info)),
});
