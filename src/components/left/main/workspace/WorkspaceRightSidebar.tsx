import type { FC } from '../../../../lib/teact/teact';
import {
  memo, useCallback, useEffect, useMemo, useState,
} from '../../../../lib/teact/teact';
import { getActions } from '../../../../global';

import type { ApiInlineFolder, ApiSection } from '../../../../api/notlost/types';
import type { ActiveEntityType } from './Workspace';

import { ALL_FOLDER_ID } from '../../../../config';
import { filterPeersByQuery } from '../../../../global/helpers/peers';
import buildClassName from '../../../../util/buildClassName';
import { unique } from '../../../../util/iteratees';

import { useFolderManagerForOrderedIds } from '../../../../hooks/useFolderManager';

import Icon from '../../../common/icons/Icon';
import PeerPicker from '../../../common/pickers/PeerPicker';
import Portal from '../../../ui/Portal';
import SearchInput from '../../../ui/SearchInput';
import Transition from '../../../ui/Transition';

import styles from './WorkspaceRightSidebar.module.scss';

type OwnProps = {
  activeEntity?: ApiSection | ApiInlineFolder;
  activeEntityType?: ActiveEntityType;
  onClose?: NoneToVoidFunction;
};

const WorkspaceRightSidebar: FC<OwnProps> = ({
  activeEntity,
  activeEntityType,
  onClose,
}) => {
  const { updateSectionChats } = getActions();
  const folderAllOrderedIds = useFolderManagerForOrderedIds(ALL_FOLDER_ID);

  const displayedIds = useMemo(() => {
    const chatIds = folderAllOrderedIds || [];
    return unique(
      filterPeersByQuery({ ids: chatIds, query: undefined, type: 'chat' }),
    );
  }, [folderAllOrderedIds]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(activeEntity?.chatIds || []);

  useEffect(() => {
    if (activeEntity) {
      setIsAnimating(true);
      return undefined;
    } else {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [activeEntity]);

  useEffect(() => {
    setSelectedIds(activeEntity?.chatIds || []);
  }, [activeEntity]);

  const handleAddChat = useCallback((ids: string[]) => {
    if (!activeEntity || !activeEntityType) return;

    switch (activeEntityType) {
      case 'section': {
        updateSectionChats({
          sectionId: activeEntity.id,
          chatIds: ids,
        });
        break;
      }

      default:
        break;
    }
  }, [activeEntity, activeEntityType]);

  useEffect(() => {
    if (!activeEntity) return;

    handleAddChat(selectedIds);
  }, [activeEntity, handleAddChat, selectedIds]);

  const containerClassName = buildClassName(styles.container);

  return (
    <Portal containerSelector="#middle-column-left-sidebar-portals" className={styles.portal}>
      <Transition
        name="slideFade"
        direction="inverse"
        activeKey={activeEntity ? 1 : 0}
        className={isAnimating ? styles.transitionContainer : undefined}
      >
        <div className={containerClassName}>
          {activeEntity && (
            <div className={styles.sidebar}>
              <div className={styles.header}>
                <div>Add chats</div>
                <Icon name="close" className={styles.closeButton} onClick={onClose} />
              </div>
              <SearchInput onChange={setSearchValue} />

              <PeerPicker
                itemIds={displayedIds}
                selectedIds={selectedIds}
                filterValue={searchValue}
                categoryPlaceholderKey="FilterChatTypes"
                searchInputId="new-group-picker-search"
                withDefaultPadding
                withPeerTypes
                allowMultiple
                itemInputType="checkbox"
                className={styles.picker}
                onSelectedIdsChange={setSelectedIds}
              />
            </div>
          )}
          <div className={styles.backdrop} onClick={onClose} />
        </div>
      </Transition>
    </Portal>
  );
};

export default memo(WorkspaceRightSidebar);
