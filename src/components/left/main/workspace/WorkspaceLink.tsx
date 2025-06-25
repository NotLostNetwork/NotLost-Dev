import type { FC } from '@teact';
import { memo, useState } from '@teact';
import { getActions } from '../../../../global';

import buildClassName from '../../../../util/buildClassName';

import Icon from '../../../common/icons/Icon';
import ListItem from '../../../ui/ListItem';

import styles from './Workspace.module.scss';

type OwnProps = {
  id: string;
  url: string;
  title: string;
  selected: boolean;
};

const WorkspaceLink: FC<OwnProps> = ({
  id,
  url,
  title,
  selected,
}) => {
  const { setWorkspaceSelectedItemId, openChat } = getActions();

  const [faviconUrl, setFaviconUrl] = useState('');

  const handleClick = () => {
    setWorkspaceSelectedItemId(id);
    openChat({ id: undefined });
    window.electron?.setWebContentsViewUrl(url).then((res) => {
      setFaviconUrl(res.faviconUrl || '');
      window.electron?.setWebContentsViewVisible(true);
    });
  };

  const listItemClassName = buildClassName(
    styles.customListItem,
    selected && styles.selected,
  );

  const linkIconContainerClassName = buildClassName(
    styles.linkIconContainer,
    faviconUrl && styles.withFavicon,
  );

  return (
    <ListItem
      isStatic
      ripple
      className={listItemClassName}
      onClick={handleClick}
    >
      <div className={styles.link}>
        <div className={linkIconContainerClassName}>
          {faviconUrl
            ? <img src={faviconUrl} alt="favicon" />
            : (
              <Icon name="link" />
            )}
        </div>
        <div className={styles.linkTitle}>{title}</div>
      </div>
    </ListItem>

  );
};

export default memo(WorkspaceLink);
