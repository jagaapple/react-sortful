import * as React from "react";
import { useGesture } from "react-use-gesture";

import { ItemContext } from "./item";
import { UseGestureConfig, UseGestureEvent } from "react-use-gesture/dist/types";

type Props = {
  className?: string;
  children: React.ReactNode;
  /**
   * Specify a react-use-gesture config object to use for specifying the drag.
   */
  useGestureConfig?: UseGestureConfig;
  /**
   * If you want to do something on click or on tap, specify this option.
   */
  onTap?: (event: UseGestureEvent) => void;
};

export const DragHandleComponent = (props: Props) => {
  const itemContext = React.useContext(ItemContext);

  const useGestureConfig: UseGestureConfig = { ...(props.useGestureConfig || {}) };
  if (props.onTap) {
    useGestureConfig.drag = useGestureConfig.drag || {};
    useGestureConfig.drag.filterTaps = true;
  }

  // Checks `props.children` has one React node.
  React.useEffect(() => {
    React.Children.only(props.children);
  }, [props.children]);

  const draggableBinder = useGesture(
    {
      onDragStart: (state: any) => {
        if (itemContext.isLocked) return;

        const event: React.SyntheticEvent = state.event;
        event?.persist?.();
        event?.stopPropagation?.();

        itemContext.dragHandlers.onDragStart();
      },
      onDrag: ({ down, movement, tap, event }) => {
        if (tap && props.onTap) {
          props.onTap(event as any);
          return;
        }

        if (itemContext.isLocked) return;

        itemContext.dragHandlers.onDrag(down, movement);
      },
      onDragEnd: () => {
        if (itemContext.isLocked) return;

        itemContext.dragHandlers.onDragEnd();
      },
    },
    useGestureConfig,
  );

  return (
    <div className={props.className} {...draggableBinder()}>
      {props.children}
    </div>
  );
};
