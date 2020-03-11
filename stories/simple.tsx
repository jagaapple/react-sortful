/// <reference types="./@types/global" />

import * as React from "react";
import classnames from "classnames";
import { storiesOf } from "@storybook/react";

import { ReactSortful, Tree } from "../src";
import styles from "./simple.css";

type Item = { id: number; name: string };
const dummyItems: Item[] = [
  { id: 1, name: "Jaga Apple 1" },
  { id: 2, name: "Pine Apple 1" },
  { id: 3, name: "Cinnamon 1" },
  { id: 4, name: "Jaga Apple 2" },
  { id: 5, name: "Pine Apple 2" },
  { id: 6, name: "Cinnamon 2" },
  { id: 7, name: "Jaga Apple 3" },
  { id: 8, name: "Pine Apple 3" },
  { id: 9, name: "Cinnamon 3" },
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
    const [nodesState] = React.useState(dummyNodes);

    const handleNodeIdentifier = React.useCallback((nodeIdentifier) => {
      const item = dummyItemsById[nodeIdentifier];

      return <div key={item.id}>Item - {item.name}</div>;
    }, []);

    return (
      <ReactSortful
        className={styles.wrapper}
        dropLineClassName={classnames(styles.dropLine, "bg-primary")}
        ghostClassName={classnames("shadow-sm", styles.ghost)}
        nodeClassName={classnames("alert", "alert-light", "border", styles.item)}
        nodeSpacing={8}
        tree={nodesState}
        handleNodeIdentifier={handleNodeIdentifier}
      />
    );
  });
