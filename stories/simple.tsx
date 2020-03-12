/// <reference types="./@types/global" />

import * as React from "react";
import classnames from "classnames";
import { storiesOf } from "@storybook/react";
import arrayMove from "array-move";

import { DestinationMeta, ReactSortful, Tree } from "../src";
import styles from "./simple.css";

type Item = { id: number; name: string };
const dummyItems: Item[] = [
  { id: 1, name: "Item - 0" },
  { id: 2, name: "Item - 1" },
  { id: 3, name: "Item - 2" },
  { id: 4, name: "Item - 3" },
  { id: 5, name: "Item - 4" },
  { id: 6, name: "Item - 5" },
  { id: 7, name: "Item - 6" },
  { id: 8, name: "Item - 7" },
  { id: 9, name: "Item - 8" },
];
const dummyItemsById = dummyItems.reduce<Record<Item["id"], Item>>((object, item) => {
  object[item.id] = item;

  return object;
}, {});
const dummyNodes = dummyItems.reduce<Tree>((tree, dummyItem) => {
  tree.push({ identifier: dummyItem.id.toString(), children: [] });

  return tree;
}, []);

storiesOf("/Simple", module)
  .addDecorator((story) => <div style={{ boxShadow: "0 0 0 1px red inset", width: 512 }}>{story()}</div>)
  .add("Default", () => {
    const [nodesState, setNodesState] = React.useState(dummyNodes);

    const handleNodeIdentifier = React.useCallback((nodeIdentifier) => {
      const item = dummyItemsById[nodeIdentifier];

      return <div key={item.id}>{item.name}</div>;
    }, []);
    const onDragEnd = React.useCallback(
      (meta: DestinationMeta) => setNodesState(arrayMove(nodesState, meta.previousIndex, meta.index)),
      [nodesState],
    );

    return (
      <ReactSortful
        className={styles.wrapper}
        dropLineClassName={classnames(styles.dropLine, "bg-primary")}
        ghostClassName={classnames("shadow-sm", styles.ghost)}
        nodeClassName={classnames("alert", "alert-light", "border", styles.item)}
        nodeSpacing={8}
        tree={nodesState}
        handleNodeIdentifier={handleNodeIdentifier}
        onDragEnd={onDragEnd}
      />
    );
  });
