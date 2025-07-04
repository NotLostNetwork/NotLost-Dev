import type { HandlerDetails } from 'electron';
import {
  app, BrowserWindow, ipcMain, screen,
  shell, systemPreferences } from 'electron';
import path from 'path';

import type { WebContentsViewBounds, WindowButtonsPosition } from '../types/electron';
import { ElectronAction, ElectronEvent } from '../types/electron';

import setupAutoUpdates, { AUTO_UPDATE_SETTING_KEY, getIsAutoUpdateEnabled } from './autoUpdates';
import { processDeeplink } from './deeplink';
import { captureLocalStorage, restoreLocalStorage } from './localStorage';
import tray from './tray';
import {
  checkIsWebContentsUrlAllowed, forceQuit, getAppTitle, getCurrentWindow, getLastWindow,
  hasExtraWindows, IS_FIRST_RUN, IS_MAC_OS, IS_PREVIEW, IS_PRODUCTION, IS_WINDOWS,
  reloadWindows, store, WINDOW_BUTTONS_POSITION, windows,
} from './utils';
import { WebContentsManager } from './webContentsManager';
import windowStateKeeper from './windowState';

const ALLOWED_DEVICE_ORIGINS = ['http://localhost:1234', 'file://'];

export function createWindow(url?: string) {
  const screenDimensions = screen.getPrimaryDisplay().workAreaSize;

  const windowState = windowStateKeeper({
    defaultWidth: screenDimensions.width,
    defaultHeight: screenDimensions.height,
  });

  let x;
  let y;

  const currentWindow = getCurrentWindow();
  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 24;
    y = currentWindowY + 24;
  } else {
    x = windowState.x;
    y = windowState.y;
  }

  let width;
  let height;

  if (currentWindow) {
    const bounds = currentWindow.getBounds();

    width = bounds.width;
    height = bounds.height;
  } else {
    width = windowState.width;
    height = windowState.height;
  }

  const window = new BrowserWindow({
    show: false,
    x,
    y,
    minWidth: 360,
    width,
    height,
    title: getAppTitle(),
    backgroundColor: '#181717',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      devTools: !IS_PRODUCTION,
    },
    ...(IS_MAC_OS && {
      titleBarStyle: 'hidden',
      trafficLightPosition: WINDOW_BUTTONS_POSITION.standard,
    }),
  });

  WebContentsManager.init(window);

  windowState.manage(window);

  window.webContents.setWindowOpenHandler((details: HandlerDetails) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  window.webContents.session.setDevicePermissionHandler(({ deviceType, origin }) => {
    return deviceType === 'hid' && ALLOWED_DEVICE_ORIGINS.includes(origin);
  });

  window.webContents.on('will-navigate', (event, newUrl) => {
    if (!checkIsWebContentsUrlAllowed(newUrl)) {
      event.preventDefault();
    }
  });

  window.on('page-title-updated', (event: Electron.Event) => {
    event.preventDefault();
  });

  window.on('enter-full-screen', () => {
    window.webContents.send(ElectronEvent.FULLSCREEN_CHANGE, true);
  });

  window.on('leave-full-screen', () => {
    window.webContents.send(ElectronEvent.FULLSCREEN_CHANGE, false);
  });

  window.on('close', (event) => {
    if (IS_MAC_OS || (IS_WINDOWS && tray.isEnabled)) {
      if (forceQuit.isEnabled) {
        app.exit(0);
        forceQuit.disable();
      } else if (hasExtraWindows()) {
        windows.delete(window);
        windowState.unmanage();
      } else {
        event.preventDefault();
        window.hide();
      }
    }
  });

  windowState.clearLastUrlHash();

  if (!IS_MAC_OS) {
    window.removeMenu();
  }

  if (IS_WINDOWS && tray.isEnabled) {
    tray.setupListeners(window);
    tray.create();
  }

  window.webContents.once('dom-ready', async () => {
    processDeeplink();

    if (IS_PRODUCTION) {
      setupAutoUpdates(windowState);
    }

    if (!IS_FIRST_RUN && getIsAutoUpdateEnabled() === undefined) {
      store.set(AUTO_UPDATE_SETTING_KEY, true);
      await captureLocalStorage();
      reloadWindows();
    }

    window.show();
  });

  windows.add(window);
  loadWindowUrl(window, url, windowState.urlHash);
}

