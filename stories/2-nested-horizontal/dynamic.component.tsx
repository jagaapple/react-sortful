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

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div
    ref={injectedProps.ref}
    className={classnames(commonStyles.dropLine, commonStyles.horizontal)}
    style={injectedProps.style}
  />
);

type Props = {
  isDisabled?: boolean;
};

export const DynamicComponent = (props: Props) => {
  const [itemEntitiesMapState, setItemEntitiesMapState] = React.useState(initialItemEntitiesMap);

  const itemElements = React.useMemo(() => {
    const topLevelNormalizedItems = itemEntitiesMapState
      .get(rootItemId)!
      .children!.map((itemId) => itemEntitiesMapState.get(itemId)!);
    const createItemElement = (normalizedItem: NormalizedDummyItem, index: number) => {
      if (normalizedItem.children != undefined) {
        const childNormalizedItems = normalizedItem.children.map((itemId) => itemEntitiesMapState.get(itemId)!);
        const childItemElements = childNormalizedItems.map(createItemElement);

        return (
          <Item key={normalizedItem.id} identifier={normalizedItem.id} index={index} isGroup>
            <div className={styles.group}>
              <div className={styles.heading}>{normalizedItem.title}</div>
              {childItemElements}
            </div>
          </Item>
        );
      }

      return (
        <Item key={normalizedItem.id} identifier={normalizedItem.id} index={index}>
          <div className={styles.item}>{normalizedItem.title}</div>
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

      return (
        <div {...injectedProps.binder()} className={classnames(styles.group, styles.stacked)} style={injectedProps.style}>
          <div className={styles.heading}>{normalizedItem.title}</div>
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
      className={classnames(styles.wrapper, { [styles.disabled]: props.isDisabled })}
      renderDropLine={renderDropLineElement}
      renderGhost={renderGhostElement}
      renderPlaceholder={renderPlaceholderElement}
      renderStackedGroup={renderStackedGroupElement}
      direction="horizontal"
      isDisabled={props.isDisabled}
      onDragEnd={onDragEnd}
    >
      {itemElements}
    </List>
  );
};
