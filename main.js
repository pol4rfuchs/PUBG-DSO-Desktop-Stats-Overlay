const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen } = require('electron');
const path = require('path');

let win = null;
let tray = null;
let isOverlayMode = false;

// Prevent second instance
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); process.exit(0); }

app.on('second-instance', () => { if (win) { win.show(); win.focus(); } });

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', (e) => e.preventDefault()); // keep in tray

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 560,
    minWidth: 360,
    minHeight: 480,
    frame: false,
    transparent: false,
    resizable: true,
    show: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#08090B',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));

  win.once('ready-to-show', () => {
    win.show();
    centerWindow();
  });

  win.on('close', (e) => {
    e.preventDefault();
    win.hide();
  });
}

function centerWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const [w, h] = win.getSize();
  win.setPosition(Math.round((width - w) / 2), Math.round((height - h) / 2));
}

function createTray() {
  // Use a simple 1x1 transparent icon fallback if no icon file
  let icon;
  try {
    icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png'));
    if (icon.isEmpty()) throw new Error('empty');
  } catch {
    // 16x16 blank icon as base64 fallback
    icon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAADUlEQVQ4jWNgYGBgAAAABQABXvMqGgAAAABJRU5ErkJggg=='
    );
  }

  tray = new Tray(icon);
  tray.setToolTip('PUBG Overlay');

  const menu = Menu.buildFromTemplate([
    { label: 'Öffnen', click: () => { win.show(); win.focus(); } },
    { type: 'separator' },
    {
      label: 'Overlay-Modus (immer im Vordergrund)',
      type: 'checkbox',
      checked: false,
      click: (item) => toggleOverlayMode(item.checked)
    },
    { type: 'separator' },
    { label: 'Beenden', click: () => { app.exit(0); } }
  ]);

  tray.setContextMenu(menu);
  tray.on('double-click', () => { win.show(); win.focus(); });
}

function toggleOverlayMode(enable) {
  isOverlayMode = enable;
  if (enable) {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    win.setAlwaysOnTop(true, 'screen-saver');
    win.setSize(240, 110);
    win.setPosition(width - 260, height - 130);
    win.setResizable(false);
    win.setSkipTaskbar(true);
    win.webContents.send('set-mode', 'overlay');
    win.show();
  } else {
    win.setAlwaysOnTop(false);
    win.setSize(420, 560);
    win.setResizable(true);
    win.setSkipTaskbar(false);
    centerWindow();
    win.webContents.send('set-mode', 'normal');
  }
}

// IPC handlers
ipcMain.on('close-window', () => win.hide());
ipcMain.on('minimize-window', () => win.minimize());
ipcMain.on('toggle-overlay', () => {
  isOverlayMode = !isOverlayMode;
  toggleOverlayMode(isOverlayMode);
});
