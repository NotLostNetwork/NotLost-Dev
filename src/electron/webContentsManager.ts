import type { BrowserWindow } from 'electron';
import { WebContentsView } from 'electron';

import type { WebContentsViewBounds } from '../types/electron';

type Tab = {
  view: WebContentsView;
  url: string;
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

  open(url: string) {
    if (this.currentView) {
      this.mainWindow.contentView.removeChildView(this.currentView);
    }

    const alreadyOpenedTab = this.tabs.find((t) => t.url === url);

    if (alreadyOpenedTab) {
      this.mainWindow.contentView.addChildView(alreadyOpenedTab.view);
      this.currentView = alreadyOpenedTab.view;
      return;
    }

    const newView = new WebContentsView();
    newView.webContents.loadURL(url);
    newView.setBounds(this.bounds);

    this.tabs.push({ view: newView, url });
    this.currentView = newView;
    this.mainWindow.contentView.addChildView(newView);
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
