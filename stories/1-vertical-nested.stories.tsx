import * as React from "react";
import { storiesOf } from "@storybook/react";
import classnames from "classnames";
import arrayMove from "array-move";

import { DragEndMeta, DragStartMeta, DropLineRendererInjectedProps, GhostRendererMeta, Item, List } from "../src";

import { commonStyles } from "./shared";
import styles from "./1-vertical-nested.stories.css";

type DummyItem = { id: string; title: string; children: DummyItem[] | undefined };
type NormalizedDummyItem = Omit<DummyItem, "children"> & { children: DummyItem["id"][] | undefined };

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={commonStyles.dropLine} style={injectedProps.style} />
);

storiesOf("1 Vertical Nested", module)
  .add("Static", () => {
    const renderGhostElement = React.useCallback(
      ({ isGroup }: GhostRendererMeta<DummyItem["id"]>) => (
        <div className={classnames({ [styles.item]: !isGroup, [styles.group]: isGroup }, styles.ghost, styles.static)} />
      ),
      [],
    );

    return (
      <List
        className={styles.wrapper}
        renderDropLine={renderDropLineElement}
        renderGhost={renderGhostElement}
        onDragEnd={() => false}
      >
        <Item className={styles.item} identifier="a" index={0}>
          Item A
        </Item>
        <Item className={styles.item} identifier="b" index={1}>
          Item B
        </Item>
        <Item className={styles.item} identifier="c" index={2}>
          Item C
        </Item>
        <Item className={styles.item} identifier="d" index={3}>
          Item D
        </Item>
        <Item className={styles.group} identifier="e" index={4} isGroup>
          <div className={styles.heading}>Group E</div>
          <Item className={styles.item} identifier="e-1" index={0}>
            Item E - 1
          </Item>
          <Item className={styles.item} identifier="e-2" index={1}>
            Item E - 2
          </Item>
          <Item className={styles.item} identifier="e-3" index={2}>
            Item E - 3
          </Item>
          <Item className={styles.item} identifier="e-4" index={3}>
            Item E - 4
          </Item>
          <Item className={styles.group} identifier="e-5" index={4} isGroup>
            <div className={styles.heading}>Group E - 5</div>
            <Item className={styles.item} identifier="e-5-1" index={0}>
              Item E - 5 - 1
            </Item>
          </Item>
          <Item className={styles.group} identifier="e-6" index={4} isGroup>
            <div className={styles.heading}>Group E - 6</div>
          </Item>
          <Item className={styles.item} identifier="e-7" index={5}>
            Item E - 7
          </Item>
        </Item>
        <Item className={styles.item} identifier="f" index={5}>
          Item F
        </Item>
      </List>
    );
  })
  .add("Dynamic", () => {
    const rootItemId = "root";
    const [itemEntitiesMapState, setItemEntitiesMapState] = React.useState(
      (): Map<DummyItem["id"], NormalizedDummyItem> =>
        new Map([
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
        ]),
    );
    const [draggingItemIdentifierState, setDraggingItemIdentifierState] = React.useState<DummyItem["id"]>();

    const itemElements = React.useMemo(() => {
      const topLevelNormalizedItems = itemEntitiesMapState
        .get(rootItemId)
        .children.map((itemId) => itemEntitiesMapState.get(itemId));
      const createItemElement = (normalizedItem: NormalizedDummyItem, index: number) => {
        if (normalizedItem.children != undefined) {
          const childNormalizedItems = normalizedItem.children.map((itemId) => itemEntitiesMapState.get(itemId));
          const childItemElements = childNormalizedItems.map(createItemElement);

          return (
            <Item
              key={normalizedItem.id}
              className={classnames(styles.group, { [styles.dragging]: draggingItemIdentifierState === normalizedItem.id })}
              identifier={normalizedItem.id}
              index={index}
              isGroup
            >
              <div className={styles.heading}>{normalizedItem.title}</div>
              {childItemElements}
            </Item>
          );
        }

        return (
          <Item
            key={normalizedItem.id}
            className={classnames(styles.item, { [styles.dragging]: draggingItemIdentifierState === normalizedItem.id })}
            identifier={normalizedItem.id}
            index={index}
          >
            {normalizedItem.title}
          </Item>
        );
      };

      return topLevelNormalizedItems.map(createItemElement);
    }, [itemEntitiesMapState, draggingItemIdentifierState]);
    const renderGhostElement = React.useCallback(
      (meta: GhostRendererMeta<DummyItem["id"]>) => {
        const normalizedItem = itemEntitiesMapState.get(meta.identifier);

        if (meta.isGroup) {
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

    const onDragStart = React.useCallback((meta: DragStartMeta<DummyItem["id"]>) => {
      setDraggingItemIdentifierState(meta.identifier);
    }, []);
    const onDragEnd = React.useCallback(
      (meta: DragEndMeta<DummyItem["id"]>) => {
        setDraggingItemIdentifierState(undefined);
        if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return;

        const newMap = new Map(itemEntitiesMapState.entries());
        const normalizedItem = newMap.get(meta.identifier);
        const normalizedGroupItem = newMap.get(meta.groupIdentifier ?? rootItemId);
        if (meta.groupIdentifier === meta.nextGroupIdentifier) {
          normalizedGroupItem.children = arrayMove(normalizedGroupItem.children, meta.index, meta.nextIndex);
        } else {
          const nextNormalizedGroupItem = newMap.get(meta.nextGroupIdentifier ?? rootItemId);
          normalizedGroupItem.children.splice(meta.index, 1);
          nextNormalizedGroupItem.children.splice(meta.nextIndex, 0, normalizedItem.id);
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
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {itemElements}
      </List>
    );
  });
