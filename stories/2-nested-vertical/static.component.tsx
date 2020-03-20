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
    className={classnames({ [styles.item]: !isGroup, [styles.group]: isGroup }, styles.placeholder)}
    style={injectedProps.style}
  />
);
const renderStackedGroupElement = (injectedProps: StackedGroupRendererInjectedProps) => (
  <div className={classnames(styles.group, styles.stacked)} style={injectedProps.style} />
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
    <Item identifier="e" index={4} isGroup>
      <div className={styles.group}>
        <div className={styles.heading}>Group E</div>
        <Item identifier="e-1" index={0}>
          <div className={styles.item}>Item E - 1</div>
        </Item>
        <Item identifier="e-2" index={1}>
          <div className={styles.item}>Item E - 2</div>
        </Item>
        <Item identifier="e-3" index={2}>
          <div className={styles.item}>Item E - 3</div>
        </Item>
        <Item identifier="e-4" index={3}>
          <div className={styles.item}>Item E - 4</div>
        </Item>
        <Item identifier="e-5" index={4} isGroup>
          <div className={styles.group}>
            <div className={styles.heading}>Group E - 5</div>
            <Item identifier="e-5-1" index={0}>
              <div className={styles.item}>Item E - 5 - 1</div>
            </Item>
          </div>
        </Item>
        <Item identifier="e-6" index={4} isGroup>
          <div className={styles.group}>
            <div className={styles.heading}>Group E - 6</div>
          </div>
        </Item>
        <Item identifier="e-7" index={5}>
          <div className={styles.item}>Item E - 7</div>
        </Item>
      </div>
    </Item>
    <Item identifier="f" index={5}>
      <div className={styles.item}>Item F</div>
    </Item>
  </List>
);
