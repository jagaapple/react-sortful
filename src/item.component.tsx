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
  initializeGhostElementStyle,
  moveGhostElement,
  setBodyStyle,
  setDropLineElementStyle,
} from "./item";

type Props<T extends ItemIdentifier> = {
  /** A unique identifier in all items in a root list. */
  identifier: T;
  /** A unique and sequential index number in a parent group. */
  index: number;
  /**
   * Whether this item contains child items.
   * @default false
   */
  isGroup?: boolean;
  /**
   * Whether child items are not able to move and drag.
   * Stacking and popping will be allowed. Grandchild items will not be affected.
   * @default false
   */
  isDisabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const Item = <T extends ItemIdentifier>(props: Props<T>) => {
  const listContext = React.useContext(ListContext);
  const groupContext = React.useContext(GroupContext);

  const ancestorIdentifiers = [...groupContext.ancestorIdentifiers, props.identifier];
  const isGroup = props.isGroup ?? false;
  const isDisabled = (listContext.isDisabled || props.isDisabled) ?? false;
  const hasNoItems =
    isGroup &&
    React.useMemo(() => React.Children.toArray(props.children).filter((child: any) => child.type === Item).length === 0, [
      props.children,
    ]);

  const onDragStart = React.useCallback(
    (element: HTMLElement) => {
      setBodyStyle(document.body);
      initializeGhostElementStyle(element, listContext.ghostWrapperElementRef.current ?? undefined);

      // Sets contexts to values.
      const nodeMeta = getNodeMeta(
        element,
        props.identifier,
        groupContext.identifier,
        ancestorIdentifiers,
        props.index,
        isGroup,
      );
      listContext.setDraggingNodeMeta(nodeMeta);

      // Calls callbacks.
      listContext.onDragStart?.({
        identifier: nodeMeta.identifier,
        groupIdentifier: nodeMeta.groupIdentifier,
        index: nodeMeta.index,
        isGroup: nodeMeta.isGroup,
      });
    },
    [listContext.onDragStart, groupContext.identifier, props.identifier, props.index, ancestorIdentifiers, isGroup],
  );
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
    });

    // Resets context values.
    listContext.setDraggingNodeMeta(undefined);
    listContext.setIsVisibleDropLineElement(false);
    listContext.setStackedGroupIdentifier(undefined);
    listContext.hoveredNodeMetaRef.current = undefined;
    listContext.destinationMetaRef.current = undefined;
  }, [listContext.onDragEnd, groupContext.identifier, props.identifier, props.index, isGroup]);

  const onHover = React.useCallback(
    (element: HTMLElement) => {
      // Initialize if the dragging item is this item or an ancestor group of this item.
      const draggingNodeMeta = listContext.draggingNodeMeta;
      const isNeededInitialization =
        draggingNodeMeta == undefined ||
        props.identifier === draggingNodeMeta.identifier ||
        checkIsAncestorItem(draggingNodeMeta.identifier, true, ancestorIdentifiers);
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
        ancestorIdentifiers,
        props.index,
        isGroup,
      );
    },
    [listContext.draggingNodeMeta, groupContext.identifier, props.identifier, props.index, ancestorIdentifiers, isGroup],
  );
  const onMoveForStackableGroup = React.useCallback(
    <T extends ItemIdentifier>(hoveredNodeMeta: NodeMeta<T>) => {
      // Sets contexts to values.
      listContext.setIsVisibleDropLineElement(false);
      listContext.setStackedGroupIdentifier(props.identifier);
      listContext.destinationMetaRef.current = {
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
      });
    },
    [listContext.stackableAreaThreshold, listContext.onStackGroup, groupContext.identifier, props.identifier, props.index],
  );
  const onMoveForItems = React.useCallback(
    (draggingNodeMeta: NodeMeta<T>, hoveredNodeMeta: NodeMeta<T>, absoluteXY: [number, number]) => {
      if (draggingNodeMeta.index !== hoveredNodeMeta.index) listContext.setIsVisibleDropLineElement(true);

      const dropLineElement = listContext.dropLineElementRef.current ?? undefined;
      setDropLineElementStyle(dropLineElement, listContext.itemSpacing, absoluteXY, hoveredNodeMeta, listContext.direction);

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
        });
      }

      // Sets contexts to values.
      listContext.setStackedGroupIdentifier(undefined);
      listContext.destinationMetaRef.current = { groupIdentifier: groupContext.identifier, index: nextIndex };
    },
    [
      listContext.itemSpacing,
      listContext.direction,
      listContext.onStackGroup,
      groupContext.identifier,
      props.identifier,
      props.index,
      isGroup,
    ],
  );
  const onMove = React.useCallback(
    (absoluteXY: [number, number]) => {
      const draggingNodeMeta = listContext.draggingNodeMeta;
      if (draggingNodeMeta == undefined) return;
      const hoveredNodeMeta = listContext.hoveredNodeMetaRef.current;
      if (hoveredNodeMeta == undefined) return;

      if (
        hasNoItems &&
        checkIsInStackableArea(absoluteXY, hoveredNodeMeta, listContext.stackableAreaThreshold, listContext.direction)
      ) {
        onMoveForStackableGroup(hoveredNodeMeta);
      } else {
        onMoveForItems(draggingNodeMeta, hoveredNodeMeta, absoluteXY);
      }
    },
    [listContext.draggingNodeMeta, listContext.direction, hasNoItems, onMoveForStackableGroup, onMoveForItems],
  );

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

      // Skips if this item is an ancestor group of the dragging item.
      const hoveredNodeAncestors = listContext.hoveredNodeMetaRef.current?.ancestorIdentifiers ?? [];
      if (checkIsAncestorItem(props.identifier, !hasNoItems, hoveredNodeAncestors)) return;
      if (props.identifier === listContext.draggingNodeMeta.identifier) return;
      // Skips if the dragging item is an ancestor group of this item.
      if (checkIsAncestorItem(listContext.draggingNodeMeta.identifier, true, ancestorIdentifiers)) return;

      onMove(xy);
    },
  });
  const draggableBinder = useGesture({
    onDragStart: (state: any) => {
      const event: React.SyntheticEvent = state.event;
      const element = event.currentTarget;
      if (!(element instanceof HTMLElement)) return;

      event.persist();
      event.stopPropagation();

      if (isDisabled) return;

      onDragStart(element);
    },
    onDrag: ({ down, movement }) => {
      if (isDisabled) return;
      if (!down) return;

      moveGhostElement(listContext.ghostWrapperElementRef.current ?? undefined, movement);
    },
    onDragEnd: () => {
      if (isDisabled) return;

      onDragEnd();
    },
  });

  const contentElement = React.useMemo((): JSX.Element => {
    const draggingNodeMeta = listContext.draggingNodeMeta;
    const isDragging = draggingNodeMeta != undefined && props.identifier === draggingNodeMeta.identifier;
    const placeholderRenderer = listContext.renderPlaceholder;
    const stackedGroupRenderer = listContext.renderStackedGroup;

    const margin: [string, string, string, string] = ["0", "0", "0", "0"];
    if (listContext.direction === "vertical") margin[2] = `${listContext.itemSpacing}px`;
    if (listContext.direction === "horizontal") margin[1] = `${listContext.itemSpacing}px`;
    const style: React.CSSProperties = {
      boxSizing: "border-box",
      position: "static",
      margin: margin.join(" "),
    };
    const rendererMeta: Omit<PlaceholderRendererMeta<any>, "isGroup"> | StackedGroupRendererMeta<any> = {
      identifier: props.identifier,
      groupIdentifier: groupContext.identifier,
      index: props.index,
    };
    if (listContext.stackedGroupIdentifier === props.identifier && stackedGroupRenderer != undefined) {
      const hoveredNodeMeta = listContext.hoveredNodeMetaRef.current;

      return stackedGroupRenderer(
        { binder, style: { ...style, width: hoveredNodeMeta?.width, height: hoveredNodeMeta?.height } },
        rendererMeta,
      );
    }
    if (isDragging && placeholderRenderer != undefined) {
      return placeholderRenderer(
        { binder, style: { ...style, width: draggingNodeMeta?.width, height: draggingNodeMeta?.height } },
        { ...rendererMeta, isGroup },
      );
    }

    return (
      <div className={props.className} style={style} {...binder()} {...draggableBinder()}>
        {props.children}
      </div>
    );
  }, [
    listContext.draggingNodeMeta,
    listContext.itemSpacing,
    listContext.stackedGroupIdentifier,
    listContext.renderPlaceholder,
    listContext.direction,
    groupContext.identifier,
    props.className,
    props.identifier,
    props.children,
    props.index,
    isGroup,
    binder,
    draggableBinder,
  ]);
  if (!isGroup) return contentElement;

  return (
    <GroupContext.Provider value={{ identifier: props.identifier, ancestorIdentifiers, hasNoItems }}>
      {contentElement}
    </GroupContext.Provider>
  );
};
