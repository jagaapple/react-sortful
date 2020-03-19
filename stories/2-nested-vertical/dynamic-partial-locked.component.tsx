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

const rootItemId = "root";
const initialItemEntitiesMap = new Map<DummyItem["id"], NormalizedDummyItem>([
  [rootItemId, { id: rootItemId, title: "", children: ["a", "b", "c", "d", "e", "f"] }],
  ["a", { id: "a", title: "Item A", children: undefined }],
  ["b", { id: "b", title: "Item B", children: undefined }],
  ["c", { id: "c", title: "Item C", children: undefined }],
  ["d", { id: "d", title: "Item D", children: undefined }],
  ["e", { id: "e", title: "Group E", children: ["e-1", "e-2", "e-3", "e-4", "e-5", "e-6", "e-7"] }],
  ["e-1", { id: "e-1", title: "Item E - 1", children: undefined }],
  ["e-2", { id: "e-2", title: "Item E - 2", children: undefined }],
  ["e-3", { id: "e-3", title: "Item E - 3", children: undefined }],
  ["e-4", { id: "e-4", title: "Item E - 4", children: undefined }],
  ["e-5", { id: "e-5", title: "Group E - 5", children: ["e-5-1"] }],
  ["e-5-1", { id: "e-5-1", title: "Item E - 5 - 1", children: undefined }],
  ["e-6", { id: "e-6", title: "Group E - 6", children: [] }],
  ["e-7", { id: "e-7", title: "Item E - 7", children: undefined }],
  ["f", { id: "f", title: "Item F", children: undefined }],
]);
const lockedItemIds = ["b", "c", "e-2", "e-3", "e-5"];

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={commonStyles.dropLine} style={injectedProps.style} />
);

export const DynamicPartialLockedComponent = () => {
  const [itemEntitiesMapState, setItemEntitiesMapState] = React.useState(initialItemEntitiesMap);

  const itemElements = React.useMemo(() => {
    const topLevelNormalizedItems = itemEntitiesMapState
      .get(rootItemId)!
      .children!.map((itemId) => itemEntitiesMapState.get(itemId)!);
    const createItemElement = (normalizedItem: NormalizedDummyItem, index: number) => {
      const isLocked = lockedItemIds.includes(normalizedItem.id);
      if (normalizedItem.children != undefined) {
        const childNormalizedItems = normalizedItem.children.map((itemId) => itemEntitiesMapState.get(itemId)!);
        const childItemElements = childNormalizedItems.map(createItemElement);

        return (
          <Item key={normalizedItem.id} identifier={normalizedItem.id} index={index} isLocked={isLocked} isGroup>
            <div className={styles.group}>
              <div className={classnames(styles.heading, { [styles.locked]: isLocked })}>{normalizedItem.title}</div>
              {childItemElements}
            </div>
          </Item>
        );
      }

      return (
        <Item key={normalizedItem.id} identifier={normalizedItem.id} index={index} isLocked={isLocked}>
          <div className={classnames(styles.item, { [styles.locked]: isLocked })}>{normalizedItem.title}</div>
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
            <div className={styles.heading}>{normalizedItem.title}</div>
          </div>
        );
      }

      return <div className={classnames(styles.item, styles.ghost)}>{normalizedItem.title}</div>;
    },
    [itemEntitiesMapState],
  );
  const renderPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps, { identifier, isGroup }: PlaceholderRendererMeta<DummyItem["id"]>) => {
      const normalizedItem = itemEntitiesMapState.get(identifier)!;
      const className = classnames({ [styles.group]: isGroup, [styles.item]: !isGroup }, styles.dragging);
      const children = isGroup ? <div className={styles.heading}>{normalizedItem.title}</div> : normalizedItem.title;

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
      const isLocked = lockedItemIds.includes(normalizedItem.id);

      return (
        <div {...injectedProps.binder()} className={classnames(styles.group, styles.stacked)} style={injectedProps.style}>
          <div className={classnames(styles.heading, { [styles.locked]: isLocked })}>{normalizedItem.title}</div>
        </div>
      );
    },
    [itemEntitiesMapState],
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
      className={styles.wrapper}
      renderDropLine={renderDropLineElement}
      renderGhost={renderGhostElement}
      renderPlaceholder={renderPlaceholderElement}
      renderStackedGroup={renderStackedGroupElement}
      onDragEnd={onDragEnd}
    >
      {itemElements}
    </List>
  );
};
