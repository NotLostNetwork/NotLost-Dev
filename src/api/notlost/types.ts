import type { IconName } from '../../types/icons';

export const NotLostLocalStorageKeys = {
  workspaces: 'workspaces',
};

export type NotLostLocalStorageKey = keyof typeof NotLostLocalStorageKeys;

export type ApiWorkspace = {
  id: string;
  title: string;
  iconName: IconName;
  chats: ApiWorkspaceChat[];
  links: ApiWorkspaceLink[];
  chatFolders: ApiWorkspaceChatFolder[];
  linkFolders: ApiWorkspaceLinkFolder[];
};

export type ApiWorkspaceLink = {
  id: string;
  title: string;
  url: string;
};
export type ApiWorkspaceChat = {
  chatId: string;
};

type BaseFolder = {
  id: string;
  title: string;
};
export type ApiWorkspaceChatFolder = BaseFolder & {
  chats: ApiWorkspaceChat[];
};
export type ApiWorkspaceLinkFolder = BaseFolder & {
  links: ApiWorkspaceLink[];
};
