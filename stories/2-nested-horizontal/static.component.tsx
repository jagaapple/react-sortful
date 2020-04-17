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

import { commonStyles2 } from "../shared";
import { styles } from "./shared";

type DummyItem = { id: string; title: string; children: DummyItem[] | undefined };

const renderHorizontalDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div
    ref={injectedProps.ref}
    className={classnames(commonStyles2.dropLine, commonStyles2.horizontal)}
    style={injectedProps.style}
  />
);
const renderHorizontalGhostElement = ({ isGroup }: GhostRendererMeta<DummyItem["id"]>) => (
  <div className={classnames({ [styles.horizontalitem]: !isGroup, [styles.horizontalgroup]: isGroup }, styles.horizontalghost, styles.horizontalstatic)} />
);
const renderHorizontalPlaceholderElement = (
  injectedProps: PlaceholderRendererInjectedProps,
  { isGroup }: PlaceholderRendererMeta<DummyItem["id"]>,
) => (
  <div
    className={classnames({ [styles.horizontalitem]: !isGroup, [styles.horizontalgroup]: isGroup }, styles.horizontalplaceholder)}
    style={injectedProps.style}
  />
);
const renderHorizontalStackedGroupElement = (injectedProps: StackedGroupRendererInjectedProps) => (
  <div className={classnames(styles.horizontalgroup, styles.horizontalstacked)} style={injectedProps.style} />
);

export const StaticComponent = () => (
  <List
    className={styles.horizontalwrapper}
    renderDropLine={renderHorizontalDropLineElement}
    renderGhost={renderHorizontalGhostElement}
    renderPlaceholder={renderHorizontalPlaceholderElement}
    renderStackedGroup={renderHorizontalStackedGroupElement}
    direction="horizontal"
    onDragEnd={() => false}
  >
    <Item identifier="h2a" index={0}>
      <div className={styles.horizontalitem}>Item A</div>
    </Item>
    <Item identifier="h2b" index={1} isGroup>
      <div className={styles.horizontalgroup}>
        <div className={styles.horizontalheading}>Group B</div>
        <Item identifier="h2b-1" index={0}>
          <div className={styles.horizontalitem}>Item B - 1</div>
        </Item>
        <Item identifier="h2b-2" index={1} isGroup>
          <div className={styles.horizontalgroup}>
            <div className={styles.horizontalheading}>Group B - 2</div>
            <Item identifier="h2b-2-1" index={0}>
              <div className={styles.horizontalitem}>Item B - 2 - 1</div>
            </Item>
          </div>
        </Item>
        <Item identifier="h2b-3" index={2} isGroup>
          <div className={styles.horizontalgroup}>
            <div className={styles.horizontalheading}>Group B - 3</div>
          </div>
        </Item>
        <Item identifier="h2b-4" index={3}>
          <div className={styles.horizontalitem}>Item B - 4</div>
        </Item>
      </div>
    </Item>
    <Item identifier="h2c" index={2}>
      <div className={styles.horizontalitem}>Item C</div>
    </Item>
  </List>
);
