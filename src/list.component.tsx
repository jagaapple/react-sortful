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
import { IListContext } from "./list/context";

type Props<T extends ItemIdentifier> = {
  /**
   * A function to return an element used as a drop line.
   * A drop line is a line to display a destination position to users.
   */
  renderDropLine: (injectedProps: DropLineRendererInjectedProps) => React.ReactNode;
  /**
   * A function to return an element used as a ghost.
   * A ghost is an element following a mouse pointer when dragging.
   */
  renderGhost: (meta: GhostRendererMeta<T>) => React.ReactNode;
  /**
   * A function to return an element used as a placeholder.
   * A placeholder is an element remaining in place when dragging the element.
   */
  renderPlaceholder?: (injectedProps: PlaceholderRendererInjectedProps, meta: PlaceholderRendererMeta<T>) => JSX.Element;
  /** A function to render an item element when an empty group item is hovered by a dragged item. */
  renderStackedGroup?: (injectedProps: StackedGroupRendererInjectedProps, meta: StackedGroupRendererMeta<T>) => JSX.Element;
  /**
   * A spacing size (px) between items.
   * @default 8
   */
  itemSpacing?: number;
  /**
   * A threshold size (px) of stackable area for group items.
   * @default 8
   */
  stackableAreaThreshold?: number;
  /**
   * A direction to recognize a drop area.
   * Note that this will not change styles, so you have to apply styles such as being arranged side by side.
   * @default "vertical"
   */
  direction?: Direction;
  /** A cursor style when dragging. */
  draggingCursorStyle?: React.CSSProperties["cursor"];
  /**
   * Whether all items are not able to move, drag, and stack.
   * @default false
   */
  isDisabled?: boolean;
  /** A callback function after starting of dragging. */
  onDragStart?: (meta: DragStartMeta<T>) => void;
  /** A callback function after end of dragging. */
  onDragEnd: (meta: DragEndMeta<T>) => void;
  /** A callback function when an empty group item is hovered by a dragged item. */
  onStackGroup?: (meta: StackGroupMeta<T>) => void;
  /** A unique identifier for this list (as opposed to a nested list). If you don't supply this, one will be generated.*/
  identifier?: T;
  className?: string;
  children?: React.ReactNode;
};

