import type { FC } from '../../../lib/teact/teact';
import React, { memo, useMemo } from '../../../lib/teact/teact';
import { withGlobal } from '../../../global';

import type { ApiPeer } from '../../../api/types';

import { selectPeer } from '../../../global/selectors';

import useFlag from '../../../hooks/useFlag';

import Avatar from '../../common/Avatar';
import LeftSideMenuItems from '../../left/main/LeftSideMenuItems';
import StatusButton from '../../left/main/StatusButton';
import DropdownMenu from '../../ui/DropdownMenu';
import WorkspaceSelector from './WorkspaceSelector';

import styles from './MainSidebar.module.scss';

type StateProps = {
  peer?: ApiPeer;
};

const MainSidebar: FC<StateProps> = ({
  peer,
}) => {
  const [isBotMenuOpen, markBotMenuOpen, unmarkBotMenuOpen] = useFlag();

  const MainMenuTriggerAvatar: FC<{ onTrigger: () => void; isOpen?: boolean }> = useMemo(() => {
    return ({ onTrigger }) => (
      <div onClick={onTrigger}>
        <Avatar className={styles.profileAvatar} peer={peer} size="xl" forceRoundedRect />
      </div>
    );
  }, [peer]);
  return (
    <div className={styles.container}>
      <div className={styles.workspaceSelectorsContainer}>
        <WorkspaceSelector emoji="✨" title="Personal" selected />
        <WorkspaceSelector emoji="👨‍💻" title="Dev" />
      </div>
      <div className={styles.profileContainer}>
        <div>
          Search ⌘ + K
        </div>
        <div>
          <StatusButton />
        </div>
        <DropdownMenu
          trigger={MainMenuTriggerAvatar}
          footer="Footer"
          forceOpen={isBotMenuOpen}
          positionX="left"
          transformOriginX={200}
          positionY="bottom"
        >
          <LeftSideMenuItems
            /* onSelectArchived={onSelectArchived}
            onSelectContacts={onSelectContacts}
            onSelectSettings={onSelectSettings} */
            // eslint-disable-next-line react/jsx-no-bind
            onSelectArchived={() => {}}
            // eslint-disable-next-line react/jsx-no-bind
            onSelectContacts={() => {}}
            // eslint-disable-next-line react/jsx-no-bind
            onSelectSettings={() => {}}
            onBotMenuOpened={markBotMenuOpen}
            onBotMenuClosed={unmarkBotMenuOpen}
          />
        </DropdownMenu>
      </div>
    </div>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    const peer = selectPeer(global, global.currentUserId || '');
    return {
      peer,
    };
  },
)(MainSidebar));
