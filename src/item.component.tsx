import * as React from "react";
import { useGesture } from "react-use-gesture";

import { checkIsInStackableArea, getDropLineDirectionFromXY, getNodeMeta, ItemIdentifier, NodeMeta } from "./shared";
import { ListContext } from "./list";
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
  className?: string;
  children?: React.ReactNode;
};

export const Item = <T extends ItemIdentifier>(props: Props<T>) => {
  const listContext = React.useContext(ListContext);
  const groupContext = React.useContext(GroupContext);

  const ancestorIdentifiers = [...groupContext.ancestorIdentifiers, props.identifier];
  const isGroup = props.isGroup ?? false;
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
    listContext.overedNodeMetaRef.current = undefined;
    listContext.destinationMetaRef.current = undefined;
  }, [listContext.onDragEnd, groupContext.identifier, props.identifier, props.index, isGroup]);

  const onMouseOver = React.useCallback(
    (element: HTMLElement) => {
      // Initialize if the dragging item is this item or an ancestor group of this item.
      const draggingNodeMeta = listContext.draggingNodeMeta;
      const isNeededInitialization =
        draggingNodeMeta == undefined ||
        props.identifier === draggingNodeMeta.identifier ||
        checkIsAncestorItem(draggingNodeMeta.identifier, true, ancestorIdentifiers);
      if (isNeededInitialization) {
        listContext.setIsVisibleDropLineElement(false);
        listContext.overedNodeMetaRef.current = undefined;
        listContext.destinationMetaRef.current = undefined;

        return;
      }

      listContext.setIsVisibleDropLineElement(true);
      listContext.overedNodeMetaRef.current = getNodeMeta(
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
  const onMouseMoveForStackableGroup = React.useCallback(
    <T extends ItemIdentifier>(overedNodeMeta: NodeMeta<T>) => {
      // Sets contexts to values.
      listContext.setIsVisibleDropLineElement(false);
      listContext.destinationMetaRef.current = {
        groupIdentifier: props.identifier,
        index: undefined,
      };

      // Calls callbacks.
      listContext.onStack?.({
        identifier: props.identifier,
        groupIdentifier: groupContext.identifier,
        index: props.index,
        isGroup,
        nextGroupIdentifier: overedNodeMeta.identifier,
      });
    },
    [listContext.stackableAreaThreshold, listContext.onStack, groupContext.identifier, props.identifier, props.index],
  );
  const onMouseMoveForItems = React.useCallback(
    (draggingNodeMeta: NodeMeta<T>, overedNodeMeta: NodeMeta<T>, absoluteXY: [number, number]) => {
      if (draggingNodeMeta.index !== overedNodeMeta.index) listContext.setIsVisibleDropLineElement(true);

      const dropLineElement = listContext.dropLineElementRef.current ?? undefined;
      setDropLineElementStyle(dropLineElement, listContext.itemSpacing, absoluteXY, overedNodeMeta);

      // Calculates the next index.
      const dropLineDirection = getDropLineDirectionFromXY(absoluteXY, overedNodeMeta);
      const nextIndex = getDropLinePositionItemIndex(
        dropLineDirection,
        draggingNodeMeta.index,
        draggingNodeMeta.groupIdentifier,
        overedNodeMeta.index,
        overedNodeMeta.groupIdentifier,
      );

      // Calls callbacks if needed.
      const destinationMeta = listContext.destinationMetaRef.current;
      const isComeFromStackedGroup =
        destinationMeta != undefined && destinationMeta.groupIdentifier != undefined && destinationMeta.index == undefined;
      if (isComeFromStackedGroup) {
        listContext.onStack?.({
          identifier: props.identifier,
          groupIdentifier: groupContext.identifier,
          index: props.index,
          isGroup,
          nextGroupIdentifier: undefined,
        });
      }

      // Sets contexts to values.
      listContext.destinationMetaRef.current = { groupIdentifier: groupContext.identifier, index: nextIndex };
    },
    [listContext.itemSpacing, listContext.onStack, groupContext.identifier, props.identifier, props.index, isGroup],
  );
  const onMouseMove = React.useCallback(
    (absoluteXY: [number, number]) => {
      const draggingNodeMeta = listContext.draggingNodeMeta;
      if (draggingNodeMeta == undefined) return;
      const overedNodeMeta = listContext.overedNodeMetaRef.current;
      if (overedNodeMeta == undefined) return;

      if (hasNoItems && checkIsInStackableArea(absoluteXY, overedNodeMeta, listContext.stackableAreaThreshold)) {
        onMouseMoveForStackableGroup(overedNodeMeta);
      } else {
        onMouseMoveForItems(draggingNodeMeta, overedNodeMeta, absoluteXY);
      }
    },
    [listContext.draggingNodeMeta, hasNoItems, onMouseMoveForStackableGroup, onMouseMoveForItems],
  );

  const binder = useGesture({
    onHover: ({ event }) => {
      if (listContext.draggingNodeMeta == undefined) return;

      const element = event?.currentTarget;
      if (!(element instanceof HTMLElement)) return;

      event?.stopPropagation();
      onMouseOver(element);
    },
    onMove: ({ xy }) => {
      if (listContext.draggingNodeMeta == undefined) return;

      // Skips if this item is an ancestor group of the dragging item.
      const overedNodeAncestors = listContext.overedNodeMetaRef.current?.ancestorIdentifiers ?? [];
      if (checkIsAncestorItem(props.identifier, !hasNoItems, overedNodeAncestors)) return;
      if (props.identifier === listContext.draggingNodeMeta.identifier) return;
      // Skips if the dragging item is an ancestor group of this item.
      if (checkIsAncestorItem(listContext.draggingNodeMeta.identifier, true, ancestorIdentifiers)) return;

      onMouseMove(xy);
    },
  });
  const draggableBinder = useGesture({
    onDragStart: (state: any) => {
      const event: React.SyntheticEvent = state.event;
      const element = event.currentTarget;
      if (!(element instanceof HTMLElement)) return;

      event.persist();
      event.stopPropagation();

      onDragStart(element);
    },
    onDrag: ({ down, movement }) => {
      if (!down) return;

      moveGhostElement(listContext.ghostWrapperElementRef.current ?? undefined, movement);
    },
    onDragEnd,
  });

  const contentElement = React.useMemo((): JSX.Element => {
    const draggingNodeMeta = listContext.draggingNodeMeta;
    const isDragging = draggingNodeMeta != undefined && props.identifier === draggingNodeMeta.identifier;
    const placeholderRenderer = listContext.renderPlaceholder;

    const style: React.CSSProperties = {
      boxSizing: "border-box",
      position: "static",
      margin: `${listContext.itemSpacing}px 0`,
    };

    if (isDragging && placeholderRenderer != undefined) {
      return placeholderRenderer(
        {
          binder,
          style: { ...style, width: draggingNodeMeta?.width, height: draggingNodeMeta?.height },
        },
        {
          identifier: props.identifier,
          groupIdentifier: groupContext.identifier,
          index: props.index,
          isGroup,
        },
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
    listContext.renderPlaceholder,
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