export const List = <T extends ItemIdentifier>(props: Props<T>) => {
  const listContext = React.useContext(ListContext);

  let draggingNodeMeta: NodeMeta<T> | undefined = listContext?.draggingNodeMeta;
  let setDraggingNodeMeta = listContext?.setDraggingNodeMeta;
  let stackedGroupIdentifier: T | undefined = listContext?.stackedGroupIdentifier;
  let setStackedGroupIdentifier = listContext?.setStackedGroupIdentifier;
  const [listIdentifier] = React.useState(props.identifier || Math.random() + "");

  // children lists of this list
  const childrenLists = React.useRef<Set<IListContext>>(new Set());

  if (!setDraggingNodeMeta) {
    [draggingNodeMeta, setDraggingNodeMeta] = React.useState<NodeMeta<T>>();
  }
  if (!setStackedGroupIdentifier) {
    [stackedGroupIdentifier, setStackedGroupIdentifier] = React.useState<T>();
  }

  const [isVisibleDropLineElement, setIsVisibleDropLineElement] = React.useState(false);
  const [isVisibleDropLineElementOnChildList, setIsVisibleDropLineElementOnChildList] = React.useState(false);

  React.useEffect(() => {
    listContext?.setIsVisibleDropLineElementOnChildList(isVisibleDropLineElementOnChildList || isVisibleDropLineElement);
  }, [listContext, isVisibleDropLineElement, isVisibleDropLineElementOnChildList]);

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const hoveredNodeMetaRef = React.useRef<NodeMeta<T>>();
  const destinationMetaRef = React.useRef<DestinationMeta<T>>();

  const itemSpacing = props.itemSpacing ?? 8;
  const stackableAreaThreshold = props.stackableAreaThreshold ?? 8;
  const direction = props.direction ?? "vertical";
  const isDisabled = props.isDisabled ?? false;

  const dropLineElement = React.useMemo(() => {
    const displayLine =
      draggingNodeMeta &&
      isVisibleDropLineElement &&
      !isVisibleDropLineElementOnChildList &&
      hoveredNodeMetaRef.current?.listIdentifier === listIdentifier;

    const style: React.CSSProperties = {
      display: displayLine ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      transform: direction === "vertical" ? "translate(0, -50%)" : "translate(-50%, 0)",
      pointerEvents: "none",
    };

    return props.renderDropLine({ ref: dropLineElementRef, style });
  }, [
    props.renderDropLine,
    draggingNodeMeta,
    childrenLists,
    isVisibleDropLineElement,
    isVisibleDropLineElementOnChildList,
    hoveredNodeMetaRef.current,
    direction,
  ]);

  const ghostElement = React.useMemo(() => {
    if (draggingNodeMeta == undefined || draggingNodeMeta.listIdentifier !== listIdentifier) return;

    const { identifier, groupIdentifier, index, isGroup } = draggingNodeMeta;

    return props.renderGhost({ identifier, groupIdentifier, index, isGroup });
  }, [props.renderGhost, draggingNodeMeta]);

  const padding: [string, string] = ["0", "0"];
  if (direction === "vertical") padding[0] = `${itemSpacing}px`;
  if (direction === "horizontal") padding[1] = `${itemSpacing}px`;

  const rootList = listContext?.rootList || listContext;

  const resetDragState = () => {
    // Resets context values.
    setIsVisibleDropLineElement(false);
    setIsVisibleDropLineElementOnChildList(false);
    listContext?.setIsVisibleDropLineElement(false);
    listContext?.setIsVisibleDropLineElementOnChildList(false);
    setDraggingNodeMeta(undefined);
    setStackedGroupIdentifier(undefined);
    hoveredNodeMetaRef.current = undefined;
    destinationMetaRef.current = undefined;

    // also go through all the children and reset their local state
    for (const child of childrenLists.current) {
      child.resetDragState();
    }
  };

  const thisListContext: IListContext = {
    itemSpacing,
    stackableAreaThreshold,
    draggingNodeMeta,
    setDraggingNodeMeta,
    dropLineElementRef,
    ghostWrapperElementRef,
    isVisibleDropLineElement,
    setIsVisibleDropLineElement,
    isVisibleDropLineElementOnChildList,
    setIsVisibleDropLineElementOnChildList,
    stackedGroupIdentifier,
    setStackedGroupIdentifier,
    listIdentifier,
    rootList,
    childrenLists,
    hoveredNodeMetaRef,
    destinationMetaRef,
    direction,
    isDisabled,
    renderPlaceholder: props.renderPlaceholder,
    renderStackedGroup: props.renderStackedGroup,
    draggingCursorStyle: props.draggingCursorStyle,
    resetDragState,
    onDragStart: props.onDragStart,
    onDragEnd: function(meta: DragEndMeta<any>) {
      rootList ? rootList.resetDragState() : resetDragState();
      props?.onDragEnd(meta);
    },
    onStackGroup: props.onStackGroup,
  };

  // add the children and the ancestor
  React.useEffect(() => {
    listContext?.childrenLists.current.add(thisListContext);

    return () => {
      listContext?.childrenLists.current.delete(thisListContext);
    };
  }, []);

  return (
    <ListContext.Provider value={thisListContext}>
      <div className={props.className} style={{ position: "relative", padding: padding.join(" ") }}>
        {props.children}

        {dropLineElement}
        <div ref={ghostWrapperElementRef} style={{ position: "fixed", pointerEvents: "none" }}>
          {ghostElement}
        </div>
      </div>
    </ListContext.Provider>
  );
};
