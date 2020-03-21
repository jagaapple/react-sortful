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

import styles from "./kanban.css";

type DummyItem = { id: string; title: string; children?: DummyItem["id"][] };

const leftRootItemId = "left-root";
const centerRootItemId = "center-root";
const rightRootItemId = "right-root";
const initialItemEntitiesMap = new Map<DummyItem["id"], DummyItem>([
  [
    leftRootItemId,
    {
      id: leftRootItemId,
      title: "TODO",
      children: ["left-a", "left-b", "left-c", "left-d", "left-e"],
    },
  ],
  ["left-a", { id: "left-a", title: "Left Item A" }],
  ["left-b", { id: "left-b", title: "Left Item B" }],
  ["left-c", { id: "left-c", title: "Left Item C" }],
  ["left-d", { id: "left-d", title: "Left Item D" }],
  ["left-e", { id: "left-e", title: "Left Item E" }],
  [
    centerRootItemId,
    {
      id: centerRootItemId,
      title: "Doing",
      children: ["center-a", "center-b", "center-c", "center-d", "center-e"],
    },
  ],
  ["center-a", { id: "center-a", title: "Center Item A" }],
  ["center-b", { id: "center-b", title: "Center Item B" }],
  ["center-c", { id: "center-c", title: "Center Item C" }],
  ["center-d", { id: "center-d", title: "Center Item D" }],
  ["center-e", { id: "center-e", title: "Center Item E" }],
  [
    rightRootItemId,
    {
      id: rightRootItemId,
      title: "Done",
      children: ["right-a", "right-b", "right-c", "right-d", "right-e"],
    },
  ],
  ["right-a", { id: "right-a", title: "Right Item A" }],
  ["right-b", { id: "right-b", title: "Right Item B" }],
  ["right-c", { id: "right-c", title: "Right Item C" }],
  ["right-d", { id: "right-d", title: "Right Item D" }],
  ["right-e", { id: "right-e", title: "Right Item E" }],
]);

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={styles.dropLine} style={injectedProps.style} />
);

export const KanbanComponent = () => {
  const [itemEntitiesMapState, setItemEntitiesMapState] = React.useState(initialItemEntitiesMap);

  const createItemElements = React.useCallback(
    (items: DummyItem[]) =>
      items.map((item, index) => (
        <Item key={item.id} identifier={item.id} index={index}>
          <div className={styles.item}>{item.title}</div>
        </Item>
      )),
    [],
  );
  const leftItemElements = React.useMemo(() => {
    const leftItems = itemEntitiesMapState.get(leftRootItemId)!.children!.map((itemId) => itemEntitiesMapState.get(itemId)!);

    return createItemElements(leftItems);
  }, [itemEntitiesMapState, createItemElements]);
  const centerItemElements = React.useMemo(() => {
    const centerItems = itemEntitiesMapState
      .get(centerRootItemId)!
      .children!.map((itemId) => itemEntitiesMapState.get(itemId)!);

    return createItemElements(centerItems);
  }, [itemEntitiesMapState, createItemElements]);
  const rightItemElements = React.useMemo(() => {
    const rightItems = itemEntitiesMapState.get(rightRootItemId)!.children!.map((itemId) => itemEntitiesMapState.get(itemId)!);

    return createItemElements(rightItems);
  }, [itemEntitiesMapState, createItemElements]);
  const renderGhostElement = React.useCallback(
    ({ identifier }: GhostRendererMeta<DummyItem["id"]>) => {
      const item = itemEntitiesMapState.get(identifier)!;

      return <div className={classnames(styles.item, styles.ghost)}>{item.title}</div>;
    },
    [itemEntitiesMapState],
  );
  const renderPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps, { identifier }: PlaceholderRendererMeta<DummyItem["id"]>) => {
      const item = itemEntitiesMapState.get(identifier)!;

      return (
        <div className={classnames(styles.item, styles.placeholder)} style={injectedProps.style}>
          {item.title}
        </div>
      );
    },
    [itemEntitiesMapState],
  );
  const renderStackedGroupElement = React.useCallback(
    (injectedProps: StackedGroupRendererInjectedProps, { identifier }: StackedGroupRendererMeta<DummyItem["id"]>) => {
      const rootItem = itemEntitiesMapState.get(identifier)!;

      return (
        <div className={classnames(styles.group, styles.stacked)} style={injectedProps.style}>
          <div className={styles.heading}>{rootItem.title}</div>
        </div>
      );
    },
    [],
  );

  const onDragEnd = React.useCallback((meta: DragEndMeta<DummyItem["id"]>) => {
    if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return;

    const newMap = new Map(itemEntitiesMapState.entries());
    const item = newMap.get(meta.identifier);
    if (item == undefined) return;
    const groupItem = newMap.get(meta.groupIdentifier!);
    if (groupItem == undefined) return;
    if (groupItem.children == undefined) return;

    if (meta.groupIdentifier === meta.nextGroupIdentifier) {
      const nextIndex = meta.nextIndex ?? groupItem.children.length;
      groupItem.children = arrayMove(groupItem.children, meta.index, nextIndex);
    } else {
      const nextGroupItem = newMap.get(meta.nextGroupIdentifier!);
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
  }, []);

  const leftRootItem = itemEntitiesMapState.get(leftRootItemId)!;
  const centerRootItem = itemEntitiesMapState.get(centerRootItemId)!;
  const rightRootItem = itemEntitiesMapState.get(rightRootItemId)!;

  return (
    <List
      className={styles.wrapper}
      renderDropLine={renderDropLineElement}
      renderGhost={renderGhostElement}
      renderPlaceholder={renderPlaceholderElement}
      renderStackedGroup={renderStackedGroupElement}
      draggingCursorStyle="grabbing"
      itemSpacing={10}
      onDragEnd={onDragEnd}
    >
      <Item identifier={leftRootItem.id} index={0} isLocked isGroup isLonely>
        <div className={styles.group}>
          <div className={styles.heading}>{leftRootItem.title}</div>
          <div className={styles.items}>{leftItemElements}</div>
        </div>
      </Item>

      <hr />

      <Item identifier={centerRootItem.id} index={1} isLocked isGroup isLonely>
        <div className={styles.group}>
          <div className={styles.heading}>{centerRootItem.title}</div>
          <div className={styles.items}>{centerItemElements}</div>
        </div>
      </Item>

      <hr />

      <Item identifier={rightRootItem.id} index={2} isLocked isGroup isLonely>
        <div className={styles.group}>
          <div className={styles.heading}>{rightRootItem.title}</div>
          <div className={styles.items}>{rightItemElements}</div>
        </div>
      </Item>
    </List>
  );
};
