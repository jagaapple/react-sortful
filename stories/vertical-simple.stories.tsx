import * as React from "react";
import classnames from "classnames";
import { storiesOf } from "@storybook/react";
import arrayMove from "array-move";

import * as ReactSortful from "../src";
import { commonStyles } from "./shared";
import styles from "./vertical-simple.stories.css";

type Item = { id: number; name: string };

const createDummyItems = (count: number) =>
  new Array(count).fill(undefined).map((_, index): [Item["id"], Item] => [index, { id: index, name: `Item - ${index}` }]);
const createItemsById = (items: Item[]) =>
  items.reduce<ReactSortful.Item<number>[]>((items, dummyItem) => {
    items.push({ identifier: dummyItem.id, children: [] });

    return items;
  }, []);

storiesOf("Vertical Simple", module)
  .addDecorator((story) => <div style={{ width: 512 }}>{story()}</div>)
  .add("Default", () => {
    const dummyItemsMap = React.useMemo(() => new Map<Item["id"], Item>(createDummyItems(10)), []);
    const [items, setItems] = React.useState(() => createItemsById(Array.from(dummyItemsMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const item = dummyItemsMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {item.name}
          </div>
        );
      },
      [dummyItemsMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<number>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Zero items", () => {
    const dummyItemsMap = React.useMemo(() => new Map<Item["id"], Item>(createDummyItems(0)), []);
    const [items, setItems] = React.useState(() => createItemsById(Array.from(dummyItemsMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const item = dummyItemsMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {item.name}
          </div>
        );
      },
      [dummyItemsMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<number>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Many items", () => {
    const dummyItemsMap = React.useMemo(() => new Map<Item["id"], Item>(createDummyItems(100)), []);
    const [items, setItems] = React.useState(() => createItemsById(Array.from(dummyItemsMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const item = dummyItemsMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {item.name}
          </div>
        );
      },
      [dummyItemsMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<number>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Custom drag handle", () => {
    const dummyItemsMap = React.useMemo(() => new Map<Item["id"], Item>(createDummyItems(10)), []);
    const [items, setItems] = React.useState(() => createItemsById(Array.from(dummyItemsMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const item = dummyItemsMap.get(identifier);

        return (
          <div {...props} className={classnames(styles.item, styles.withCustomDragHandle, { [styles.dragging]: isDragging })}>
            <svg
              {...draggable()}
              className={classnames(styles.customDragHandle, { [styles.dragging]: isDragging })}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <rect x="4" y="5" height="6" width="40" />
              <rect x="4" y="21" height="6" width="40" />
              <rect x="4" y="37" height="6" width="40" />
            </svg>
            {item.name}
          </div>
        );
      },
      [dummyItemsMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<number>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Disabled", () => {
    const dummyItemsMap = React.useMemo(() => new Map<Item["id"], Item>(createDummyItems(10)), []);
    const [items, setItems] = React.useState(() => createItemsById(Array.from(dummyItemsMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const item = dummyItemsMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {item.name}
          </div>
        );
      },
      [dummyItemsMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<number>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
        isDisabled
      />
    );
  });
