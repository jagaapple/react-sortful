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
    direction="horizontal"
    onDragEnd={() => false}
  >
    <Item identifier="a" index={0}>
      <div className={styles.item}>Item A</div>
    </Item>
    <Item identifier="b" index={1} isGroup>
      <div className={styles.group}>
        <div className={styles.heading}>Group B</div>
        <Item identifier="b-1" index={0}>
          <div className={styles.item}>Item B - 1</div>
        </Item>
        <Item identifier="b-2" index={1} isGroup>
          <div className={styles.group}>
            <div className={styles.heading}>Group B - 2</div>
            <Item identifier="b-2-1" index={0}>
              <div className={styles.item}>Item B - 2 - 1</div>
            </Item>
          </div>
        </Item>
        <Item identifier="b-3" index={2} isGroup>
          <div className={styles.group}>
            <div className={styles.heading}>Group B - 3</div>
          </div>
        </Item>
        <Item identifier="b-4" index={3}>
          <div className={styles.item}>Item B - 4</div>
        </Item>
      </div>
    </Item>
    <Item identifier="c" index={2}>
      <div className={styles.item}>Item C</div>
    </Item>
  </List>
);
