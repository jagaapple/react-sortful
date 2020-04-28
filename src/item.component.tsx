import * as React from "react";
import { useGesture } from "react-use-gesture";

import { checkIsInStackableArea, getDropLineDirectionFromXY, getNodeMeta, ItemIdentifier, NodeMeta } from "./shared";
import { ListContext, PlaceholderRendererMeta, StackedGroupRendererMeta } from "./list";
import { GroupContext } from "./groups";
import {
  checkIsAncestorItem,
  clearBodyStyle,
  clearGhostElementStyle,
  getDropLinePositionItemIndex,
  getPlaceholderElementStyle,
  getStackedGroupElementStyle,
  initializeGhostElementStyle,
  ItemContext,
  moveGhostElement,
  setBodyStyle,
  setDropLineElementStyle,
} from "./item";

type Props<T extends ItemIdentifier> = {
  /** A unique identifier in all items of list. */
  identifier: T;
  /** A unique and sequential index number in a parent group. */
  index: number;
  /**
   * Whether an item is possible to have child items.
   * @default false
   */
  isGroup?: boolean;
  /**
   * Whether child items are not able to move and drag.
   * Stacking and popping child items will be allowed. Grandchild items will not be affected.
   * @default false
   */
  isLocked?: boolean;
  /**
   * Whether droppable areas on both sides of an item is disabled.
   * @default false
   */
  isLonely?: boolean;
  /**
   * Whether an item contains custom drag handlers in child items (not grandchildren).
   * @default false
   */
  isUsedCustomDragHandlers?: boolean;
  children?: React.ReactNode;
};

