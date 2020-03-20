import * as React from "react";
import classnames from "classnames";
import arrayMove from "array-move";

import {
  DragEndMeta,
  DragHandleComponent,
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  Item,
  List,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
} from "../../src";

import styles from "./custom-drag-handle.css";

type DummyItem = { id: string; title: string };

const initialItems: DummyItem[] = [
  { id: "a", title: "Item A" },
  { id: "b", title: "Item B" },
  { id: "c", title: "Item C" },
  { id: "d", title: "Item D" },
  { id: "e", title: "Item E" },
];

const dotsSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <circle cx="18" cy="12" r="3" />
    <circle cx="18" cy="24" r="3" />
    <circle cx="18" cy="36" r="3" />
    <circle cx="30" cy="12" r="3" />
    <circle cx="30" cy="24" r="3" />
    <circle cx="30" cy="36" r="3" />
  </svg>
);
const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} className={styles.dropLine} style={injectedProps.style} />
);

export const CustomDragHandleComponent = () => {
  const [itemsState, setItemsState] = React.useState(initialItems);
  const itemsById = React.useMemo(
    () =>
      itemsState.reduce<Record<DummyItem["id"], DummyItem>>((object, item) => {
        object[item.id] = item;

        return object;
      }, {}),
    [itemsState],
  );

  const itemElements = React.useMemo(
    () =>
      itemsState.map((item, index) => (
        <Item key={item.id} identifier={item.id} index={index} isUsedCustomDragHandlers>
          <div className={styles.item}>
            <DragHandleComponent className={styles.dragHandle}>{dotsSVG}</DragHandleComponent>

            {item.title}
          </div>
        </Item>
      )),
    [itemsState],
  );
  const renderGhostElement = React.useCallback(
    ({ identifier }: GhostRendererMeta<DummyItem["id"]>) => {
      const item = itemsById[identifier];

      return (
        <div className={classnames(styles.item, styles.ghost)}>
          <div className={styles.dragHandle}>{dotsSVG}</div>

          {item.title}
        </div>
      );
    },
    [itemsById],
  );
  const renderPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps, { identifier }: PlaceholderRendererMeta<DummyItem["id"]>) => {
      const item = itemsById[identifier];

      return (
        <div className={classnames(styles.item, styles.placeholder)} style={injectedProps.style}>
          <DragHandleComponent className={styles.dragHandle}>{dotsSVG}</DragHandleComponent>

          {item.title}
        </div>
      );
    },
    [itemsById],
  );

  const onDragEnd = React.useCallback(
    (meta: DragEndMeta<DummyItem["id"]>) => {
      if (meta.nextIndex == undefined) return;

      setItemsState(arrayMove(itemsState, meta.index, meta.nextIndex));
    },
    [itemsState],
  );

  return (
    <List
      className={styles.wrapper}
      renderDropLine={renderDropLineElement}
      renderGhost={renderGhostElement}
      renderPlaceholder={renderPlaceholderElement}
      itemSpacing={12}
      draggingCursorStyle="grabbing"
      onDragEnd={onDragEnd}
    >
      {itemElements}
    </List>
  );
};
