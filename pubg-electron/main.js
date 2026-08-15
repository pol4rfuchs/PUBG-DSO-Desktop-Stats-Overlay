const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen, shell, safeStorage } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

let win = null;
let tray = null;
let isOverlayMode = false;

const CONFIG_PATH = path.join(app.getPath('userData'), 'pubg-cfg.enc');
const REPO = 'Pol4rFuchs/PUBG-DSO-Desktop-Stats-Overlay';

// Prevent second instance
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); process.exit(0); }

app.on('second-instance', () => { if (win) { win.show(); win.focus(); } });

app.whenReady().then(() => {
  createWindow();
  createTray();
  checkForUpdates();
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
      sandbox: true,
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Deny all popups by default; only allow explicitly known external targets
  // to be opened in the OS browser (never inside Electron itself).
  win.webContents.setWindowOpenHandler(({ url }) => {
    openExternalIfSafe(url);
    return { action: 'deny' };
  });

  // Any in-page navigation to a non-local URL is likewise redirected to the
  // OS browser instead of being loaded inside the app window.
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
      openExternalIfSafe(url);
    }
  });

  win.once('ready-to-show', () => {
    win.show();
    centerWindow();
  });

  win.on('close', (e) => {
    e.preventDefault();
    win.hide();
  });
}

function openExternalIfSafe(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') shell.openExternal(url);
  } catch {
    // ignore malformed URLs
  }
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

// ── Config storage (encrypted at rest via OS keychain through safeStorage) ──

function readConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return {};
    const raw = fs.readFileSync(CONFIG_PATH);
    if (!safeStorage.isEncryptionAvailable()) {
      // Fallback: file predates encryption support on this OS, or OS keychain
      // is unavailable. Treat as unreadable rather than silently leaking it.
      return {};
    }
    const decrypted = safeStorage.decryptString(raw);
    return JSON.parse(decrypted);
  } catch {
    return {};
  }
}

function writeConfig(cfg) {
  try {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('OS-level encryption is not available on this system');
    }
    const encrypted = safeStorage.encryptString(JSON.stringify(cfg));
    fs.writeFileSync(CONFIG_PATH, encrypted);
    return true;
  } catch (err) {
    console.error('Failed to persist config:', err.message);
    return false;
  }
}

ipcMain.handle('load-config', () => readConfig());
ipcMain.handle('save-config', (_event, cfg) => writeConfig(cfg));

// ── External links ──

ipcMain.on('open-external', (_event, url) => openExternalIfSafe(url));

// ── Update check (compares against latest GitHub Release, no auto-install) ──

function checkForUpdates() {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO}/releases/latest`,
    headers: { 'User-Agent': 'pubg-overlay-update-check' },
    timeout: 5000,
  };

  const req = https.get(options, (res) => {
    if (res.statusCode !== 200) { res.resume(); return; }
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        const latestTag = (data.tag_name || '').replace(/^v/, '');
        const current = app.getVersion();
        if (latestTag && isNewerVersion(latestTag, current)) {
          win?.webContents.send('update-available', {
            version: data.tag_name,
            url: data.html_url,
          });
        }
      } catch {
        // ignore malformed response
      }
    });
  });

  req.on('error', () => {}); // offline / no network — fail silently
  req.on('timeout', () => req.destroy());
}

function isNewerVersion(remote, current) {
  const r = remote.split('.').map(Number);
  const c = current.split('.').map(Number);
  for (let i = 0; i < Math.max(r.length, c.length); i++) {
    const rv = r[i] || 0, cv = c[i] || 0;
    if (rv > cv) return true;
    if (rv < cv) return false;
  }
  return false;
}

// IPC handlers
ipcMain.on('close-window', () => win.hide());
ipcMain.on('minimize-window', () => win.minimize());
ipcMain.on('toggle-overlay', () => {
  isOverlayMode = !isOverlayMode;
  toggleOverlayMode(isOverlayMode);
});
