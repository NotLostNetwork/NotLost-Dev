import type { ActionReturnType } from '../../types';

import { addActionHandler, setGlobal } from '../..';

addActionHandler('setActiveWorkspaceId', (global, actions, payload): ActionReturnType => {
  global = {
    ...global,
    workspaces: {
      ...global.workspaces,
      activeId: payload,
    },
  };

  setGlobal(global);
});

addActionHandler('setWorkspaceSelectedItemId', (global, actions, payload): ActionReturnType => {
  global = {
    ...global,
    workspaces: {
      ...global.workspaces,
      selectedItemId: payload,
    },
  };

  setGlobal(global);
});
