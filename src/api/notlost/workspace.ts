import type { ApiInlineFolder, ApiWorkspace } from './types';
import { NotLostLocalStorageKeys } from './types';

import { MAIN_IDB_STORE } from '../../util/browser/idb';

class ApiWorkspaceLayer {
  store = MAIN_IDB_STORE;

  getWorkspaces = async (): Promise<ApiWorkspace[]> => {
    return (await this.store.get<ApiWorkspace[]>(NotLostLocalStorageKeys.workspaces)) ?? [];
  };

  updateWorkspaces = async (newWorkspace: ApiWorkspace): Promise<void> => {
    await this.store.update<ApiWorkspace[]>(
      NotLostLocalStorageKeys.workspaces,
      (old = []) => [...old, newWorkspace],
    );
  };

  updateWorkspaceFolders = async (workspaceId: string, newFolder: ApiInlineFolder): Promise<void> => {
    await this.store.update<ApiWorkspace[]>(
      NotLostLocalStorageKeys.workspaces,
      (old = []) => old.map((workspace) => {
        if (workspace.id === workspaceId) {
          const folders = workspace.folders ?? [];
          return {
            ...workspace,
            folders: [...folders, newFolder],
          };
        }
        return workspace;
      }),
    );
  };
}

export default new ApiWorkspaceLayer();
