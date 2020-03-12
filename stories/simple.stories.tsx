/// <reference types="./@types/global" />

import * as React from "react";
import classnames from "classnames";
import { storiesOf } from "@storybook/react";
import arrayMove from "array-move";

import * as ReactSortful from "../src";
import styles from "./simple.stories.css";

type Item = { id: number; name: string };

storiesOf("Simple", module)
  .addDecorator((story) => <div style={{ width: 512 }}>{story()}</div>)
  .add("Default", () => {
    const dummyItemsMap = React.useMemo(
      () =>
        new Map<Item["id"], Item>([
          [1, { id: 1, name: "Item - 0" }],
          [2, { id: 2, name: "Item - 1" }],
          [3, { id: 3, name: "Item - 2" }],
          [4, { id: 4, name: "Item - 3" }],
          [5, { id: 5, name: "Item - 4" }],
          [6, { id: 6, name: "Item - 5" }],
          [7, { id: 7, name: "Item - 6" }],
          [8, { id: 8, name: "Item - 7" }],
          [9, { id: 9, name: "Item - 8" }],
        ]),
      [],
    );
    const [itemsState, setItemsState] = React.useState(() =>
      Array.from(dummyItemsMap.values()).reduce<ReactSortful.Item<number>[]>((items, dummyItem) => {
        items.push({ identifier: dummyItem.id, children: [] });

        return items;
      }, []),
    );

    const handleItemIdentifier = React.useCallback((itemIdentifier: Item["id"]) => {
      const item = dummyItemsMap.get(itemIdentifier);

      return <div key={item.id}>{item.name}</div>;
    }, []);
    const onDragEnd = React.useCallback(
      (meta: ReactSortful.DestinationMeta<number>) => setItemsState(arrayMove(itemsState, meta.index, meta.nextIndex)),
      [itemsState],
    );

    return (
      <ReactSortful.List
        className={styles.wrapper}
        dropLineClassName={classnames(styles.dropLine, "bg-primary")}
        ghostClassName={classnames("shadow-sm", styles.ghost)}
        itemClassName={classnames("alert", "alert-light", "border", styles.item)}
        itemSpacing={8}
        items={itemsState}
        handleItemIdentifier={handleItemIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  });
