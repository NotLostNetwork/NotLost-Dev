import type { FC } from '../../../lib/teact/teact';
import React, { memo, useCallback, useEffect } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { ApiWorkspace } from '../../../api/notlost/types';
import { LeftColumnContent } from '../../../types';

import { selectTabState } from '../../../global/selectors';

import InlineFolder from '../../left/main/InlineFolder';
import MainSidebarTab from './MainSidebarTab';
import MainSidebarTabProfile from './MainSidebarTabProfile';

import styles from './MainSidebar.module.scss';

type StateProps = {
  workspaces: ApiWorkspace[];
  areWorkspacesLoaded: boolean;
  leftColumnContentKey: LeftColumnContent;
  activeWorkspaceId: string | undefined;
};

const MainSidebar: FC<StateProps> = ({
  workspaces,
  areWorkspacesLoaded,
  leftColumnContentKey,
  activeWorkspaceId,
}) => {
  const {
    loadAllWorkspaces, addNewWorkspace, openLeftColumnContent, setActiveWorkspaceId,
  } = getActions();

  const handleOpenAllChats = useCallback(() => {
    openLeftColumnContent({ contentKey: LeftColumnContent.ChatList });
  }, []);

  const handleOpenArchive = useCallback(() => {
    openLeftColumnContent({ contentKey: LeftColumnContent.Archived });
  }, []);

  const handleOpenSaved = useCallback(() => {
    openLeftColumnContent({ contentKey: LeftColumnContent.Saved });
  }, []);

  const handleOpenAllUnread = useCallback(() => {
    openLeftColumnContent({ contentKey: LeftColumnContent.AllUnread });
  }, []);

  const handleOpenBots = useCallback(() => {
    openLeftColumnContent({ contentKey: LeftColumnContent.Bots });
  }, []);

  const handleOpenGroups = useCallback(() => {
    openLeftColumnContent({ contentKey: LeftColumnContent.Groups });
  }, []);

  const handleOpenChannels = useCallback(() => {
    openLeftColumnContent({ contentKey: LeftColumnContent.Channels });
  }, []);

  const setActiveWorkspace = useCallback((id: string) => {
    if (leftColumnContentKey !== LeftColumnContent.Workspace) {
      openLeftColumnContent({ contentKey: LeftColumnContent.Workspace });
    }
    setActiveWorkspaceId(id);
  }, [leftColumnContentKey]);

  const handleAddNewWorkspace = useCallback(() => {
    addNewWorkspace({
      title: 'Test',
      iconName: 'lamp',
    });
  }, []);

  useEffect(() => {
    if (!areWorkspacesLoaded) {
      loadAllWorkspaces();
    } else if (activeWorkspaceId === undefined) {
      setActiveWorkspace(workspaces[0].id);
    }
  }, [activeWorkspaceId, areWorkspacesLoaded, setActiveWorkspace, workspaces]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <InlineFolder isSection title="Account" isSidebarTab orderedIds={[]}>
          <MainSidebarTabProfile />
        </InlineFolder>
        <InlineFolder
          title="Spaces"
          isSection
          isSidebarTab
          onAddClick={handleAddNewWorkspace}
          orderedIds={[]}
        >
          {workspaces.map((w) => (
            <MainSidebarTab
              iconName={w.iconName}
              title={w.title}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => setActiveWorkspace(w.id)}
              isSelected={w.id === activeWorkspaceId && leftColumnContentKey === LeftColumnContent.Workspace}
            />
          ))}
        </InlineFolder>
        <InlineFolder isSection title="Chats" isSidebarTab orderedIds={[]}>
          <MainSidebarTab
            title="Unreads"
            iconName="check"
            onClick={handleOpenAllUnread}
            isSelected={leftColumnContentKey === LeftColumnContent.AllUnread}
          />
          <MainSidebarTab
            title="All"
            iconName="message-read"
            onClick={handleOpenAllChats}
            isSelected={leftColumnContentKey === LeftColumnContent.ChatList}
          />
          <MainSidebarTab
            title="Groups"
            iconName="group"
            onClick={handleOpenGroups}
            isSelected={leftColumnContentKey === LeftColumnContent.Groups}
          />
          <MainSidebarTab
            title="Channels"
            iconName="channel"
            onClick={handleOpenChannels}
            isSelected={leftColumnContentKey === LeftColumnContent.Channels}
          />
          <MainSidebarTab
            title="Bots"
            iconName="bots"
            onClick={handleOpenBots}
            isSelected={leftColumnContentKey === LeftColumnContent.Bots}
          />
          <MainSidebarTab
            title="Archive"
            iconName="archive"
            onClick={handleOpenArchive}
            isSelected={leftColumnContentKey === LeftColumnContent.Archived}
          />
        </InlineFolder>
        <InlineFolder isSection title="Saved" isSidebarTab orderedIds={[]}>
          <MainSidebarTab
            title="All"
            iconName="tag"
            onClick={handleOpenSaved}
            isSelected={leftColumnContentKey === LeftColumnContent.Saved}
          />
        </InlineFolder>
      </div>
    </div>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    const { workspaces } = global;

    const tabState = selectTabState(global);
    const leftColumnContentKey = tabState.leftColumn.contentKey;

    return {
      workspaces: workspaces.byOrder,
      areWorkspacesLoaded: workspaces.areLoaded,
      activeWorkspaceId: workspaces.activeId,
      leftColumnContentKey,
    };
  },
)(MainSidebar));
