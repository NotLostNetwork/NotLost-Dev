import type { FC } from '../../../../lib/teact/teact';
import { memo, useCallback, useEffect, useState } from '../../../../lib/teact/teact';
import { withGlobal } from '../../../../global';

import type { ApiWorkspace, ApiWorkspaceChatFolder } from '../../../../api/notlost/types';

import buildClassName from '../../../../util/buildClassName';
import { ChatAnimationTypes } from '../hooks';

import Icon from '../../../common/icons/Icon';
import Chat from '../Chat';
import WorkspaceChatFolder from './WorkspaceChatFolder';
import WorkspaceChatFolderNew from './WorkspaceChatFolderNew';
import WorkspaceLink from './WorkspaceLink';
import WorkspaceRightSidebar from './WorkspaceRightSidebar';
import WorkspaceSection from './WorkspaceSection';

import styles from './Workspace.module.scss';

export type ActiveEntityType = 'workspace' | 'chatFolder';
export type ActiveEntity = ApiWorkspace | ApiWorkspaceChatFolder;

type OwnProps = {
  workspace: ApiWorkspace;
};

type StateProps = {
  selectedItemId?: string;
};

const Workspace: FC<OwnProps & StateProps> = ({
  workspace,
  selectedItemId,
}) => {
  const [activeEntity, setActiveEntity] = useState<ActiveEntity | undefined>(undefined);
  const [activeEntityType, setActiveEntityType] = useState<ActiveEntityType | undefined>(undefined);

  const [isAddingNewChatFolder, setIsAddingNewChatFolder] = useState(false);

  const handleUnselectEntityForChatsAdd = useCallback(() => {
    setActiveEntity(undefined);
    setActiveEntityType(undefined);
  }, []);

  const handleSetActiveEntity = useCallback(
    (entity: ActiveEntity, entityType: ActiveEntityType) => {
      setActiveEntity(entity);
      setActiveEntityType(entityType);
    }, []);

  useEffect(() => {
    // refresh active entity on workspace update, should refactor somehow
    if (!activeEntity) return;

    if (activeEntityType === 'workspace') {
      handleSetActiveEntity(workspace, 'workspace');
    } else if (activeEntityType === 'chatFolder') {
      const updatedSection = workspace.chatFolders.find((f) => f.id === activeEntity.id)!;
      handleSetActiveEntity(updatedSection, 'chatFolder');
    }
  }, [activeEntity, activeEntityType, handleSetActiveEntity, workspace]);

  const containerClassName = buildClassName(
    styles.container,
    'custom-scroll',
  );

  const headerClassName = buildClassName(
    styles.header,
    activeEntityType === 'workspace' && styles.selected,
  );

  return (
    <div className={containerClassName}>
      <div className={headerClassName}>
        <div className={styles.headerTitle}>{workspace?.title}</div>
        <Icon
          className={styles.addFolderButton}
          name="folder"
          onClick={() => setIsAddingNewChatFolder(true)}
        />
        <Icon
          className={styles.addSectionButton}
          name="add"
          onClick={() => handleSetActiveEntity(workspace, 'workspace')}
        />
      </div>
      <div className={styles.chats}>
        {workspace?.chats.map((chat) => (
          <Chat
            chatId={chat.chatId}
            orderDiff={0}
            animationType={ChatAnimationTypes.Opacity}
            isStatic
            avatarSize="tiny"
          />
        ))}
      </div>
      {workspace.chatFolders.length > 0 && (
        <WorkspaceSection sectionTitle="Folders" onAddClick={() => setIsAddingNewChatFolder(true)}>
          {isAddingNewChatFolder && (
            <WorkspaceChatFolderNew
              workspaceId={workspace.id}
              onCreationFinishOrCancel={() => setIsAddingNewChatFolder(false)}
            />
          )}
          {workspace.chatFolders.map((chatFolder) => (
            <WorkspaceChatFolder
              key={chatFolder.id}
              chatFolder={chatFolder}
              isHighlighted={activeEntity?.id === chatFolder.id}
              selectForAddingChats={() => handleSetActiveEntity(chatFolder, 'chatFolder')}
            />
          ))}
        </WorkspaceSection>
      )}
      <WorkspaceSection sectionTitle="Links">
        <WorkspaceLink url="https://chatgpt.com/" title="Chat GPT" id="1" selected={selectedItemId === '1'} />
        <WorkspaceLink url="https://www.notion.so/new" title="New note" id="2" selected={selectedItemId === '2'} />
        <WorkspaceLink url="https://figma.com" title="Figma" id="3" selected={selectedItemId === '3'} />
        <WorkspaceLink url="https://figma.cum" title="Figma" id="4" selected={selectedItemId === '4'} />
      </WorkspaceSection>
      {/* <WorkspaceSection sectionTitle="Notes">
        <WorkspaceNote url="https://notion.so" title="Meet notes" id="5" selected={selectedItemId === '5'} />
        <WorkspaceNote url="https://www.notion.so/new" title="Todo tomorrow" id="6" selected={selectedItemId === '6'} />
      </WorkspaceSection> */}
      <WorkspaceRightSidebar
        activeEntity={activeEntity}
        activeEntityType={activeEntityType}
        onClose={handleUnselectEntityForChatsAdd}
        handleStartAddingNewSection={() => setIsAddingNewChatFolder(true)}
      />
    </div>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    return {
      selectedItemId: global.workspaces.selectedItemId,
    };
  },
)(Workspace));
