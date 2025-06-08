import type { ApiInlineFolder, ApiWorkspace } from '../../../api/notlost/types';
import type { ActionReturnType } from '../../types';

import ApiWorkspaceLayer from '../../../api/notlost/workspace';
import { addActionHandler, getGlobal, setGlobal } from '../..';

addActionHandler('loadAllWorkspaces', async (global): Promise<void> => {
  const result = await ApiWorkspaceLayer.getWorkspaces();

  if (result) {
    global = getGlobal();

    global = {
      ...global,
      workspaces: {
        ...global.workspaces,
        areLoaded: true,
        byOrder: result,
      },
    };
  }

  setGlobal(global);
});

addActionHandler('addNewWorkspace', (global, actions, payload): ActionReturnType => {
  const { title, iconName } = payload;

  const newWorkspace: ApiWorkspace = {
    id: crypto.randomUUID(),
    title,
    iconName,
    pinnedChatIds: [],
    folders: [],
  };

  ApiWorkspaceLayer.updateWorkspaces(newWorkspace);

  global = {
    ...global,
    workspaces: {
      ...global.workspaces,
      byOrder: [...global.workspaces.byOrder, newWorkspace],
    },
  };

  setGlobal(global);
});

addActionHandler('addNewFolderIntoWorkspace', (global, actions, payload): ActionReturnType => {
  const { title, workspaceId } = payload;

  const newFolder: ApiInlineFolder = {
    id: crypto.randomUUID(),
    title,
    chatIds: [],
  };

  const workspace = global.workspaces.byOrder.find((w) => w.id === workspaceId);
  if (!workspace) {
    return;
  }

  ApiWorkspaceLayer.updateWorkspaceFolders(workspaceId, newFolder);

  const updatedWorkspace = {
    ...workspace,
    folders: [...(workspace.folders || []), newFolder],
  };

  global = {
    ...global,
    workspaces: {
      ...global.workspaces,
      byOrder: global.workspaces.byOrder.map((w) => (w.id === workspaceId ? updatedWorkspace : w)),
    },
  };

  setGlobal(global);
});
