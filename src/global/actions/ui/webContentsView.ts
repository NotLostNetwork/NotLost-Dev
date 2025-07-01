import type { ActionReturnType } from '../../types';

import { getCurrentTabId } from '../../../util/establishMultitabRole';
import { addActionHandler, getGlobal, setGlobal } from '../..';

addActionHandler('loadWebContentsViewUrl', (global, actions, payload): ActionReturnType => {
  const { url, callback } = payload;

  global = {
    ...global,
    webContentsViewIsLoading: true,
  };

  setGlobal(global);

  actions.openChat({ id: undefined, tabId: getCurrentTabId() });
  window.electron?.setWebContentsViewVisible(true);
  window.electron?.setWebContentsViewUrl(url).then((res) => {
    global = getGlobal();
    global = {
      ...global,
      webContentsViewIsLoading: false,
    };

    callback?.(res);
    setGlobal(global);
  });
});

addActionHandler('setWebContentsViewVisible', (global, actions, payload): ActionReturnType => {
  const { value } = payload;

  window.electron?.setWebContentsViewVisible(value);
});
