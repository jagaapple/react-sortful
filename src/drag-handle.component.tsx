import * as React from "react";
import { useGesture } from "react-use-gesture";

import { ItemContext } from "./item";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const DragHandleComponent = (props: Props) => {
  const itemContext = React.useContext(ItemContext);

  // Checks `props.children` has one React node.
  React.useEffect(() => {
    React.Children.only(props.children);
  }, [props.children]);

  const draggableBinder = useGesture({
    onDragStart: (state: any) => {
      if (itemContext.isLocked) return;

      const event: React.SyntheticEvent = state.event;
      event.persist();
      event.stopPropagation();

      itemContext.dragHandlers.onDragStart();
    },
    onDrag: ({ down, movement }) => {
      if (itemContext.isLocked) return;

      itemContext.dragHandlers.onDrag(down, movement);
    },
    onDragEnd: () => {
      if (itemContext.isLocked) return;

      itemContext.dragHandlers.onDragEnd();
    },
  });

  return (
    <div className={props.className} {...draggableBinder()}>
      {props.children}
    </div>
  );
};
