import type { FC } from '../../../lib/teact/teact';
import React, { memo, useCallback, useState } from '../../../lib/teact/teact';

import buildClassName from '../../../util/buildClassName';
import { ChatAnimationTypes } from './hooks';

import Icon from '../../common/icons/Icon';
import Chat from './Chat';

import styles from './InlineFolder.module.scss';

type OwnProps = {
  orderedIds: string[];
  children?: React.ReactNode;
  isSection?: boolean;
  isSidebarTab?: boolean;
  isSelected?: boolean;
  title: string;
  isMocked?: boolean;
  className?: string;
  onAddClick?: NoneToVoidFunction;
  onMoreClick?: NoneToVoidFunction;
};

const InlineFolder: FC<OwnProps> = ({
  /* orderedIds */
  children,
  isSection,
  isSidebarTab,
  isSelected,
  title,
  isMocked,
  onAddClick,
  onMoreClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(isSection);

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
  const titleClassName = buildClassName(
    styles.title,
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

  return (
    <div className={styles.container}>
      <div className={headerClassname} onClick={handleToggleExpanded}>
        {!isSection && <Icon name="down" className={!isExpanded && styles.rotate} />}
        <div className={titleClassName}>{title}</div>
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
