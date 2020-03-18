import * as React from "react";
import classnames from "classnames";

import {
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  Item,
  List,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackedGroupRendererInjectedProps,
} from "../../src";

import { commonStyles } from "../shared";
import { styles } from "./shared";

type DummyItem = { id: string; title: string; children: DummyItem[] | undefined };

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={commonStyles.dropLine} style={injectedProps.style} />
);
const renderGhostElement = ({ isGroup }: GhostRendererMeta<DummyItem["id"]>) => (
  <div className={classnames({ [styles.item]: !isGroup, [styles.group]: isGroup }, styles.ghost, styles.static)} />
);
const renderPlaceholderElement = (
  injectedProps: PlaceholderRendererInjectedProps,
  { isGroup }: PlaceholderRendererMeta<DummyItem["id"]>,
) => (
  <div
    {...injectedProps.binder()}
    className={classnames({ [styles.item]: !isGroup, [styles.group]: isGroup }, styles.dragging)}
    style={injectedProps.style}
  />
);
const renderStackedGroupElement = (injectedProps: StackedGroupRendererInjectedProps) => (
  <div {...injectedProps.binder()} className={classnames(styles.group, styles.stacked)} style={injectedProps.style} />
);

export const StaticComponent = () => (
  <List
    className={styles.wrapper}
    renderDropLine={renderDropLineElement}
    renderGhost={renderGhostElement}
    renderPlaceholder={renderPlaceholderElement}
    renderStackedGroup={renderStackedGroupElement}
    onDragEnd={() => false}
  >
    <Item className={styles.item} identifier="a" index={0}>
      Item A
    </Item>
    <Item className={styles.item} identifier="b" index={1}>
      Item B
    </Item>
    <Item className={styles.item} identifier="c" index={2}>
      Item C
    </Item>
    <Item className={styles.item} identifier="d" index={3}>
      Item D
    </Item>
    <Item className={styles.group} identifier="e" index={4} isGroup>
      <div className={styles.heading}>Group E</div>
      <Item className={styles.item} identifier="e-1" index={0}>
        Item E - 1
      </Item>
      <Item className={styles.item} identifier="e-2" index={1}>
        Item E - 2
      </Item>
      <Item className={styles.item} identifier="e-3" index={2}>
        Item E - 3
      </Item>
      <Item className={styles.item} identifier="e-4" index={3}>
        Item E - 4
      </Item>
      <Item className={styles.group} identifier="e-5" index={4} isGroup>
        <div className={styles.heading}>Group E - 5</div>
        <Item className={styles.item} identifier="e-5-1" index={0}>
          Item E - 5 - 1
        </Item>
      </Item>
      <Item className={styles.group} identifier="e-6" index={4} isGroup>
        <div className={styles.heading}>Group E - 6</div>
      </Item>
      <Item className={styles.item} identifier="e-7" index={5}>
        Item E - 7
      </Item>
    </Item>
    <Item className={styles.item} identifier="f" index={5}>
      Item F
    </Item>
  </List>
);
