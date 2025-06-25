import type { IconName } from '../../types/icons';

export const NotLostLocalStorageKeys = {
  workspaces: 'workspaces',
};

export type NotLostLocalStorageKey = keyof typeof NotLostLocalStorageKeys;

export type ApiWorkspaceFolder = {
  id: string;
  title: string;
  chatIds: string[];
};

export type ApiWorkspace = {
  id: string;
  title: string;
  iconName: IconName;
  chatIds: string[];
  sections: ApiWorkspaceSection[];
};

export type ApiWorkspaceSection = {
  id: string;
  title: string;
  chatIds: string[];
  folders: ApiWorkspaceFolder[];
};

export type ApiWorkspaceLink = {
  id: string;
  title: string;
  url: string;
};
