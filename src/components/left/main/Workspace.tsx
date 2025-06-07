import React, { memo } from '../../../lib/teact/teact';

import InlineFolder from './InlineFolder';

import styles from './Workspace.module.scss';

const Workspace = () => {
  return (
    <div className={styles.container}>
      <InlineFolder isSection title="Pinned" orderedIds={[]} isMocked />
      <InlineFolder isSection title="Folders" orderedIds={[]}>
        <InlineFolder title="NotLost" orderedIds={[]} isMocked />
        <InlineFolder title="Telegram updates" orderedIds={[]} />
        <InlineFolder title="Channels" orderedIds={[]} />
        <InlineFolder title="Paris" orderedIds={[]} />
      </InlineFolder>
    </div>
  );
};

export default memo(Workspace);