function loadWindowUrl(window: BrowserWindow, url?: string, hash?: string): void {
  if (url && checkIsWebContentsUrlAllowed(url)) {
    window.loadURL(url);
  } else if (!app.isPackaged) {
    window.loadURL(`http://localhost:1234${hash}`);
    window.webContents.openDevTools();
  } else if (getIsAutoUpdateEnabled()) {
    window.loadURL(`${process.env.BASE_URL}${hash}`);
  } else if (getIsAutoUpdateEnabled() === undefined && IS_FIRST_RUN) {
    store.set(AUTO_UPDATE_SETTING_KEY, true);
    window.loadURL(`${process.env.BASE_URL}${hash}`);
  } else {
    window.loadURL(`file://${__dirname}/index.html${hash}`);
  }
}

export function setupElectronActionHandlers() {
  ipcMain.handle(ElectronAction.OPEN_NEW_WINDOW, (_, url: string) => {
    createWindow(url);
  });

  ipcMain.handle(ElectronAction.SET_WINDOW_TITLE, (_, newTitle?: string) => {
    getCurrentWindow()?.setTitle(getAppTitle(newTitle));
  });

  ipcMain.handle(ElectronAction.GET_IS_FULLSCREEN, () => {
    getCurrentWindow()?.isFullScreen();
  });

  ipcMain.handle(ElectronAction.HANDLE_DOUBLE_CLICK, () => {
    const currentWindow = getCurrentWindow();
    const doubleClickAction = systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');

    if (doubleClickAction === 'Minimize') {
      currentWindow?.minimize();
    } else if (doubleClickAction === 'Maximize') {
      if (!currentWindow?.isMaximized()) {
        currentWindow?.maximize();
      } else {
        currentWindow?.unmaximize();
      }
    }
  });

  ipcMain.handle(ElectronAction.SET_WINDOW_BUTTONS_POSITION, (_, position: WindowButtonsPosition) => {
    if (!IS_MAC_OS) {
      return;
    }

    getCurrentWindow()?.setWindowButtonPosition(WINDOW_BUTTONS_POSITION[position]);
  });

  ipcMain.handle(ElectronAction.SET_IS_AUTO_UPDATE_ENABLED, async (_, isAutoUpdateEnabled: boolean) => {
    if (IS_PREVIEW) {
      return;
    }

    store.set(AUTO_UPDATE_SETTING_KEY, isAutoUpdateEnabled);
    await captureLocalStorage();
    reloadWindows(isAutoUpdateEnabled);
  });

  ipcMain.handle(ElectronAction.GET_IS_AUTO_UPDATE_ENABLED, () => {
    return getIsAutoUpdateEnabled();
  });

  ipcMain.handle(ElectronAction.SET_IS_TRAY_ICON_ENABLED, (_, isTrayIconEnabled: boolean) => {
    if (isTrayIconEnabled) {
      tray.enable();
    } else {
      tray.disable();
    }
  });

  ipcMain.handle(ElectronAction.GET_IS_TRAY_ICON_ENABLED, () => tray.isEnabled);

  ipcMain.handle(ElectronAction.RESTORE_LOCAL_STORAGE, () => restoreLocalStorage());

  ipcMain.handle(ElectronAction.GET_WEB_CONTENTS_TABS, () => {
    return WebContentsManager.getInstance().getTabs();
  });
  ipcMain.handle(ElectronAction.CLOSE_WEB_CONTENTS_TAB, (_, tabId: string) => {
    return WebContentsManager.getInstance().closeTabById(tabId);
  });
  ipcMain.handle(ElectronAction.SET_WEB_CONTENTS_VIEW_BOUNDS, (_, bounds: WebContentsViewBounds) => {
    WebContentsManager.getInstance().resize(bounds);
  });
  ipcMain.handle(ElectronAction.SET_WEB_CONTENTS_VIEW_URL,
    (_, url: string) => {
      return WebContentsManager.getInstance().open(url);
    });
  ipcMain.handle(ElectronAction.SET_WEB_CONTENTS_VIEW_VISIBLE, (_, isVisible: boolean) => {
    WebContentsManager.getInstance().setCurrentViewVisible(isVisible);
  });
}

export function setupCloseHandlers() {
  app.on('window-all-closed', () => {
    if (!IS_MAC_OS) {
      app.quit();
    }
  });

  app.on('before-quit', (event) => {
    if (IS_MAC_OS && !forceQuit.isEnabled) {
      event.preventDefault();
      forceQuit.enable();
      app.quit();
    }
  });

  app.on('activate', () => {
    const hasActiveWindow = BrowserWindow.getAllWindows().length > 0;

    if (!hasActiveWindow) {
      createWindow();
    } else if (IS_MAC_OS) {
      forceQuit.disable();
      getLastWindow()?.show();
    }
  });
}
