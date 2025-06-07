import type { FC } from '../../../lib/teact/teact';
import React, { memo, useState } from '../../../lib/teact/teact';

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
  title: string;
  isMocked?: boolean;
  className?: string;
};

const InlineFolder: FC<OwnProps> = ({
  /* orderedIds */
  children,
  isSection,
  isSidebarTab,
  title,
  isMocked,
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

  const renderInner = () => {
    return (
      <div className={styles.innerContainer}>
        {isMocked && mockChats()}
        {children}
      </div>
    );
  };

  const headerClassname = buildClassName(
    styles.header,
    isSection && styles.section,
    isSidebarTab && styles.sidebarTab,

  );
  const titleClassName = buildClassName(
    styles.title,
    isSection && styles.section,
    isSidebarTab && styles.sidebarTab,
  );

  return (
    <div className={styles.container}>
      <div className={headerClassname} onClick={handleToggleExpanded}>
        {!isSection && <Icon name="down" className={!isExpanded && styles.rotate} />}
        <div className={titleClassName}>{title}</div>
        <div className={styles.actions}>
          <Icon name="more" className={styles.rotate} />
          <Icon name="add" />
        </div>
      </div>

      {isExpanded && renderInner()}

    </div>
  );
};

export default memo(InlineFolder);
