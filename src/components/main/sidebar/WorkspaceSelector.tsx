import type { FC } from '../../../lib/teact/teact';
import React, { memo } from '../../../lib/teact/teact';

import buildClassName from '../../../util/buildClassName';

import styles from './WorkspaceSelector.module.scss';

type OwnProps = {
  emoji: string;
  title: string;
  selected?: boolean;
};

const WorkspaceSelector: FC<OwnProps> = ({
  emoji,
  title,
  selected,
}) => {
  const titleClassName = buildClassName(
    styles.title,
    selected && styles.titleSelected,
  );
  return (
    <div className={styles.selector}>
      <div className={styles.emoji}>{emoji}</div>
      <div className={titleClassName}>{title}</div>
    </div>
  );
};

export default memo(WorkspaceSelector);
