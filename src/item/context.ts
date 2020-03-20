import * as React from "react";

export const Context = React.createContext<{
  isLocked: boolean;
  dragHandlers: {
    onDragStart: () => void;
    onDrag: (isDown: boolean, absoluteXY: [number, number]) => void;
    onDragEnd: () => void;
  };
}>({
  isLocked: false,
  dragHandlers: {
    onDragStart: () => false,
    onDrag: () => false,
    onDragEnd: () => false,
  },
});
