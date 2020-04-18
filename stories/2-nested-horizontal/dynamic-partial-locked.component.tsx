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

type DummyItem = { id: string; title: string; children: DummyItem["id"][] | undefined };

const rootItemId = "root";
const initialItemEntitiesMap = new Map<DummyItem["id"], DummyItem>([
  [rootItemId, { id: rootItemId, title: "", children: ["a", "b", "c"] }],
  ["a", { id: "a", title: "Item A", children: undefined }],
  ["b", { id: "b", title: "Group B", children: ["b-1", "b-2", "b-3", "b-4"] }],
  ["b-1", { id: "b-1", title: "Item B - 1", children: undefined }],
  ["b-2", { id: "b-2", title: "Group B - 2", children: ["b-2-1"] }],
  ["b-2-1", { id: "b-2-1", title: "Item B - 2 - 1", children: undefined }],
  ["b-3", { id: "b-3", title: "Group B - 3", children: [] }],
  ["b-4", { id: "b-4", title: "Item B - 4", children: undefined }],
  ["c", { id: "c", title: "Item C", children: undefined }],
]);
const lockedItemIds = ["a", "b-2"];

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div
    ref={injectedProps.ref}
    className={classnames(commonStyles.dropLine, commonStyles.horizontal)}
    style={injectedProps.style}
  />
);

export const DynamicPartialLockedComponent = () => {
  const [itemEntitiesMapState, setItemEntitiesMapState] = React.useState(initialItemEntitiesMap);

  const itemElements = React.useMemo(() => {
    const topLevelItems = itemEntitiesMapState.get(rootItemId)!.children!.map((itemId) => itemEntitiesMapState.get(itemId)!);
    const createItemElement = (item: DummyItem, index: number) => {
      const isLocked = lockedItemIds.includes(item.id);
      if (item.children != undefined) {
        const childItems = item.children.map((itemId) => itemEntitiesMapState.get(itemId)!);
        const childItemElements = childItems.map(createItemElement);

        return (
          <Item key={item.id} identifier={item.id} index={index} isLocked={isLocked} isGroup>
            <div className={styles.group}>
              <div className={classnames(styles.heading, { [styles.locked]: isLocked })}>{item.title}</div>
              {childItemElements}
            </div>
          </Item>
        );
      }

      return (
        <Item key={item.id} identifier={item.id} index={index} isLocked={isLocked}>
          <div className={classnames(styles.item, { [styles.locked]: isLocked })}>{item.title}</div>
        </Item>
      );
    };

    return topLevelItems.map(createItemElement);
  }, [itemEntitiesMapState]);
  const renderGhostElement = React.useCallback(
    ({ identifier, isGroup }: GhostRendererMeta<DummyItem["id"]>) => {
      const item = itemEntitiesMapState.get(identifier);
      if (item == undefined) return;

      if (isGroup) {
        return (
          <div className={classnames(styles.group, styles.ghost)}>
            <div className={styles.heading}>{item.title}</div>
          </div>
        );
      }

      return <div className={classnames(styles.item, styles.ghost)}>{item.title}</div>;
    },
    [itemEntitiesMapState],
  );
  const renderPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps, { identifier, isGroup }: PlaceholderRendererMeta<DummyItem["id"]>) => {
      const item = itemEntitiesMapState.get(identifier)!;
      const className = classnames({ [styles.group]: isGroup, [styles.item]: !isGroup }, styles.placeholder);
      const children = isGroup ? <div className={styles.heading}>{item.title}</div> : item.title;

      return (
        <div className={className} style={injectedProps.style}>
          {children}
        </div>
      );
    },
    [itemEntitiesMapState],
  );
  const renderStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps, { identifier }: StackedGroupRendererMeta<DummyItem["id"]>) => {
      const item = itemEntitiesMapState.get(identifier)!;

      return (
        <div className={classnames(styles.group, styles.stacked)} style={injectedProps.style}>
          <div className={styles.heading}>{item.title}</div>
        </div>
      );
    },
    [itemEntitiesMapState],
  );

  const onDragEnd = React.useCallback(
    (meta: DragEndMeta<DummyItem["id"]>) => {
      if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return;

      const newMap = new Map(itemEntitiesMapState.entries());
      const item = newMap.get(meta.identifier);
      if (item == undefined) return;
      const groupItem = newMap.get(meta.groupIdentifier ?? rootItemId);
      if (groupItem == undefined) return;
      if (groupItem.children == undefined) return;

      if (meta.groupIdentifier === meta.nextGroupIdentifier) {
        const nextIndex = meta.nextIndex ?? groupItem.children?.length ?? 0;
        groupItem.children = arrayMove(groupItem.children, meta.index, nextIndex);
      } else {
        const nextGroupItem = newMap.get(meta.nextGroupIdentifier ?? rootItemId);
        if (nextGroupItem == undefined) return;
        if (nextGroupItem.children == undefined) return;

        groupItem.children.splice(meta.index, 1);
        if (meta.nextIndex == undefined) {
          // Inserts an item to a group which has no items.
          nextGroupItem.children.push(meta.identifier);
        } else {
          // Insets an item to a group.
          nextGroupItem.children.splice(meta.nextIndex, 0, item.id);
        }
      }

      setItemEntitiesMapState(newMap);
    },
    [itemEntitiesMapState],
  );

  return (
    <List
      className={styles.wrapper}
      renderDropLine={renderDropLineElement}
      renderGhost={renderGhostElement}
      renderPlaceholder={renderPlaceholderElement}
      renderStackedGroup={renderStackedGroupElement}
      direction="horizontal"
      onDragEnd={onDragEnd}
    >
      {itemElements}
    </List>
  );
};
