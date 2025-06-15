import type { FC } from '@teact';
import { memo, useCallback } from '@teact';
import { getActions } from '../../../../global';

import Accordion from '../../../ui/accordion/Accordion';

type OwnProps = {
  workspaceId: string;
  onCreationCancel: NoneToVoidFunction;
};

const WorkspaceSectionNew: FC<OwnProps> = ({
  workspaceId,
  onCreationCancel,
}) => {
  const { addNewSectionIntoWorkspace } = getActions();

  const handleAddNewSection = useCallback((title: string) => {
    if (title.length === 0) return;

    addNewSectionIntoWorkspace({
      title,
      workspaceId,
    });
  }, [workspaceId]);

  return (
    <Accordion
      isRenaming
      onRenameFinish={(title) => handleAddNewSection(title)}
      onRenameCancel={onCreationCancel}
    />
  );
};

export default memo(WorkspaceSectionNew);
