import type { FC, TeactNode } from '../../../lib/teact/teact';
import {
  memo,
} from '../../../lib/teact/teact';

import { LeftColumnContent } from '../../../types';

import buildClassName from '../../../util/buildClassName';

import Accordion from '../../ui/accordion/Accordion';
import MainSidebarTab from './MainSidebarTab';
import MainSidebarTabProfile from './MainSidebarTabProfile';
import MainSidebarWorkspaces from './MainSidebarWorkspaces';

import styles from './MainSidebar.module.scss';

const Section = ({ title, children }: { title: string; children: TeactNode }) => {
  return (
    <Accordion
      title={title}
      isExpandedByDefault
      className={styles.SidebarAccordionSection}
    >
      {children}
    </Accordion>
  );
};

const MainSidebar: FC = () => {
  const containerClassName = buildClassName(
    styles.container,
    'custom-scroll',
  );

  return (
    <div className={containerClassName}>
      <div className={styles.tabs}>
        <Section title="Account">
          <MainSidebarTabProfile />
        </Section>
        <MainSidebarWorkspaces />
        <Section title="Chats">
          <MainSidebarTab
            title="Unreads"
            iconName="check"
            leftColumnContent={LeftColumnContent.AllUnread}
          />
          <MainSidebarTab
            title="All"
            iconName="message-read"
            leftColumnContent={LeftColumnContent.ChatList}
          />
          <MainSidebarTab
            title="Groups"
            iconName="group"
            leftColumnContent={LeftColumnContent.Groups}
          />
          <MainSidebarTab
            title="Channels"
            iconName="channel"
            leftColumnContent={LeftColumnContent.Channels}
          />
          <MainSidebarTab
            title="Bots"
            iconName="bots"
            leftColumnContent={LeftColumnContent.Bots}
          />
          <MainSidebarTab
            title="Archive"
            iconName="archive"
            leftColumnContent={LeftColumnContent.Archived}
          />
        </Section>
        <Section title="Saved">
          <MainSidebarTab
            title="All"
            iconName="tag"
            leftColumnContent={LeftColumnContent.Saved}
          />
        </Section>
      </div>
    </div>
  );
};

export default memo(MainSidebar);
