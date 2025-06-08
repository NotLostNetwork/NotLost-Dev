import type { FC } from '../../../lib/teact/teact';
import React, { memo, useCallback } from '../../../lib/teact/teact';
import { getActions } from '../../../global';

import type { ApiWorkspace } from '../../../api/notlost/types';

import InlineFolder from './InlineFolder';

import styles from './Workspace.module.scss';

type OwnProps = {
  workspace: ApiWorkspace;
};

const Workspace: FC<OwnProps> = ({
  workspace,
}) => {
  const { addNewFolderIntoWorkspace } = getActions();

  const handleAddNewFolder = useCallback(() => {
    addNewFolderIntoWorkspace({
      workspaceId: workspace.id,
      title: 'Test',
    });
  }, [workspace.id]);

  return (
    <div className={styles.container}>
      <InlineFolder isSection title="Pinned" orderedIds={[]} isMocked />
      <InlineFolder isSection title="Folders" orderedIds={[]} onAddClick={handleAddNewFolder}>
        {workspace.folders.map((f) => (
          <InlineFolder title={f.title} orderedIds={[]} isMocked />
        ))}
      </InlineFolder>
    </div>
  );
};

export default memo(Workspace);
