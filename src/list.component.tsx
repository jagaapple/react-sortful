import * as React from "react";

import { ItemIdentifier, NodeMeta } from "./shared";
import {
  DestinationMeta,
  DragEndMeta,
  DragStartMeta,
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  ListContext,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackMeta,
} from "./list";

type Props<T extends ItemIdentifier> = {
  /** A function to render a drop line element in dragging any item. */
  renderDropLine: (injectedProps: DropLineRendererInjectedProps) => React.ReactNode;
  /** A function to render a ghost element in dragging any item. */
  renderGhost: (meta: GhostRendererMeta<T>) => React.ReactNode;
  /** A function to render a placeholder element instead of a dragging item element. */
  renderPlaceholder?: (injectedProps: PlaceholderRendererInjectedProps, meta: PlaceholderRendererMeta<T>) => JSX.Element;
  /**
   * A spacing size (px) between items.
   * @default 8
   */
  itemSpacing?: number;
  /**
   * A threshold size (px) of stackable area for groups.
   * @default 8
   */
  stackableAreaThreshold?: number;
  /** A callback function after starting of dragging. */
  onDragStart?: (meta: DragStartMeta<T>) => void;
  /** A callback function after end of dragging. */
  onDragEnd: (meta: DragEndMeta<T>) => void;
  /** A callback function after stacking an item on any group. */
  onStack?: (meta: StackMeta<T>) => void;
  className?: string;
  children?: React.ReactNode;
};

export const List = <T extends ItemIdentifier>(props: Props<T>) => {
  const [draggingNodeMetaState, setDraggingNodeMetaState] = React.useState<NodeMeta<T>>();
  const [isVisibleDropLineElementState, setIsVisibleDropLineElementState] = React.useState(false);

  const itemSpacing = props.itemSpacing ?? 8;
  const stackableAreaThreshold = props.stackableAreaThreshold ?? 8;

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const hoveredNodeMetaRef = React.useRef<NodeMeta<T>>();
  const destinationMetaRef = React.useRef<DestinationMeta<T>>();

  const dropLineElement = React.useMemo(() => {
    const style: React.CSSProperties = {
      display: isVisibleDropLineElementState ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      transform: "translate(0, -50%)",
      pointerEvents: "none",
    };

    return props.renderDropLine({ ref: dropLineElementRef, style });
  }, [props.renderDropLine, isVisibleDropLineElementState]);
  const ghostElement = React.useMemo(() => {
    if (draggingNodeMetaState == undefined) return;

    const { identifier, groupIdentifier, index, isGroup } = draggingNodeMetaState;

    return props.renderGhost({ identifier, groupIdentifier, index, isGroup });
  }, [props.renderGhost, draggingNodeMetaState]);

  return (
    <ListContext.Provider
      value={{
        itemSpacing,
        stackableAreaThreshold,
        draggingNodeMeta: draggingNodeMetaState,
        setDraggingNodeMeta: setDraggingNodeMetaState,
        dropLineElementRef,
        ghostWrapperElementRef,
        isVisibleDropLineElement: isVisibleDropLineElementState,
        setIsVisibleDropLineElement: setIsVisibleDropLineElementState,
        renderPlaceholder: props.renderPlaceholder,
        hoveredNodeMetaRef: hoveredNodeMetaRef,
        destinationMetaRef,
        onDragStart: props.onDragStart,
        onDragEnd: props.onDragEnd,
        onStack: props.onStack,
      }}
    >
      <div className={props.className} style={{ position: "relative" }}>
        {props.children}

        {dropLineElement}
        <div ref={ghostWrapperElementRef} style={{ position: "fixed", pointerEvents: "none" }}>
          {ghostElement}
        </div>
      </div>
    </ListContext.Provider>
  );
};
