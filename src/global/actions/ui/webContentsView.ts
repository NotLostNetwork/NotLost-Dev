import type { ActionReturnType } from '../../types';

import { getCurrentTabId } from '../../../util/establishMultitabRole';
import { addActionHandler, getGlobal, setGlobal } from '../..';

addActionHandler('loadWebContentsViewUrl', (global, actions, payload): ActionReturnType => {
  const { url } = payload;

  global = {
    ...global,
    webContentsViewIsLoading: true,
    webContentsViewError: undefined,
  };

  setGlobal(global);

  actions.openChat({ id: undefined, tabId: getCurrentTabId() });

  window.electron?.setWebContentsViewVisible(true);
  window.electron?.setWebContentsViewUrl(url)
    .then(() => {
      global = getGlobal();
      global = {
        ...global,
        webContentsViewIsLoading: false,
      };

      setGlobal(global);
    })
    .catch((e) => {
      global = getGlobal();
      global = {
        ...global,
        webContentsViewIsLoading: false,
        webContentsViewError: e,
      };

      setGlobal(global);
    });
});

addActionHandler('setWebContentsViewVisible', (global, actions, payload): ActionReturnType => {
  const { value } = payload;

  global = {
    ...global,
    webContentsViewIsLoading: false,
    webContentsViewError: undefined,
  };
  setGlobal(global);

  window.electron?.setWebContentsViewVisible(value);
});
