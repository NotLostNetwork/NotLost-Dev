import type { FC } from '../../../lib/teact/teact';
import React, { memo, useCallback } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { LeftColumnContent } from '../../../types';
import type { IconName } from '../../../types/icons';

import { selectTabState } from '../../../global/selectors';
import buildClassName from '../../../util/buildClassName';

import Icon from '../../common/icons/Icon';

import styles from './MainSidebarTab.module.scss';

type OwnProps = {
  title: string;
  leftColumnContent?: LeftColumnContent;
  iconName?: IconName;
  onClick?: NoneToVoidFunction;
  isSelected?: boolean;
};

type StateProps = {
  currentLeftColumnContent: LeftColumnContent;
};

const MainSidebarTab: FC<OwnProps & StateProps> = ({
  iconName,
  title,
  onClick,
  leftColumnContent,
  currentLeftColumnContent,
  isSelected: propsIsSelected,
}) => {
  const {
    openLeftColumnContent,
  } = getActions();

  const isSelected = propsIsSelected || currentLeftColumnContent === leftColumnContent;

  const handleOnClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      openLeftColumnContent({ contentKey: leftColumnContent });
    }
  }, [leftColumnContent, onClick]);

  const selectorClassName = buildClassName(
    styles.selector,
    isSelected && styles.selected,
  );

  return (
    <div className={selectorClassName} onClick={handleOnClick}>
      {iconName && <Icon name={iconName} />}
      {title}
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global): StateProps => {
    const tabState = selectTabState(global);
    const leftColumnContentKey = tabState.leftColumn.contentKey;

    return {
      currentLeftColumnContent: leftColumnContentKey,
    };
  },
)(MainSidebarTab));
