import * as React from "react";
import arrayMove from "array-move";

import { DragEndMeta, DropLineRendererInjectedProps, GhostRendererMeta, Item, List } from "../../src";

type DummyItem = { id: string; title: string };

const initialItems: DummyItem[] = [
  { id: "a", title: "Item A" },
  { id: "b", title: "Item B" },
  { id: "c", title: "Item C" },
  { id: "d", title: "Item D" },
  { id: "e", title: "Item E" },
];

const renderDropLineElement = (injectedProps: DropLineRendererInjectedProps) => (
  <div ref={injectedProps.ref} style={injectedProps.style} />
);

export const NonStyledComponent = () => {
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
          {item.title}
        </Item>
      )),
    [itemsState],
  );
  const renderGhostElement = React.useCallback(
    ({ identifier }: GhostRendererMeta<DummyItem["id"]>) => {
      const item = itemsById[identifier];

      return item.title;
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
    <List renderDropLine={renderDropLineElement} renderGhost={renderGhostElement} onDragEnd={onDragEnd}>
      {itemElements}
    </List>
  );
};
