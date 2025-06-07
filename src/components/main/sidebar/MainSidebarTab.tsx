import type { FC } from '../../../lib/teact/teact';
import React, { memo } from '../../../lib/teact/teact';

import type { IconName } from '../../../types/icons';

import buildClassName from '../../../util/buildClassName';

import Icon from '../../common/icons/Icon';

import styles from './MainSidebarTab.module.scss';

type OwnProps = {
  title: string;
  iconName?: IconName;
  isSelected?: boolean;
  onClick?: NoneToVoidFunction;
};

const MainSidebarTab: FC<OwnProps> = ({
  iconName,
  title,
  isSelected,
  onClick,
}) => {
  const selectorClassName = buildClassName(
    styles.selector,
    isSelected && styles.selected,
  );

  return (
    <div className={selectorClassName} onClick={onClick}>
      {iconName && <Icon name={iconName} style="font-size: 1rem;" />}
      {title}
    </div>
  );
};

export default memo(MainSidebarTab);
