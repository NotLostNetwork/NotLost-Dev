import type { FC } from '../../../lib/teact/teact';
import React, { memo } from '../../../lib/teact/teact';
import { withGlobal } from '../../../global';

import type { ApiPeer } from '../../../api/types';

import { selectPeer } from '../../../global/selectors';

import Avatar from '../../common/Avatar';
import WorkspaceSelector from './WorkspaceSelector';

import styles from './MainSidebar.module.scss';

type StateProps = {
  peer?: ApiPeer;
};

const MainSidebar: FC<StateProps> = ({
  peer,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.workspaceSelectorsContainer}>
        <WorkspaceSelector emoji="✨" title="Personal" selected />
        <WorkspaceSelector emoji="👨‍💻" title="Dev" />
      </div>
      <Avatar className={styles.profile} peer={peer} size="xl" forceRoundedRect />
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
