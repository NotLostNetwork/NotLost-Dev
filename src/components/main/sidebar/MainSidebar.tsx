import type { FC } from '../../../lib/teact/teact';
import React, { memo } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import { LeftColumnContent } from '../../../types';

import { selectTabState } from '../../../global/selectors';

import InlineFolder from '../../left/main/InlineFolder';
import MainSidebarTab from './MainSidebarTab';
import MainSidebarTabProfile from './MainSidebarTabProfile';

import styles from './MainSidebar.module.scss';

type StateProps = {
  leftColumnContentKey: LeftColumnContent;
};

const MainSidebar: FC<StateProps> = ({
  leftColumnContentKey,
}) => {
  const { openLeftColumnContent } = getActions();

  const handleOpenInbox = () => {
    openLeftColumnContent({ contentKey: LeftColumnContent.ChatList });
  };

  const handleOpenWorkspace = () => {
    openLeftColumnContent({ contentKey: LeftColumnContent.Workspace });
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <InlineFolder isSection title="Account" isFoldersSection isSidebarTab orderedIds={[]}>
          <MainSidebarTabProfile />
        </InlineFolder>
        <InlineFolder isSection title="Spaces" isFoldersSection isSidebarTab orderedIds={[]}>
          <MainSidebarTab
            iconName="lamp"
            title="Personal"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={handleOpenWorkspace}
            isSelected={leftColumnContentKey === LeftColumnContent.Workspace}
          />
          <MainSidebarTab title="Dev" iconName="keyboard" />
        </InlineFolder>
        <InlineFolder isSection title="Chats" isFoldersSection isSidebarTab orderedIds={[]}>
          <MainSidebarTab
            title="Unreads"
            iconName="check"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={handleOpenInbox}
            isSelected={leftColumnContentKey === LeftColumnContent.ChatList}
          />
          <MainSidebarTab title="All" iconName="message-read" />
          <MainSidebarTab title="Groups" iconName="group" />
          <MainSidebarTab title="Channels" iconName="channel" />
          <MainSidebarTab title="Bots" iconName="bots" />
          <MainSidebarTab title="Archive" iconName="archive" />
        </InlineFolder>
        <InlineFolder isSection title="Saved" isFoldersSection isSidebarTab orderedIds={[]}>
          <MainSidebarTab title="All" iconName="tag" />
        </InlineFolder>
      </div>
    </div>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    const tabState = selectTabState(global);
    const leftColumnContentKey = tabState.leftColumn.contentKey;
    return {
      leftColumnContentKey,
    };
  },
)(MainSidebar));
