import * as React from "react";
import classnames from "classnames";

import { DropLineRendererInjectedProps, Item, List, PlaceholderRendererInjectedProps } from "../../src";

import { commonStyles } from "../shared";
import { styles } from "./shared";

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div
    ref={injectedProps.ref}
    className={classnames(commonStyles.dropLine, commonStyles.horizontal)}
    style={injectedProps.style}
  />
);
const renderGhostElement = () => <div className={classnames(styles.item, styles.ghost, styles.static)} />;
const renderPlaceholderElement = (injectedProps: PlaceholderRendererInjectedProps) => (
  <div className={classnames(styles.item, styles.placeholder, styles.static)} style={injectedProps.style} />
);

export const StaticComponent = () => (
  <List
    className={styles.wrapper}
    renderDropLine={renderDropLineElement}
    renderGhost={renderGhostElement}
    renderPlaceholder={renderPlaceholderElement}
    direction="horizontal"
    onDragEnd={() => false}
  >
    <Item identifier="a" index={0}>
      <div className={styles.item}>Item A</div>
    </Item>
    <Item identifier="b" index={1}>
      <div className={styles.item}>Item B</div>
    </Item>
    <Item identifier="c" index={2}>
      <div className={styles.item}>Item C</div>
    </Item>
    <Item identifier="d" index={3}>
      <div className={styles.item}>Item D</div>
    </Item>
    <Item identifier="e" index={4}>
      <div className={styles.item}>Item E</div>
    </Item>
  </List>
);
