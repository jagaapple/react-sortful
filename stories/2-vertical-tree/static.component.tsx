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

const groupHeadingClassname = classnames(styles.heading, styles.withIcon);
const itemClassName = classnames(styles.item, styles.withIcon);

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={commonStyles.dropLine} style={injectedProps.style} />
);
const renderGhostElement = ({ isGroup }: GhostRendererMeta<DummyItem["id"]>) => {
  const className = classnames(
    { [itemClassName]: !isGroup, [styles.group]: isGroup },
    styles.ghost,
    styles.static,
    styles.withIcon,
  );
  const children = isGroup ? <div className={groupHeadingClassname} /> : undefined;

  return <div className={className}>{children}</div>;
};
const renderPlaceholderElement = (
  injectedProps: PlaceholderRendererInjectedProps,
  { isGroup }: PlaceholderRendererMeta<DummyItem["id"]>,
) => {
  const children = isGroup ? <div className={groupHeadingClassname} /> : undefined;

  return (
    <div
      {...injectedProps.binder()}
      className={classnames({ [itemClassName]: !isGroup, [styles.group]: isGroup }, styles.dragging)}
      style={injectedProps.style}
    >
      {children}
    </div>
  );
};
const renderStackedGroupElement = (injectedProps: StackedGroupRendererInjectedProps) => (
  <div {...injectedProps.binder()} className={classnames(styles.group, styles.stacked)} style={injectedProps.style}>
    <div className={groupHeadingClassname} />
  </div>
);

export const StaticComponent = () => (
  <List
    className={styles.wrapper}
    renderDropLine={renderDropLineElement}
    renderGhost={renderGhostElement}
    renderPlaceholder={renderPlaceholderElement}
    renderStackedGroup={renderStackedGroupElement}
    itemSpacing={2}
    onDragEnd={() => false}
  >
    <Item className={styles.group} identifier="d11a3412-c7cd-438b-8a93-121d724dde8b" index={0} isGroup>
      <div className={classnames(groupHeadingClassname, styles.opened)}>Macintosh HD</div>
      <Item className={styles.group} identifier="23e03875-675e-45a7-b62a-3d444269ccdf" index={0} isGroup>
        <div className={groupHeadingClassname}>Library</div>
      </Item>
      <Item className={styles.group} identifier="7eebbba8-c485-42b4-9df9-2057caddce6d" index={1} isGroup>
        <div className={groupHeadingClassname}>System</div>
      </Item>
      <Item className={styles.group} identifier="5178aae3-0eab-459d-a921-d3d02e95760e" index={2} isGroup>
        <div className={classnames(groupHeadingClassname, styles.opened)}>Users</div>
        <Item className={styles.group} identifier="0838980f-672c-4f24-b583-2fced2a60302" index={0} isGroup>
          <div className={classnames(groupHeadingClassname, styles.opened)}>jagaapple</div>
          <Item className={styles.group} identifier="affbd250-36a4-4a2b-a7b0-cdc64e03db8b" index={0} isGroup>
            <div className={classnames(groupHeadingClassname, styles.opened)}>Desktop</div>
            <Item className={itemClassName} identifier="dbede9cd-ac22-4f62-b6bc-23ed2c6f88c8" index={0}>
              dummy-1.txt
            </Item>
            <Item className={itemClassName} identifier="6725369f-d929-4fa9-a955-704486824a30" index={1}>
              dummy-2.txt
            </Item>
            <Item className={itemClassName} identifier="e353fca1-0ca7-4f1a-9292-bc90a3b1a5e7" index={2}>
              dummy-3.txt
            </Item>
          </Item>
          <Item className={styles.group} identifier="868eb97c-7970-45e5-bec1-8eb626d7b0b9" index={1} isGroup>
            <div className={groupHeadingClassname}>Documents</div>
          </Item>
          <Item className={styles.group} identifier="258be242-8493-4cb5-bf9e-35778aa3ad69" index={2} isGroup>
            <div className={classnames(groupHeadingClassname, styles.opened)}>Pictures</div>
            <Item className={itemClassName} identifier="706215a1-4e8a-4f85-8ca3-adad5b17abb9" index={0}>
              photo-1.jpg
            </Item>
            <Item className={itemClassName} identifier="324474cd-7430-4f21-b97f-9565e264540c" index={1}>
              photo-2.jpg
            </Item>
            <Item className={itemClassName} identifier="64cfd25f-3e8b-4169-a329-d8d79352be7b" index={2}>
              photo-3.jpg
            </Item>
          </Item>
        </Item>
        <Item className={styles.group} identifier="0f9f3bec-69a9-48e2-bac7-56c1607b878c" index={3} isGroup>
          <div className={classnames(groupHeadingClassname, styles.opened)}>pineapple</div>
          <Item className={styles.group} identifier="778d414f-3d3a-42d2-8643-d557286a16b6" index={0} isGroup>
            <div className={classnames(groupHeadingClassname, styles.opened)}>Documents</div>
            <Item className={styles.group} identifier="7a16103d-13e5-4269-a4ac-87f630484a5f" index={0} isGroup>
              <div className={groupHeadingClassname}>pages</div>
            </Item>
            <Item className={itemClassName} identifier="be702972-f4e9-43f9-ac69-5ebdeff7efc4" index={1}>
              sample.numbers
            </Item>
          </Item>
          <Item className={styles.group} identifier="dce4d345-81ab-4c0f-9ca1-11e5ec5fe44c" index={1} isGroup>
            <div className={classnames(groupHeadingClassname, styles.opened)}>Pictures</div>
            <Item className={itemClassName} identifier="f5780287-7e72-492d-9176-ab097fe90343" index={0}>
              photo-1.png
            </Item>
            <Item className={itemClassName} identifier="fa25d843-afa4-4621-b2a0-d9e4151bf6b8" index={1}>
              photo-2.png
            </Item>
          </Item>
        </Item>
      </Item>
    </Item>
    <Item className={styles.group} identifier="37e73dcc-53b1-423a-9574-c78942c60a0f" index={1} isGroup>
      <div className={groupHeadingClassname}>Network</div>
    </Item>
  </List>
);
