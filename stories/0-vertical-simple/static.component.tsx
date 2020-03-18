import * as React from "react";
import classnames from "classnames";

import { DropLineRendererInjectedProps, Item, List, PlaceholderRendererInjectedProps } from "../../src";

import { commonStyles } from "../shared";
import { styles } from "./shared";

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={commonStyles.dropLine} style={injectedProps.style} />
);
const renderGhostElement = () => <div className={classnames(styles.item, styles.ghost, styles.static)} />;
const renderPlaceholderElement = (injectedProps: PlaceholderRendererInjectedProps) => (
  <div
    {...injectedProps.binder()}
    className={classnames(styles.item, styles.dragging, styles.static)}
    style={injectedProps.style}
  />
);

export const StaticComponent = () => (
  <List
    className={styles.wrapper}
    renderDropLine={renderDropLineElement}
    renderGhost={renderGhostElement}
    renderPlaceholder={renderPlaceholderElement}
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
    <Item className={styles.item} identifier="e" index={4}>
      Item E
    </Item>
  </List>
);
