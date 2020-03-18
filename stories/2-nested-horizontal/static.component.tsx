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
  <div
    ref={injectedProps.ref}
    className={classnames(commonStyles.dropLine, commonStyles.horizontal)}
    style={injectedProps.style}
  />
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
    direction="horizontal"
    onDragEnd={() => false}
  >
    <Item className={styles.item} identifier="a" index={0}>
      Item A
    </Item>
    <Item className={styles.group} identifier="b" index={1} isGroup>
      <div className={styles.heading}>Group B</div>
      <Item className={styles.item} identifier="b-1" index={0}>
        Item B - 1
      </Item>
      <Item className={styles.group} identifier="b-2" index={1} isGroup>
        <div className={styles.heading}>Group B - 2</div>
        <Item className={styles.item} identifier="b-2-1" index={0}>
          Item B - 2 - 1
        </Item>
      </Item>
      <Item className={styles.group} identifier="b-3" index={2} isGroup>
        <div className={styles.heading}>Group B - 3</div>
      </Item>
      <Item className={styles.item} identifier="b-4" index={3}>
        Item B - 4
      </Item>
    </Item>
    <Item className={styles.item} identifier="c" index={2}>
      Item C
    </Item>
  </List>
);
