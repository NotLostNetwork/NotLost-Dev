import type { ActionReturnType } from '../../types';

import { addActionHandler } from '../..';

addActionHandler('loadWebContentsViewUrl', (global, actions, payload): ActionReturnType => {
  const { url } = payload;

  window.electron?.setWebContentsViewVisible(true);
  window.electron?.setWebContentsViewUrl(url);
});

addActionHandler('setWebContentsViewVisible', (global, actions, payload): ActionReturnType => {
  const { value } = payload;

  window.electron?.setWebContentsViewVisible(value);
});
