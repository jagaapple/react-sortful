/// <reference types="./@types/global" />

import * as React from "react";
import classnames from "classnames";
import { storiesOf } from "@storybook/react";
import arrayMove from "array-move";

import * as ReactSortful from "../src";
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
      ({ identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>) => {
        const item = dummyItemsMap.get(identifier);

        return <div className={classnames(styles.itemContent, { [styles.dragging]: isDragging })}>{item.name}</div>;
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
        dropLineClassName={classnames(styles.dropLine, "bg-primary")}
        ghostClassName={styles.ghost}
        itemClassName={styles.item}
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
      ({ identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>) => {
        const item = dummyItemsMap.get(identifier);

        return <div className={classnames(styles.itemContent, { [styles.dragging]: isDragging })}>{item.name}</div>;
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
        dropLineClassName={classnames(styles.dropLine, "bg-primary")}
        ghostClassName={styles.ghost}
        itemClassName={styles.item}
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Many times", () => {
    const dummyItemsMap = React.useMemo(() => new Map<Item["id"], Item>(createDummyItems(100)), []);
    const [items, setItems] = React.useState(() => createItemsById(Array.from(dummyItemsMap.values())));

    const handleItemIdentifier = React.useCallback(
      ({ identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>) => {
        const item = dummyItemsMap.get(identifier);

        return <div className={classnames(styles.itemContent, { [styles.dragging]: isDragging })}>{item.name}</div>;
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
        dropLineClassName={classnames(styles.dropLine, "bg-primary")}
        ghostClassName={styles.ghost}
        itemClassName={styles.item}
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
      ({ identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<number>) => {
        const item = dummyItemsMap.get(identifier);

        return <div className={classnames(styles.itemContent, { [styles.dragging]: isDragging })}>{item.name}</div>;
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
        dropLineClassName={classnames(styles.dropLine, "bg-primary")}
        ghostClassName={styles.ghost}
        itemClassName={styles.item}
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
        isDisabled
      />
    );
  });
