import type { FC } from '../../../lib/teact/teact';
import React, { memo, useCallback, useState } from '../../../lib/teact/teact';
import { getActions } from '../../../global';

import type { ApiInlineFolder, ApiWorkspace } from '../../../api/notlost/types';

import InlineFolder from '../../ui/InlineFolder';
import WorkspaceRightSidebar from './WorkspaceRightSidebar';

import styles from './Workspace.module.scss';

type OwnProps = {
  workspace: ApiWorkspace;
};

const Workspace: FC<OwnProps> = ({
  workspace,
}) => {
  const { addNewFolderIntoWorkspace } = getActions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState<ApiInlineFolder | undefined>(undefined);

  const [isAddingNewFolder, setIsAddingNewFolder] = useState(false);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setActiveFolder(undefined);
  }, []);

  const handleOpenSidebar = useCallback((folder: ApiInlineFolder) => {
    return () => {
      setIsSidebarOpen(true);
      setActiveFolder(folder);
    };
  }, []);

  const handleStartAddingNewFolder = useCallback(() => {
    setIsAddingNewFolder(true);
  }, []);

  const handleCancelAddingNewFolder = useCallback(() => {
    setIsAddingNewFolder(false);
  }, []);

  const handleAddNewFolder = useCallback((title: string) => {
    addNewFolderIntoWorkspace({
      workspaceId: workspace.id,
      title,
    });
    handleCancelAddingNewFolder();
  }, [handleCancelAddingNewFolder, workspace.id]);

  return (
    <div className={styles.container}>
      <InlineFolder isSection title="Pinned" orderedIds={[]} isMocked />
      <InlineFolder isSection title="Folders" orderedIds={[]} onAddClick={handleStartAddingNewFolder}>
        {workspace.folders.map((f) => {
          return (
            <InlineFolder
              title={f.title}
              orderedIds={[]}
              isSelected={f.id === activeFolder?.id}
              isMocked
              onAddClick={handleOpenSidebar(f)}
            />
          );
        })}
        {isAddingNewFolder
          && (
            <InlineFolder
              isEditing
              onEditCancel={handleCancelAddingNewFolder}
              onEditFinish={handleAddNewFolder}
            />
          )}
      </InlineFolder>
      <WorkspaceRightSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} activeFolder={activeFolder} />
    </div>
  );
};

export default memo(Workspace);
