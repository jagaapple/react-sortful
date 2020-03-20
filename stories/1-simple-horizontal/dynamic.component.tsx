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
} from "../../src";

import { commonStyles } from "../shared";
import { styles } from "./shared";

type DummyItem = { id: string; title: string };

const initialItems: DummyItem[] = [
  { id: "a", title: "Item A" },
  { id: "b", title: "Item B" },
  { id: "c", title: "Item C" },
  { id: "d", title: "Item D" },
  { id: "e", title: "Item E" },
];

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
        <Item key={item.id} identifier={item.id} index={index}>
          <div className={styles.item}>{item.title}</div>
        </Item>
      )),
    [itemsState],
  );
  const renderGhostElement = React.useCallback(
    ({ identifier }: GhostRendererMeta<DummyItem["id"]>) => {
      const item = itemsById[identifier];

      return <div className={classnames(styles.item, styles.ghost)}>{item.title}</div>;
    },
    [itemsById],
  );
  const renderPlaceholderElement = React.useCallback(
    (injectedProps: PlaceholderRendererInjectedProps, { identifier }: PlaceholderRendererMeta<DummyItem["id"]>) => {
      const item = itemsById[identifier];

      return (
        <div {...injectedProps.binder()} className={classnames(styles.item, styles.placeholder)} style={injectedProps.style}>
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
      className={classnames(styles.wrapper, { [styles.disabled]: props.isDisabled })}
      renderDropLine={renderDropLineElement}
      renderGhost={renderGhostElement}
      renderPlaceholder={renderPlaceholderElement}
      direction="horizontal"
      isDisabled={props.isDisabled}
      onDragEnd={onDragEnd}
    >
      {itemElements}
    </List>
  );
};