export const Item = <T extends ItemIdentifier>(props: Props<T>) => {
  const listContext = React.useContext(ListContext);
  const groupContext = React.useContext(GroupContext);

  const wrapperElementRef = React.useRef<HTMLDivElement>(null);

  const ancestorIdentifiers = [...groupContext.ancestorIdentifiers, props.identifier];
  const isGroup = props.isGroup ?? false;
  const isLocked = (listContext.isDisabled || props.isLocked) ?? false;
  const isLonley = props.isLonely ?? false;
  const isUsedCustomDragHandlers = props.isUsedCustomDragHandlers ?? false;

  // Registers an identifier to the group context.
  const childIdentifiersRef = React.useRef<Set<ItemIdentifier>>(new Set());
  React.useEffect(() => {
    groupContext.childIdentifiersRef.current.add(props.identifier);

    return () => {
      groupContext.childIdentifiersRef.current.delete(props.identifier);
    };
  }, []);

  // Clears timers.
  const clearingDraggingNodeTimeoutIdRef = React.useRef<number>();
  React.useEffect(
    () => () => {
      window.clearTimeout(clearingDraggingNodeTimeoutIdRef.current);
    },
    [],
  );

  const onDragStart = React.useCallback(() => {
    const element = wrapperElementRef.current;
    if (element == undefined) return;

    setBodyStyle(document.body, listContext.draggingCursorStyle);
    initializeGhostElementStyle(
      element,
      listContext.ghostWrapperElementRef.current ?? undefined,
      listContext.itemSpacing,
      listContext.direction,
    );

    // Sets contexts to values.
    const nodeMeta = getNodeMeta(
      element,
      props.identifier,
      groupContext.identifier,
      listContext.listIdentifier,
      ancestorIdentifiers,
      props.index,
      isGroup,
    );
    listContext.setDraggingNodeMeta(nodeMeta);

    // Calls callbacks.
    listContext.onDragStart?.({
      identifier: nodeMeta.identifier,
      groupIdentifier: nodeMeta.groupIdentifier,
      listIdentifier: listContext.listIdentifier,
      index: nodeMeta.index,
      isGroup: nodeMeta.isGroup,
    });
  }, [
    listContext.itemSpacing,
    listContext.direction,
    listContext.onDragStart,
    listContext.draggingCursorStyle,
    groupContext.identifier,
    props.identifier,
    props.index,
    ancestorIdentifiers,
    isGroup,
  ]);
  const onDrag = React.useCallback((isDown: boolean, absoluteXY: [number, number]) => {
    if (!isDown) return;

    moveGhostElement(listContext.ghostWrapperElementRef.current ?? undefined, absoluteXY);
  }, []);
  const onDragEnd = React.useCallback(() => {
    clearBodyStyle(document.body);
    clearGhostElementStyle(listContext.ghostWrapperElementRef.current ?? undefined);

    // Calls callbacks.
    const destinationMeta = listContext.destinationMetaRef.current;
    listContext.onDragEnd({
      identifier: props.identifier,
      groupIdentifier: groupContext.identifier,
      index: props.index,
      isGroup,
      nextGroupIdentifier: destinationMeta != undefined ? destinationMeta.groupIdentifier : groupContext.identifier,
      nextIndex: destinationMeta != undefined ? destinationMeta.index : props.index,
      listIdentifier: listContext.listIdentifier,
    });
  }, [listContext.onDragEnd, groupContext.identifier, props.identifier, props.index, isGroup]);

  const onHover = React.useCallback(
    (element: HTMLElement) => {
      // Initialize if the dragging item is this item or an ancestor group of this item.
      const draggingNodeMeta = listContext.draggingNodeMeta;
      const isNeededInitialization =
        draggingNodeMeta == undefined ||
        props.identifier === draggingNodeMeta.identifier ||
        checkIsAncestorItem(draggingNodeMeta.identifier, ancestorIdentifiers);
      if (isNeededInitialization) {
        listContext.setIsVisibleDropLineElement(false);
        listContext.hoveredNodeMetaRef.current = undefined;
        listContext.destinationMetaRef.current = undefined;

        return;
      }

      listContext.setIsVisibleDropLineElement(true);
      listContext.hoveredNodeMetaRef.current = getNodeMeta(
        element,
        props.identifier,
        groupContext.identifier,
        listContext.listIdentifier,
        ancestorIdentifiers,
        props.index,
        isGroup,
      );
    },
    [
      listContext.draggingNodeMeta,
      groupContext.identifier,
      props.identifier,
      props.index,
      ancestorIdentifiers,
      isGroup,
      listContext.listIdentifier,
    ],
  );
  const onMoveForStackableGroup = React.useCallback(
    <T extends ItemIdentifier>(hoveredNodeMeta: NodeMeta<T>) => {
      // Sets contexts to values.
      listContext.setIsVisibleDropLineElement(false);
      listContext.setStackedGroupIdentifier(props.identifier);
      listContext.destinationMetaRef.current = {
        listIdentifier: listContext.listIdentifier,
        groupIdentifier: props.identifier,
        index: undefined,
      };

      // Calls callbacks.
      listContext.onStackGroup?.({
        identifier: props.identifier,
        groupIdentifier: groupContext.identifier,
        index: props.index,
        isGroup,
        nextGroupIdentifier: hoveredNodeMeta.identifier,
        listIdentifier: listContext.listIdentifier,
      });
    },
    [listContext.stackableAreaThreshold, listContext.onStackGroup, groupContext.identifier, props.identifier, props.index],
  );
  const onMoveForItems = React.useCallback(
    (draggingNodeMeta: NodeMeta<T>, hoveredNodeMeta: NodeMeta<T>, absoluteXY: [number, number]) => {
      if (isLonley) {
        listContext.setIsVisibleDropLineElement(false);
        listContext.destinationMetaRef.current = undefined;

        return;
      }
      if (draggingNodeMeta.index !== hoveredNodeMeta.index) listContext.setIsVisibleDropLineElement(true);

      const dropLineElement = listContext.dropLineElementRef.current ?? undefined;
      setDropLineElementStyle(dropLineElement, absoluteXY, hoveredNodeMeta, listContext.direction);

      // Calculates the next index.
      const dropLineDirection = getDropLineDirectionFromXY(absoluteXY, hoveredNodeMeta, listContext.direction);
      const nextIndex = getDropLinePositionItemIndex(
        dropLineDirection,
        draggingNodeMeta.index,
        draggingNodeMeta.groupIdentifier,
        hoveredNodeMeta.index,
        hoveredNodeMeta.groupIdentifier,
      );

      // Calls callbacks if needed.
      const destinationMeta = listContext.destinationMetaRef.current;
      const isComeFromStackedGroup =
        destinationMeta != undefined && destinationMeta.groupIdentifier != undefined && destinationMeta.index == undefined;
      if (isComeFromStackedGroup) {
        listContext.onStackGroup?.({
          identifier: props.identifier,
          groupIdentifier: groupContext.identifier,
          index: props.index,
          isGroup,
          nextGroupIdentifier: undefined,
          listIdentifier: listContext.listIdentifier,
        });
      }

      // Sets contexts to values.
      listContext.setStackedGroupIdentifier(undefined);
      listContext.destinationMetaRef.current = {
        listIdentifier: listContext.listIdentifier,
        groupIdentifier: groupContext.identifier,
        index: nextIndex,
      };
    },
    [
      listContext.direction,
      listContext.onStackGroup,
      groupContext.identifier,
      props.identifier,
      props.index,
      isGroup,
      isLonley,
    ],
  );
  const onMove = React.useCallback(
    (absoluteXY: [number, number]) => {
      const draggingNodeMeta = listContext.draggingNodeMeta;
      if (draggingNodeMeta == undefined) return;
      const hoveredNodeMeta = listContext.hoveredNodeMetaRef.current;
      if (hoveredNodeMeta == undefined) return;

      if (hoveredNodeMeta.listIdentifier !== listContext.listIdentifier) {
        listContext.setIsVisibleDropLineElement(false);
        return;
      }

      const hasNoItems = childIdentifiersRef.current.size === 0;
      if (
        isGroup &&
        hasNoItems &&
        checkIsInStackableArea(absoluteXY, hoveredNodeMeta, listContext.stackableAreaThreshold, listContext.direction)
      ) {
        onMoveForStackableGroup(hoveredNodeMeta);
      } else {
        onMoveForItems(draggingNodeMeta, hoveredNodeMeta, absoluteXY);
      }
    },
    [listContext.draggingNodeMeta, listContext.direction, onMoveForStackableGroup, onMoveForItems, isGroup],
  );
  const onLeave = React.useCallback(() => {
    if (listContext.draggingNodeMeta == undefined) return;

    // Clears a dragging node after 50ms in order to prevent setting and clearing at the same time.
    window.clearTimeout(clearingDraggingNodeTimeoutIdRef.current);
    clearingDraggingNodeTimeoutIdRef.current = window.setTimeout(() => {
      const hoveredMeta = listContext.hoveredNodeMetaRef.current;
      if (hoveredMeta) {
        const isDifferentList = hoveredMeta.listIdentifier !== listContext.listIdentifier;

        // if it is the same list but different identifier, we don't reset the visual feedback.
        if (!isDifferentList && hoveredMeta.identifier !== props.identifier) return;
      }

      // reset the visual feedback.
      listContext.setIsVisibleDropLineElement(false);
      listContext.setStackedGroupIdentifier(undefined);
      listContext.hoveredNodeMetaRef.current = undefined;
      listContext.destinationMetaRef.current = undefined;
    }, 50);
  }, [listContext.draggingNodeMeta, props.identifier]);

  const binder = useGesture({
    onHover: ({ event }) => {
      if (listContext.draggingNodeMeta == undefined) return;

      const element = event?.currentTarget;
      if (!(element instanceof HTMLElement)) return;

      event?.stopPropagation();
      onHover(element);
    },
    onMove: ({ xy }) => {
      if (listContext.draggingNodeMeta == undefined) return;

      const hoveredMeta = listContext.hoveredNodeMetaRef.current;
      if (hoveredMeta) {
        const isDifferentList = hoveredMeta.listIdentifier !== listContext.listIdentifier;

        if (isDifferentList) {
          // reset the visual feedback.
          listContext.setIsVisibleDropLineElement(false);
        } else {
          // Skips if this item is an ancestor group of the dragging item.
          const hasItems = childIdentifiersRef.current.size > 0;
          const hoveredNodeAncestors = listContext.hoveredNodeMetaRef.current?.ancestorIdentifiers ?? [];

          if (hasItems && checkIsAncestorItem(props.identifier, hoveredNodeAncestors)) return;
        }
      }

      if (props.identifier === listContext.draggingNodeMeta.identifier) return;
      // Skips if the dragging item is an ancestor group of this item.
      if (checkIsAncestorItem(listContext.draggingNodeMeta.identifier, ancestorIdentifiers)) return;

      onMove(xy);
    },
    onPointerLeave: onLeave,
  });
  const dragHandlers: React.ContextType<typeof ItemContext>["dragHandlers"] = { onDragStart, onDrag, onDragEnd };
  const draggableBinder = useGesture({
    onDragStart: (state: any) => {
      if (isLocked) return;

      const event: React.SyntheticEvent = state.event;
      event.persist();
      event.stopPropagation();

      dragHandlers.onDragStart();
    },
    onDrag: ({ down, movement }) => {
      if (isLocked) return;

      dragHandlers.onDrag(down, movement);
    },
    onDragEnd: () => {
      if (isLocked) return;

      dragHandlers.onDragEnd();
    },
  });

  const contentElement = React.useMemo((): JSX.Element => {
    const draggingNodeMeta = listContext.draggingNodeMeta;
    const isDragging = draggingNodeMeta != undefined && props.identifier === draggingNodeMeta.identifier;
    const { renderPlaceholder, renderStackedGroup, itemSpacing, direction } = listContext;

    const rendererMeta: Omit<PlaceholderRendererMeta<any>, "isGroup"> | StackedGroupRendererMeta<any> = {
      identifier: props.identifier,
      groupIdentifier: groupContext.identifier,
      listIdentifier: listContext.listIdentifier,
      index: props.index,
    };

    let children = props.children;
    if (isDragging && renderPlaceholder != undefined) {
      const style = getPlaceholderElementStyle(draggingNodeMeta, itemSpacing, direction);
      children = renderPlaceholder({ style }, { ...rendererMeta, isGroup });
    }
    if (listContext.stackedGroupIdentifier === props.identifier && renderStackedGroup != undefined) {
      const style = getStackedGroupElementStyle(listContext.hoveredNodeMetaRef.current, itemSpacing, direction);
      children = renderStackedGroup({ style }, rendererMeta);
    }

    const padding: [string, string] = ["0", "0"];
    if (direction === "vertical") padding[0] = `${itemSpacing / 2}px`;
    if (direction === "horizontal") padding[1] = `${itemSpacing / 2}px`;

    return (
      <div
        ref={wrapperElementRef}
        style={{ boxSizing: "border-box", position: "static", padding: padding.join(" ") }}
        {...binder()}
        {...(isUsedCustomDragHandlers ? {} : draggableBinder())}
      >
        {children}
      </div>
    );
  }, [
    listContext.draggingNodeMeta,
    listContext.renderPlaceholder,
    listContext.renderStackedGroup,
    listContext.stackedGroupIdentifier,
    listContext.itemSpacing,
    listContext.direction,
    groupContext.identifier,
    props.identifier,
    props.children,
    props.index,
    isGroup,
    isUsedCustomDragHandlers,
    binder,
    draggableBinder,
  ]);
  if (!isGroup) return <ItemContext.Provider value={{ isLocked, dragHandlers }}>{contentElement}</ItemContext.Provider>;

  return (
    <GroupContext.Provider value={{ identifier: props.identifier, ancestorIdentifiers, childIdentifiersRef }}>
      <ItemContext.Provider value={{ isLocked, dragHandlers }}>{contentElement}</ItemContext.Provider>
    </GroupContext.Provider>
  );
};
