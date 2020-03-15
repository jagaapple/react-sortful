import * as React from "react";
import classnames from "classnames";
import { storiesOf } from "@storybook/react";
import arrayMove from "array-move";

import * as ReactSortful from "../src";
import { commonStyles } from "./shared";
import styles from "./vertical-simple.stories.css";

type Entry = { id: number; name: string };

const createDummyEntries = (count: number) =>
  new Array(count).fill(undefined).map((_, index): [Entry["id"], Entry] => [index, { id: index, name: `Entry - ${index}` }]);
const createItems = (entries: Entry[]) =>
  entries.reduce<ReactSortful.Item<Entry["id"]>[]>((items, entry) => {
    items.push({ identifier: entry.id, children: [] });

    return items;
  }, []);

storiesOf("Vertical Simple", module)
  .addDecorator((story) => <div style={{ width: 512 }}>{story()}</div>)
  .add("Default", () => {
    const entriesMap = React.useMemo(() => new Map<Entry["id"], Entry>(createDummyEntries(10)), []);
    const [items, setItems] = React.useState(() => createItems(Array.from(entriesMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<Entry["id"]>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const entry = entriesMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {entry.name}
          </div>
        );
      },
      [entriesMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<Entry["id"]>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        ghostSize="same-item"
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Zero items", () => {
    const entriesMap = React.useMemo(() => new Map<Entry["id"], Entry>(createDummyEntries(0)), []);
    const [items, setItems] = React.useState(() => createItems(Array.from(entriesMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<Entry["id"]>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const entry = entriesMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {entry.name}
          </div>
        );
      },
      [entriesMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<Entry["id"]>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        ghostSize="same-item"
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Many items", () => {
    const entriesMap = React.useMemo(() => new Map<Entry["id"], Entry>(createDummyEntries(100)), []);
    const [items, setItems] = React.useState(() => createItems(Array.from(entriesMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<Entry["id"]>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const entry = entriesMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {entry.name}
          </div>
        );
      },
      [entriesMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<Entry["id"]>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        ghostSize="same-item"
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Custom drag handle", () => {
    const entriesMap = React.useMemo(() => new Map<Entry["id"], Entry>(createDummyEntries(10)), []);
    const [items, setItems] = React.useState(() => createItems(Array.from(entriesMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<Entry["id"]>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const entry = entriesMap.get(identifier);

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
            {entry.name}
          </div>
        );
      },
      [entriesMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<Entry["id"]>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        ghostSize="same-item"
        draggingCursorStyle="grabbing"
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  })
  .add("Disabled", () => {
    const entriesMap = React.useMemo(() => new Map<Entry["id"], Entry>(createDummyEntries(10)), []);
    const [items, setItems] = React.useState(() => createItems(Array.from(entriesMap.values())));

    const handleItemIdentifier = React.useCallback(
      (
        { identifier, isDragging }: ReactSortful.ItemIdentifierHandlerMeta<Entry["id"]>,
        props: ReactSortful.ItemElementInjectedProps,
        draggable: ReactSortful.ItemElementDraggable,
      ) => {
        const entry = entriesMap.get(identifier);

        return (
          <div {...props} {...draggable()} className={classnames(styles.item, { [styles.dragging]: isDragging })}>
            {entry.name}
          </div>
        );
      },
      [entriesMap],
    );
    const onDragEnd = React.useCallback(
      ({ index, nextIndex }: ReactSortful.DestinationMeta<Entry["id"]>) => setItems(arrayMove(items, index, nextIndex)),
      [items],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(commonStyles.dropLine, styles.dropLine)}
        ghostClassName={styles.ghost}
        ghostSize="same-item"
        itemSpacing={8}
        items={items}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
        isDisabled
      />
    );
  });
