import type { FC } from '../../../lib/teact/teact';
import React, {
  memo, useEffect, useMemo, useState,
} from '../../../lib/teact/teact';

import type { ApiInlineFolder } from '../../../api/notlost/types';

import { ALL_FOLDER_ID } from '../../../config';
import { filterPeersByQuery } from '../../../global/helpers/peers';
import buildClassName from '../../../util/buildClassName';
import { unique } from '../../../util/iteratees';

import { useFolderManagerForOrderedIds } from '../../../hooks/useFolderManager';

import Icon from '../../common/icons/Icon';
import PeerPicker from '../../common/pickers/PeerPicker';
import InputText from '../../ui/InputText';
import Portal from '../../ui/Portal';
import Transition from '../../ui/Transition';

import styles from './WorkspaceRightSidebar.module.scss';

type OwnProps = {
  isOpen: boolean;
  onClose: NoneToVoidFunction;
  activeFolder?: ApiInlineFolder;
};

const WorkspaceRightSidebar: FC<OwnProps> = ({
  isOpen,
  onClose,
}) => {
  const folderAllOrderedIds = useFolderManagerForOrderedIds(ALL_FOLDER_ID);

  const displayedIds = useMemo(() => {
    const chatIds = [...folderAllOrderedIds || []];
    return unique([
      ...filterPeersByQuery({ ids: chatIds, query: undefined, type: 'chat' }),
    ]);
  }, [folderAllOrderedIds]);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isOpen]);

  const containerClassName = buildClassName(
    styles.container,
  );

  return (
    <Portal containerSelector="#middle-column-left-sidebar-portals" className={styles.portal}>
      <Transition
        name="slideFade"
        direction="inverse"
        activeKey={isOpen ? 1 : 0}
        className={isAnimating && styles.transitionContainer}
      >

        <div className={containerClassName}>
          {isOpen && (
            <div className={styles.sidebar}>
              <div className={styles.searchContainer}>
                <Icon name="search" className={styles.searchIcon} />
                <InputText className={styles.search} placeholder="Search" />
              </div>

              <PeerPicker
                itemIds={displayedIds}
                selectedIds={[]}
                categoryPlaceholderKey="FilterChatTypes"
                searchInputId="new-group-picker-search"
                withDefaultPadding
                withPeerTypes
                allowMultiple
                itemInputType="checkbox"
                className={styles.picker}
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
