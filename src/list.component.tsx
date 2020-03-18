import * as React from "react";

import { Direction, ItemIdentifier, NodeMeta } from "./shared";
import {
  DestinationMeta,
  DragEndMeta,
  DragStartMeta,
  DropLineRendererInjectedProps,
  GhostRendererMeta,
  ListContext,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackedGroupRendererInjectedProps,
  StackedGroupRendererMeta,
  StackGroupMeta,
} from "./list";

type Props<T extends ItemIdentifier> = {
  /** A function to render a drop line element in dragging any item. */
  renderDropLine: (injectedProps: DropLineRendererInjectedProps) => React.ReactNode;
  /** A function to render a ghost element in dragging any item. */
  renderGhost: (meta: GhostRendererMeta<T>) => React.ReactNode;
  /** A function to render a placeholder element instead of a dragging item element. */
  renderPlaceholder?: (injectedProps: PlaceholderRendererInjectedProps, meta: PlaceholderRendererMeta<T>) => JSX.Element;
  /** A function to render an item element when an empty group item is hovered by a dragging item. */
  renderStackedGroup?: (injectedProps: StackedGroupRendererInjectedProps, meta: StackedGroupRendererMeta<T>) => JSX.Element;
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
  /**
   * A direction to recognize drop area.
   * Note that this will not change styles, so you have to apply styles such as being arranged side by side.
   * @default "vertical"
   */
  direction?: Direction;
  /**
   * Whether all items are not able to move, drag, and stack.
   * @default false
   */
  isDisabled?: boolean;
  /** A callback function after starting of dragging. */
  onDragStart?: (meta: DragStartMeta<T>) => void;
  /** A callback function after end of dragging. */
  onDragEnd: (meta: DragEndMeta<T>) => void;
  /** A callback function while an empty group item is hovered by a dragging item. */
  onStackGroup?: (meta: StackGroupMeta<T>) => void;
  className?: string;
  children?: React.ReactNode;
};

export const List = <T extends ItemIdentifier>(props: Props<T>) => {
  const [draggingNodeMetaState, setDraggingNodeMetaState] = React.useState<NodeMeta<T>>();
  const [isVisibleDropLineElementState, setIsVisibleDropLineElementState] = React.useState(false);
  const [stackedGroupIdentifierState, setStackedGroupIdentifierState] = React.useState<T>();

  const itemSpacing = props.itemSpacing ?? 8;
  const stackableAreaThreshold = props.stackableAreaThreshold ?? 8;
  const direction = props.direction ?? "vertical";
  const isDisabled = props.isDisabled ?? false;

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
      transform: direction === "vertical" ? "translate(0, -50%)" : "translate(-50%, 0)",
      pointerEvents: "none",
    };

    return props.renderDropLine({ ref: dropLineElementRef, style });
  }, [props.renderDropLine, isVisibleDropLineElementState, direction]);
  const ghostElement = React.useMemo(() => {
    if (draggingNodeMetaState == undefined) return;

    const { identifier, groupIdentifier, index, isGroup } = draggingNodeMetaState;

    return props.renderGhost({ identifier, groupIdentifier, index, isGroup });
  }, [props.renderGhost, draggingNodeMetaState]);

  const margin: [string, string, string, string] = ["0", "0", "0", "0"];
  if (direction === "vertical") margin[0] = `${itemSpacing}px`;
  if (direction === "horizontal") margin[3] = `${itemSpacing}px`;
  const style: React.CSSProperties = { position: "relative", margin: margin.join(" ") };

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
        stackedGroupIdentifier: stackedGroupIdentifierState,
        setStackedGroupIdentifier: setStackedGroupIdentifierState,
        renderStackedGroup: props.renderStackedGroup,
        hoveredNodeMetaRef: hoveredNodeMetaRef,
        destinationMetaRef,
        direction,
        isDisabled,
        onDragStart: props.onDragStart,
        onDragEnd: props.onDragEnd,
        onStackGroup: props.onStackGroup,
      }}
    >
      <div className={props.className} style={style}>
        {props.children}

        {dropLineElement}
        <div ref={ghostWrapperElementRef} style={{ position: "fixed", pointerEvents: "none" }}>
          {ghostElement}
        </div>
      </div>
    </ListContext.Provider>
  );
};
