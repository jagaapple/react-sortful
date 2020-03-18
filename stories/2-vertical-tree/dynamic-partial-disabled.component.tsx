import * as React from "react";
import classnames from "classnames";
import arrayMove from "array-move";

import {
  DragEndMeta,
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  Item,
  List,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackedGroupRendererInjectedProps,
  StackedGroupRendererMeta,
} from "../../src";

import { commonStyles } from "../shared";
import { styles } from "./shared";

type DummyItem = { id: string; title: string; children: DummyItem[] | undefined };
type NormalizedDummyItem = Omit<DummyItem, "children"> & { children: DummyItem["id"][] | undefined };

const rootItemId = "d93cc42d-a57c-447a-a527-1655388b9dc6";
const initialItemEntitiesMap = new Map<DummyItem["id"], NormalizedDummyItem>([
  [
    rootItemId,
    {
      id: rootItemId,
      title: "",
      children: ["d11a3412-c7cd-438b-8a93-121d724dde8b", "37e73dcc-53b1-423a-9574-c78942c60a0f"],
    },
  ],
  [
    "d11a3412-c7cd-438b-8a93-121d724dde8b",
    {
      id: "d11a3412-c7cd-438b-8a93-121d724dde8b",
      title: "Macintosh HD",
      children: [
        "23e03875-675e-45a7-b62a-3d444269ccdf",
        "7eebbba8-c485-42b4-9df9-2057caddce6d",
        "5178aae3-0eab-459d-a921-d3d02e95760e",
      ],
    },
  ],
  ["23e03875-675e-45a7-b62a-3d444269ccdf", { id: "23e03875-675e-45a7-b62a-3d444269ccdf", title: "Library", children: [] }],
  ["7eebbba8-c485-42b4-9df9-2057caddce6d", { id: "7eebbba8-c485-42b4-9df9-2057caddce6d", title: "System", children: [] }],
  [
    "5178aae3-0eab-459d-a921-d3d02e95760e",
    {
      id: "5178aae3-0eab-459d-a921-d3d02e95760e",
      title: "Users",
      children: ["0838980f-672c-4f24-b583-2fced2a60302", "0f9f3bec-69a9-48e2-bac7-56c1607b878c"],
    },
  ],
  [
    "0838980f-672c-4f24-b583-2fced2a60302",
    {
      id: "0838980f-672c-4f24-b583-2fced2a60302",
      title: "jagaapple",
      children: [
        "affbd250-36a4-4a2b-a7b0-cdc64e03db8b",
        "868eb97c-7970-45e5-bec1-8eb626d7b0b9",
        "258be242-8493-4cb5-bf9e-35778aa3ad69",
      ],
    },
  ],
  [
    "affbd250-36a4-4a2b-a7b0-cdc64e03db8b",
    {
      id: "affbd250-36a4-4a2b-a7b0-cdc64e03db8b",
      title: "Desktop",
      children: [
        "dbede9cd-ac22-4f62-b6bc-23ed2c6f88c8",
        "6725369f-d929-4fa9-a955-704486824a30",
        "e353fca1-0ca7-4f1a-9292-bc90a3b1a5e7",
      ],
    },
  ],
  [
    "dbede9cd-ac22-4f62-b6bc-23ed2c6f88c8",
    { id: "dbede9cd-ac22-4f62-b6bc-23ed2c6f88c8", title: "dummy-1.txt", children: undefined },
  ],
  [
    "6725369f-d929-4fa9-a955-704486824a30",
    { id: "6725369f-d929-4fa9-a955-704486824a30", title: "dummy-2.txt", children: undefined },
  ],
  [
    "e353fca1-0ca7-4f1a-9292-bc90a3b1a5e7",
    { id: "e353fca1-0ca7-4f1a-9292-bc90a3b1a5e7", title: "dummy-3.txt", children: undefined },
  ],
  ["868eb97c-7970-45e5-bec1-8eb626d7b0b9", { id: "868eb97c-7970-45e5-bec1-8eb626d7b0b9", title: "Documents", children: [] }],
  [
    "258be242-8493-4cb5-bf9e-35778aa3ad69",
    {
      id: "258be242-8493-4cb5-bf9e-35778aa3ad69",
      title: "Pictures",
      children: [
        "706215a1-4e8a-4f85-8ca3-adad5b17abb9",
        "324474cd-7430-4f21-b97f-9565e264540c",
        "64cfd25f-3e8b-4169-a329-d8d79352be7b",
      ],
    },
  ],
  [
    "706215a1-4e8a-4f85-8ca3-adad5b17abb9",
    { id: "706215a1-4e8a-4f85-8ca3-adad5b17abb9", title: "photo-1.jpg", children: undefined },
  ],
  [
    "324474cd-7430-4f21-b97f-9565e264540c",
    { id: "324474cd-7430-4f21-b97f-9565e264540c", title: "photo-2.jpg", children: undefined },
  ],
  [
    "64cfd25f-3e8b-4169-a329-d8d79352be7b",
    { id: "64cfd25f-3e8b-4169-a329-d8d79352be7b", title: "photo-3.jpg", children: undefined },
  ],
  [
    "0f9f3bec-69a9-48e2-bac7-56c1607b878c",
    {
      id: "0f9f3bec-69a9-48e2-bac7-56c1607b878c",
      title: "pineapple",
      children: ["778d414f-3d3a-42d2-8643-d557286a16b6", "dce4d345-81ab-4c0f-9ca1-11e5ec5fe44c"],
    },
  ],
  [
    "778d414f-3d3a-42d2-8643-d557286a16b6",
    {
      id: "778d414f-3d3a-42d2-8643-d557286a16b6",
      title: "Documents",
      children: ["7a16103d-13e5-4269-a4ac-87f630484a5f", "be702972-f4e9-43f9-ac69-5ebdeff7efc4"],
    },
  ],
  ["7a16103d-13e5-4269-a4ac-87f630484a5f", { id: "7a16103d-13e5-4269-a4ac-87f630484a5f", title: "pages", children: [] }],
  [
    "be702972-f4e9-43f9-ac69-5ebdeff7efc4",
    { id: "be702972-f4e9-43f9-ac69-5ebdeff7efc4", title: "sample.numbers", children: undefined },
  ],
  [
    "dce4d345-81ab-4c0f-9ca1-11e5ec5fe44c",
    {
      id: "dce4d345-81ab-4c0f-9ca1-11e5ec5fe44c",
      title: "Pictures",
      children: ["f5780287-7e72-492d-9176-ab097fe90343", "fa25d843-afa4-4621-b2a0-d9e4151bf6b8"],
    },
  ],
  [
    "f5780287-7e72-492d-9176-ab097fe90343",
    { id: "f5780287-7e72-492d-9176-ab097fe90343", title: "photo-1.png", children: undefined },
  ],
  [
    "fa25d843-afa4-4621-b2a0-d9e4151bf6b8",
    { id: "fa25d843-afa4-4621-b2a0-d9e4151bf6b8", title: "photo-2.png", children: undefined },
  ],
  ["37e73dcc-53b1-423a-9574-c78942c60a0f", { id: "37e73dcc-53b1-423a-9574-c78942c60a0f", title: "Network", children: [] }],
]);
const disabledItemIds = [
  "7eebbba8-c485-42b4-9df9-2057caddce6d",
  "6725369f-d929-4fa9-a955-704486824a30",
  "e353fca1-0ca7-4f1a-9292-bc90a3b1a5e7",
  "0f9f3bec-69a9-48e2-bac7-56c1607b878c",
];
const groupHeadingClassname = classnames(styles.heading, styles.withIcon);
const itemClassName = classnames(styles.item, styles.withIcon);

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={commonStyles.dropLine} style={injectedProps.style} />
);

