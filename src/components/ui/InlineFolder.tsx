import type { FC } from '../../lib/teact/teact';
import React, {
  memo, useCallback, useEffect, useRef, useState,
} from '../../lib/teact/teact';

import buildClassName from '../../util/buildClassName';
import captureEnterKeyListener from '../../util/captureEnterKeyListener';
import captureEscKeyListener from '../../util/captureEscKeyListener';
import { ChatAnimationTypes } from '../left/main/hooks';

import Icon from '../common/icons/Icon';
import Chat from '../left/main/Chat';

import styles from './InlineFolder.module.scss';

type OwnProps = {
  orderedIds?: string[];
  children?: React.ReactNode;
  isSection?: boolean;
  isSidebarTab?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
  title?: string;
  isMocked?: boolean;
  className?: string;
  onAddClick?: NoneToVoidFunction;
  onMoreClick?: NoneToVoidFunction;
  onEditFinish?: (newTitle: string) => void;
  onEditCancel?: NoneToVoidFunction;
};

const InlineFolder: FC<OwnProps> = ({
  /* orderedIds */
  children,
  isSection,
  isSidebarTab,
  isSelected,
  title,
  isMocked,
  isEditing,
  onAddClick,
  onMoreClick,
  onEditFinish,
  onEditCancel,
}) => {
  const [isExpanded, setIsExpanded] = useState(isSection);
  const [onEditTitleValue, setOnEditTitleValue] = useState('');
  // eslint-disable-next-line no-null/no-null
  const editingTitleRef = useRef<HTMLInputElement>(null);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const mockChats = () => {
    return (
      <>
        <Chat
          chatId="-1001307778786"
          orderDiff={0}
          animationType={ChatAnimationTypes.None}
          isStatic
          className={styles.chat}
          avatarSize="tiny"
        />
        <Chat
          chatId="-1001322215945"
          orderDiff={0}
          animationType={ChatAnimationTypes.None}
          isStatic
          className={styles.chat}
          avatarSize="tiny"
        />
      </>
    );
  };

  const handleAddClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onAddClick?.();
  }, [onAddClick]);

  const handleMoreClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onMoreClick?.();
  }, [onMoreClick]);

  const headerClassname = buildClassName(
    styles.header,
    isSelected && styles.selected,
    isSection && styles.section,
    isSidebarTab && styles.sidebarTab,
  );

  const innerClassName = buildClassName(
    styles.inner,
    !isSection && styles.insetInner,
  );

  const renderInner = () => {
    return (
      <div className={innerClassName}>
        {isMocked && mockChats()}
        {children}
      </div>
    );
  };

  useEffect(() => {
    if (isEditing && editingTitleRef.current) {
      editingTitleRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    captureEscKeyListener(() => onEditCancel?.());
    captureEnterKeyListener(() => onEditFinish?.(onEditTitleValue));

    const leftIconClassName = buildClassName(
      styles.editingLeftIcon,
      !isSidebarTab && styles.rotate,
    );

    return (
      <div className={styles.editingContainer}>
        <Icon className={leftIconClassName} name={isSidebarTab ? 'lamp' : 'down'} />
        <input
          ref={editingTitleRef}
          className={styles.editingTitleInput}
          value={onEditTitleValue}
          onChange={(e) => setOnEditTitleValue(e.currentTarget.value)}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={headerClassname} onClick={handleToggleExpanded}>
        {!isSection && <Icon name="down" className={!isExpanded && styles.rotate} />}
        <div className={styles.title}>{title}</div>
        <div className={styles.actions}>
          <Icon
            name="more"
            className={styles.rotate}
            onClick={handleMoreClick}
          />
          <Icon
            name="add"
            onClick={handleAddClick}
          />
        </div>
      </div>
      {isExpanded && renderInner()}
    </div>
  );
};

export default memo(InlineFolder);
