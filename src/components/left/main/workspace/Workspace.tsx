import type { FC } from '../../../../lib/teact/teact';
import { memo, useCallback, useState } from '../../../../lib/teact/teact';

import type { ApiInlineFolder, ApiSection, ApiWorkspace } from '../../../../api/notlost/types';

import buildClassName from '../../../../util/buildClassName';

import Icon from '../../../common/icons/Icon';
import WorkspaceRightSidebar from './WorkspaceRightSidebar';
import WorkspaceSection from './WorkspaceSection';
import WorkspaceSectionNew from './WorkspaceSectionNew';

import styles from './Workspace.module.scss';

export type ActiveEntityType = 'section' | 'folder';

type OwnProps = {
  workspace: ApiWorkspace;
};

const Workspace: FC<OwnProps> = ({
  workspace,
}) => {
  const [activeEntity, setActiveEntity] = useState<ApiInlineFolder | ApiSection | undefined>(undefined);
  const [activeEntityType, setActiveEntityType] = useState<ActiveEntityType | undefined>(undefined);

  const [isAddingNewSection, setIsAddingNewSection] = useState(false);

  const handleUnselectEntityForChatsAdd = useCallback(() => {
    setActiveEntity(undefined);
  }, []);

  const handleSetActiveEntity = useCallback(
    (entity: ApiInlineFolder | ApiSection, entityType: ActiveEntityType) => {
      setActiveEntity(entity);
      setActiveEntityType(entityType);
    }, []);

  const handleStartAddingNewFolder = useCallback(() => {
    setIsAddingNewSection(true);
  }, []);

  const containerClassName = buildClassName(
    styles.container,
    'custom-scroll',
  );

  return (
    <div className={containerClassName}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{workspace.title}</div>
        <Icon className={styles.addSectionButton} name="add" onClick={handleStartAddingNewFolder} />
      </div>
      {workspace.sections.map((section) => (
        <WorkspaceSection
          section={section}
          isHighlighted={activeEntity?.id === section.id}
          selectForAddingChats={() => handleSetActiveEntity(section, 'section')}
        />
      ))}
      {isAddingNewSection && (
        <WorkspaceSectionNew
          workspaceId={workspace.id}
          onCreationCancel={() => setIsAddingNewSection(false)}
        />
      )}
      <WorkspaceRightSidebar
        activeEntity={activeEntity}
        activeEntityType={activeEntityType}
        onClose={handleUnselectEntityForChatsAdd}
      />
    </div>
  );
};

export default memo(Workspace);
