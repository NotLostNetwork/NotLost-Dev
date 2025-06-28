import type { BrowserWindow } from 'electron';
import { desktopCapturer, WebContentsView } from 'electron';
import path from 'path';

import type { WebContentsViewBounds } from '../types/electron';

import { getImageAsDataURL } from './utils';

type Tab = {
  view: WebContentsView;
  url: string;
  faviconUrl?: string;
  title?: string;
};

export class WebContentsManager {
  private static instance: WebContentsManager;

  private mainWindow!: BrowserWindow;

  private tabs: Tab[] = [];
  private currentView: WebContentsView | undefined;
  private bounds: WebContentsViewBounds = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  };

  open(url: string): Promise<{ faviconUrl?: string; title?: string }> {
    return new Promise((resolve) => {
      if (this.currentView) {
        this.mainWindow.contentView.removeChildView(this.currentView);
      }

      const alreadyOpenedTab = this.tabs.find((t) => t.url === url);

      if (alreadyOpenedTab) {
        this.mainWindow.contentView.addChildView(alreadyOpenedTab.view);
        this.currentView = alreadyOpenedTab.view;
        return resolve({
          faviconUrl: alreadyOpenedTab.faviconUrl,
          title: alreadyOpenedTab.title,
        });
      }

      const newView = new WebContentsView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: false,
          preload: path.join(__dirname, 'preload.js'),
        },
      });

      const session = newView.webContents.session;
      session.setDisplayMediaRequestHandler((_, callback) => {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
          callback({ video: sources[0] });
        });
      });

      newView.setBounds(this.bounds);
      newView.webContents.loadURL(url);

      let faviconUrl: string | undefined;
      let title: string | undefined;
      let viewAdded = false;

      const tryFinish = () => {
        if (!viewAdded && faviconUrl && title) {
          const tab = { view: newView, url, faviconUrl, title };
          this.tabs.push(tab);
          this.mainWindow.contentView.addChildView(newView);
          this.currentView = newView;
          viewAdded = true;
          resolve({ faviconUrl, title });
        }
      };

      newView.webContents.once('page-favicon-updated', (e, icons) => {
        getImageAsDataURL(icons[0]).then((dataUrl) => {
          faviconUrl = dataUrl;
          tryFinish();
        });
      });

      newView.webContents.once('page-title-updated', (e, newTitle) => {
        title = newTitle;
        tryFinish();
      });

      /* setTimeout(() => {
        if (!viewAdded) {
          const tab = { view: newView, url, faviconUrl, title };
          this.tabs.push(tab);
          this.mainWindow.contentView.addChildView(newView);
          this.currentView = newView;
          viewAdded = true;
          resolve({ faviconUrl, title });
        }
      }, 2000); */
    });
  }

  resize(bounds: WebContentsViewBounds) {
    this.bounds = bounds;

    if (this.currentView) {
      this.currentView.setBounds(bounds);
    }

    for (const tab of this.tabs) {
      tab.view.setBounds(bounds);
    }
  }

  setCurrentViewVisible(isVisible: boolean) {
    if (this.currentView) {
      this.currentView.setVisible(isVisible);
    }
  }

  static init(mainWindow: BrowserWindow): WebContentsManager {
    if (!WebContentsManager.instance) {
      WebContentsManager.instance = new WebContentsManager();
      WebContentsManager.instance.mainWindow = mainWindow;
    }
    return WebContentsManager.instance;
  }

  static getInstance(): WebContentsManager {
    if (!WebContentsManager.instance) {
      throw new Error('WebContentsManager must be initialized first using init()');
    }
    return WebContentsManager.instance;
  }
}
