import * as React from "react";
import { useGesture } from "react-use-gesture";

import {
  checkIsInStackableArea,
  getDropLineDirectionFromXY,
  getDropLinePosition,
  getNodeMeta,
  ItemIdentifier,
  NodeMeta,
} from "./shared";
import { ListContext } from "./list";
import { GroupContext } from "./groups";

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

  const setGhostElement = React.useCallback((itemElement: HTMLElement) => {
    const ghostWrapperElement = listContext.ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;

    const elementRect = itemElement.getBoundingClientRect();
    ghostWrapperElement.style.top = `${elementRect.top}px`;
    ghostWrapperElement.style.left = `${elementRect.left}px`;
    ghostWrapperElement.style.width = `${elementRect.width}px`;
    ghostWrapperElement.style.height = `${elementRect.height}px`;
  }, []);
  const clearGhostElement = React.useCallback(() => {
    const ghostWrapperElement = listContext.ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;

    ghostWrapperElement.style.removeProperty("width");
    ghostWrapperElement.style.removeProperty("height");
  }, []);
  const setDropLinePositionElement = React.useCallback(
    (absoluteXY: [number, number], nodeMeta: NodeMeta<T>) => {
      const dropLineElement = listContext.dropLineElementRef.current;
      if (dropLineElement == undefined) return;

      const dropLinePosition = getDropLinePosition(absoluteXY, nodeMeta, listContext.itemSpacing);
      dropLineElement.style.top = `${dropLinePosition.top}px`;
      dropLineElement.style.left = `${dropLinePosition.left}px`;
      dropLineElement.style.width = `${nodeMeta.width}px`;
    },
    [listContext.itemSpacing],
  );

  const onDragStart = React.useCallback(
    (element: HTMLElement) => {
      setGhostElement(element);

      // Disables to select elements in entire page.
      document.body.style.userSelect = "none";

      const nodeMeta = getNodeMeta(
        element,
        props.identifier,
        groupContext.identifier,
        ancestorIdentifiers,
        props.index,
        isGroup,
      );
      listContext.setDraggingNodeMeta(nodeMeta);
      listContext.onDragStart?.({
        identifier: nodeMeta.identifier,
        groupIdentifier: nodeMeta.groupIdentifier,
        index: nodeMeta.index,
        isGroup: nodeMeta.isGroup,
      });
    },
    [
      listContext.onDragStart,
      groupContext.identifier,
      props.identifier,
      props.index,
      ancestorIdentifiers,
      isGroup,
      setGhostElement,
    ],
  );
  const onDrag = React.useCallback((movementXY: [number, number]) => {
    const ghostWrapperElement = listContext.ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;

    const [x, y] = movementXY;
    ghostWrapperElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);
  const onDragEnd = React.useCallback(() => {
    clearGhostElement();
    listContext.setDraggingNodeMeta(undefined);
    listContext.setIsVisibleDropLineElement(false);

    // Enables to select elements in entire page.
    document.body.style.removeProperty("user-select");

    const destinationMeta = listContext.destinationMetaRef.current;
    listContext.onDragEnd({
      identifier: props.identifier,
      groupIdentifier: groupContext.identifier,
      index: props.index,
      isGroup: isGroup,
      nextGroupIdentifier: destinationMeta != undefined ? destinationMeta.groupIdentifier : groupContext.identifier,
      nextIndex: destinationMeta != undefined ? destinationMeta.index : props.index,
    });

    listContext.setDraggingNodeMeta(undefined);
    listContext.overedNodeMetaRef.current = undefined;
    listContext.destinationMetaRef.current = undefined;
  }, [listContext.onDragEnd, groupContext.identifier, props.identifier, props.index, isGroup, clearGhostElement]);

  const onMouseOver = React.useCallback(
    (element: HTMLElement) => {
      listContext.overedNodeMetaRef.current = getNodeMeta(
        element,
        props.identifier,
        groupContext.identifier,
        ancestorIdentifiers,
        props.index,
        isGroup,
      );
    },
    [groupContext.identifier, props.identifier, props.index, ancestorIdentifiers, isGroup],
  );
  const onMouseMove = React.useCallback(
    (absoluteXY: [number, number]) => {
      const draggingNodeMeta = listContext.draggingNodeMeta;
      if (draggingNodeMeta == undefined) return;
      const overedNodeMeta = listContext.overedNodeMetaRef.current;
      if (overedNodeMeta == undefined) return;
      const dropLineElement = listContext.dropLineElementRef.current;
      if (dropLineElement == undefined) return;

      if (hasNoItems) {
        const isInStackableArea = checkIsInStackableArea(absoluteXY, overedNodeMeta, listContext.stackableAreaThreshold);
        if (isInStackableArea) {
          listContext.setIsVisibleDropLineElement(false);

          listContext.onStack?.({
            identifier: props.identifier,
            groupIdentifier: groupContext.identifier,
            index: props.index,
            isGroup,
            nextGroupIdentifier: overedNodeMeta.identifier,
          });
          listContext.destinationMetaRef.current = {
            groupIdentifier: props.identifier,
            index: undefined,
          };

          return;
        }
      }

      if (draggingNodeMeta.index !== overedNodeMeta.index) listContext.setIsVisibleDropLineElement(true);

      setDropLinePositionElement(absoluteXY, overedNodeMeta);

      const dropLineDirection = getDropLineDirectionFromXY(absoluteXY, overedNodeMeta);
      let nextIndex = draggingNodeMeta.index;
      if (dropLineDirection === "TOP") nextIndex = overedNodeMeta.index;
      if (dropLineDirection === "BOTTOM") nextIndex = overedNodeMeta.index + 1;
      const isInSameGroup = draggingNodeMeta.groupIdentifier === overedNodeMeta.groupIdentifier;
      if (isInSameGroup && draggingNodeMeta.index < nextIndex) nextIndex -= 1;

      if (
        listContext.destinationMetaRef.current != undefined &&
        listContext.destinationMetaRef.current.groupIdentifier != undefined &&
        listContext.destinationMetaRef.current.index == undefined
      ) {
        listContext.onStack?.({
          identifier: props.identifier,
          groupIdentifier: groupContext.identifier,
          index: props.index,
          isGroup,
          nextGroupIdentifier: undefined,
        });
      }

      listContext.destinationMetaRef.current = {
        groupIdentifier: groupContext.identifier,
        index: nextIndex,
      };
    },
    [
      listContext.draggingNodeMeta,
      listContext.onStack,
      listContext.stackableAreaThreshold,
      groupContext.identifier,
      props.identifier,
      props.index,
      isGroup,
      hasNoItems,
    ],
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
      if (isGroup && !hasNoItems) {
        const overedNodeAncestorIdentifiers = listContext.overedNodeMetaRef.current?.ancestorIdentifiers ?? [];
        const ancestorIdentifiersWithoutOveredNode = [...overedNodeAncestorIdentifiers];
        ancestorIdentifiersWithoutOveredNode.pop();

        if (ancestorIdentifiersWithoutOveredNode.includes(props.identifier)) return;
      }

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

      onDrag(movement);
    },
    onDragEnd,
  });

  const element = (
    <div
      className={props.className}
      style={{ boxSizing: "border-box", position: "static", margin: `${listContext.itemSpacing}px 0` }}
      {...binder()}
      {...draggableBinder()}
    >
      {props.children}
    </div>
  );
  if (!isGroup) return element;

  return (
    <GroupContext.Provider value={{ identifier: props.identifier, ancestorIdentifiers, hasNoItems }}>
      {element}
    </GroupContext.Provider>
  );
};