type Props = {
  isDisabled?: boolean;
};

export const DynamicPartialDisabledComponent = (props: Props) => {
  const [itemEntitiesMapState, setItemEntitiesMapState] = React.useState(initialItemEntitiesMap);

  const itemElements = React.useMemo(() => {
    const topLevelNormalizedItems = itemEntitiesMapState
      .get(rootItemId)!
      .children!.map((itemId) => itemEntitiesMapState.get(itemId)!);
    const createItemElement = (normalizedItem: NormalizedDummyItem, index: number) => {
      const isDisabled = disabledItemIds.includes(normalizedItem.id);
      if (normalizedItem.children != undefined) {
        const childNormalizedItems = normalizedItem.children.map((itemId) => itemEntitiesMapState.get(itemId)!);
        const childItemElements = childNormalizedItems.map(createItemElement);
        const hasItems = childItemElements.length > 0;

        return (
          <Item
            key={normalizedItem.id}
            className={styles.group}
            identifier={normalizedItem.id}
            index={index}
            isDisabled={isDisabled}
            isGroup
          >
            <div className={classnames(groupHeadingClassname, { [styles.opened]: hasItems, [styles.locked]: isDisabled })}>
              {normalizedItem.title}
            </div>
            {childItemElements}
          </Item>
        );
      }

      return (
        <Item
          key={normalizedItem.id}
          className={classnames(itemClassName, { [styles.locked]: isDisabled })}
          identifier={normalizedItem.id}
          index={index}
          isDisabled={isDisabled}
        >
          {normalizedItem.title}
        </Item>
      );
    };

    return topLevelNormalizedItems.map(createItemElement);
  }, [itemEntitiesMapState]);
  const renderGhostElement = React.useCallback(
    ({ identifier, isGroup }: GhostRendererMeta<DummyItem["id"]>) => {
      const normalizedItem = itemEntitiesMapState.get(identifier);
      if (normalizedItem == undefined) return;

      if (isGroup) {
        return (
          <div className={classnames(styles.group, styles.ghost)}>
            <div className={groupHeadingClassname}>{normalizedItem.title}</div>
          </div>
        );
      }

      return <div className={classnames(itemClassName, styles.ghost)}>{normalizedItem.title}</div>;
    },
    [itemEntitiesMapState],
  );
  const renderPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps, { identifier, isGroup }: PlaceholderRendererMeta<DummyItem["id"]>) => {
      const normalizedItem = itemEntitiesMapState.get(identifier)!;
      const className = classnames({ [styles.group]: isGroup, [itemClassName]: !isGroup }, styles.dragging);
      const children = isGroup ? <div className={groupHeadingClassname}>{normalizedItem.title}</div> : normalizedItem.title;

      return (
        <div {...injectedProps.binder()} className={className} style={injectedProps.style}>
          {children}
        </div>
      );
    },
    [itemEntitiesMapState],
  );
  const renderStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps, { identifier }: StackedGroupRendererMeta<DummyItem["id"]>) => {
      const normalizedItem = itemEntitiesMapState.get(identifier)!;

      return (
        <div {...injectedProps.binder()} className={classnames(styles.group, styles.stacked)} style={injectedProps.style}>
          <div className={groupHeadingClassname}>{normalizedItem.title}</div>
        </div>
      );
    },
    [],
  );

  const onDragEnd = React.useCallback(
    (meta: DragEndMeta<DummyItem["id"]>) => {
      if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return;

      const newMap = new Map(itemEntitiesMapState.entries());
      const normalizedItem = newMap.get(meta.identifier);
      if (normalizedItem == undefined) return;
      const normalizedGroupItem = newMap.get(meta.groupIdentifier ?? rootItemId);
      if (normalizedGroupItem == undefined) return;
      if (normalizedGroupItem.children == undefined) return;

      if (meta.groupIdentifier === meta.nextGroupIdentifier) {
        const nextIndex = meta.nextIndex ?? normalizedGroupItem.children?.length ?? 0;
        normalizedGroupItem.children = arrayMove(normalizedGroupItem.children, meta.index, nextIndex);
      } else {
        const nextNormalizedGroupItem = newMap.get(meta.nextGroupIdentifier ?? rootItemId);
        if (nextNormalizedGroupItem == undefined) return;
        if (nextNormalizedGroupItem.children == undefined) return;

        normalizedGroupItem.children.splice(meta.index, 1);
        if (meta.nextIndex == undefined) {
          // Inserts an item to a group which has no items.
          nextNormalizedGroupItem.children.push(meta.identifier);
        } else {
          // Insets an item to a group.
          nextNormalizedGroupItem.children.splice(meta.nextIndex, 0, normalizedItem.id);
        }
      }

      setItemEntitiesMapState(newMap);
    },
    [itemEntitiesMapState],
  );

  return (
    <List
      className={classnames(styles.wrapper, { [styles.disabled]: props.isDisabled })}
      renderDropLine={renderDropLineElement}
      renderGhost={renderGhostElement}
      renderPlaceholder={renderPlaceholderElement}
      renderStackedGroup={renderStackedGroupElement}
      itemSpacing={2}
      isDisabled={props.isDisabled}
      onDragEnd={onDragEnd}
    >
      {itemElements}
    </List>
  );
};
