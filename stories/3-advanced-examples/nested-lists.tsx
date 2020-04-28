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
import styles from "./nested-lists.css";

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

const renderHorizontalDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div
    ref={injectedProps.ref}
    className={classnames(commonStyles.dropLine, commonStyles.horizontal)}
    style={injectedProps.style}
  />
);
const renderHorizontalGhostElement = () => (
  <div className={classnames(styles.horizontalitem, styles.horizontalghost, styles.horizontalstatic)} />
);
const renderHorizontalPlaceholderElement = (injectedProps: PlaceholderRendererInjectedProps) => (
  <div
    className={classnames(styles.horizontalitem, styles.horizontalplaceholder, styles.horizontalstatic)}
    style={injectedProps.style}
  />
);
const renderHorizontalStackedGroupElement = (injectedProps: StackedGroupRendererInjectedProps) => (
  <div className={classnames(styles.horizontalgroup, styles.horizontalstacked)} style={injectedProps.style} />
);

export const NestedListsComponent = () => (
  <List
    identifier="list1"
    className={styles.wrapper}
    renderDropLine={renderDropLineElement}
    renderGhost={renderGhostElement}
    renderPlaceholder={renderPlaceholderElement}
    renderStackedGroup={renderStackedGroupElement}
    onDragEnd={(meta) => console.log("list1 completed drag: ", meta)}
  >
    <Item identifier="a" index={0}>
      <List
        identifier="list2"
        className={styles.horizontalwrapper}
        renderDropLine={renderHorizontalDropLineElement}
        renderGhost={renderHorizontalGhostElement}
        renderPlaceholder={renderHorizontalPlaceholderElement}
        direction="horizontal"
        onDragEnd={(meta) => console.log("list2 completed drag: ", meta)}
      >
        <Item identifier="ha1" index={0}>
          <div className={styles.horizontalitem}>Item ha1</div>
        </Item>
        <Item identifier="hb1" index={1}>
          <div className={styles.horizontalitem}>Item hb1</div>
        </Item>
        <Item identifier="hc1" index={2}>
          <div className={styles.horizontalitem}>Item hc1</div>
        </Item>
        <Item identifier="hd1" index={3}>
          <div className={styles.horizontalitem}>Item hd1</div>
        </Item>
        <Item identifier="he1" index={4}>
          <div className={styles.horizontalitem}>Item he1</div>
        </Item>
      </List>
    </Item>
    <Item identifier="b" index={1}>
      <div className={styles.item}>Item b</div>
    </Item>
    <Item identifier="c" index={2}>
      <div className={styles.item}>Item c</div>
    </Item>
    <Item identifier="d" index={3}>
      <List
        identifier="list3"
        className={styles.horizontalwrapper}
        renderDropLine={renderHorizontalDropLineElement}
        renderGhost={renderHorizontalGhostElement}
        renderPlaceholder={renderHorizontalPlaceholderElement}
        renderStackedGroup={renderHorizontalStackedGroupElement}
        direction="horizontal"
        onDragEnd={(meta) => console.log("list3 completed drag: ", meta)}
      >
        <Item identifier="h2a" index={0}>
          <div className={styles.horizontalitem}>Item h2a</div>
        </Item>
        <Item identifier="h2b" index={1} isGroup>
          <div className={styles.horizontalgroup}>
            <div className={styles.horizontalheading}>Group h2b</div>
            <List
              identifier="list4"
              className={styles.wrapper}
              renderDropLine={renderDropLineElement}
              renderGhost={renderGhostElement}
              renderPlaceholder={renderPlaceholderElement}
              renderStackedGroup={renderStackedGroupElement}
              onDragEnd={(meta) => console.log("list4 completed drag: ", meta)}
            >
              <Item identifier="ne-1" index={0}>
                <div className={styles.item}>Item ne-1</div>
              </Item>
              <Item identifier="ne-2" index={1}>
                <div className={styles.item}>Item ne-2</div>
              </Item>
              <Item identifier="ne-3" index={2}>
                <div className={styles.item}>Item ne-3</div>
              </Item>
              <Item identifier="ne-4" index={3}>
                <div className={styles.item}>Item ne-4</div>
              </Item>
            </List>
            <Item identifier="h2b-2" index={1} isGroup>
              <div className={styles.horizontalgroup}>
                <div className={styles.horizontalheading}>Group h2b-2</div>
                <Item identifier="h2b-2-1" index={0}>
                  <div className={styles.horizontalitem}>Item h2b-2-1</div>
                </Item>
              </div>
            </Item>
            <Item identifier="h2b-3" index={2} isGroup>
              <div className={styles.horizontalgroup}>
                <div className={styles.horizontalheading}>Group h2b-3</div>
              </div>
            </Item>
            <Item identifier="h2b-4" index={3}>
              <div className={styles.horizontalitem}>Item h2b-4</div>
            </Item>
          </div>
        </Item>
        <Item identifier="h2c" index={2}>
          <div className={styles.horizontalitem}>Item h2c</div>
        </Item>
      </List>
    </Item>
    <Item identifier="e" index={4} isGroup>
      <div className={styles.group}>
        <div className={styles.heading}>Group e</div>
        <Item identifier="e-1" index={0}>
          <div className={styles.item}>Item e-1</div>
        </Item>
        <Item identifier="e-2" index={1}>
          <div className={styles.item}>Item e-2</div>
        </Item>
        <Item identifier="e-3" index={2}>
          <div className={styles.item}>Item e-3</div>
        </Item>
        <Item identifier="e-4" index={3}>
          <div className={styles.item}>Item e-4</div>
        </Item>
        <Item identifier="e-5" index={4} isGroup>
          <div className={styles.group}>
            <div className={styles.heading}>Group e-5</div>
            <Item identifier="e-5-1" index={0}>
              <div className={styles.item}>Item e-5-1</div>
            </Item>
          </div>
        </Item>
        <Item identifier="e-6" index={4} isGroup>
          <div className={styles.group}>
            <div className={styles.heading}>Group e-6</div>
          </div>
        </Item>
        <Item identifier="e-7" index={5}>
          <div className={styles.item}>Item e-7</div>
        </Item>
      </div>
    </Item>
    <Item identifier="f" index={5}>
      <div className={styles.item}>Item f</div>
    </Item>
  </List>
);
