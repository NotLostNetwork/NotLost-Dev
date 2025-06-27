import type { FC, TeactNode } from '@teact';
import { memo } from '@teact';

import Accordion from '../../../ui/accordion/Accordion';
import AccordionSavedState from '../../../ui/accordion/AccordionSavedState';

import styles from './WorkspaceSection.module.scss';

type OwnProps = {
  sectionTitle: string;
  children: TeactNode;
};

const WorkspaceSection: FC<OwnProps> = ({
  sectionTitle,
  children,
},
) => {
  const id = `accordion-saved-state-${sectionTitle}`;
  return (
    <AccordionSavedState id={id}>
      {({ isExpandedByDefault, onChange }) => (
        <Accordion
          key={id}
          title={sectionTitle}
          isExpandedByDefault={isExpandedByDefault}
          onChange={onChange}
          className={styles.accordion}
        >
          {children}
        </Accordion>
      )}
    </AccordionSavedState>
  );
};

export default memo(WorkspaceSection);
