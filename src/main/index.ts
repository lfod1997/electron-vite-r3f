import { app, shell, BrowserWindow, Tray } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { nativeTheme } from 'electron';

// Reference resource
import icon from '../../resources/icon.png?asset';
import * as path from 'path';

let tray, mainWindow;

// @ts-ignore
// noinspection JSUnusedLocalSymbols
const createTray = () => {
  if (process.platform === 'win32') {
    tray = new Tray(path.join(__dirname, '../../resources/tray.ico'));
  } else if (process.platform === 'darwin') {
    tray = new Tray(path.join(__dirname, '../../resources/trayTemplate.png'));
  } else if (process.platform === 'linux') {
    tray = new Tray(path.join(__dirname, '../../resources/tray.png'));
  }

  tray?.setToolTip('Electron');
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 485,
    minHeight: 665,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },

    // Platform-specific
    ...(process.platform === 'win32' ? {
      frame: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: nativeTheme.shouldUseDarkColors ? '#2f3241' : '#d4e8ef',
        symbolColor: nativeTheme.shouldUseDarkColors ? '#86a5b1' : '#26282e'
      }
    } : {}),
    ...(process.platform === 'darwin' ? {
      frame: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: true
    } : {}),
    ...(process.platform === 'linux' ? {
      icon: icon
    } : {})
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.once('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url).catch((err) => {
      console.log(`Unable to open "${details.url}": ${err.message}`);
    });
    return { action: 'deny' };
  });

  // HMR support
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // createTray();
  createWindow();

  // macOS relaunch from dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) { createWindow(); }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
