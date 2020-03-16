import * as React from "react";
import { useGesture } from "react-use-gesture";

import { ItemIdentifier } from "./item";
import { getNodeMeta, NodeMeta } from "./node";
import { getDropLineDirectionFromXY, getDropLinePosition } from "./drop-line";
import { ListContext } from "./list.component";
import { GroupContext } from "./group.component";

type Props<T extends ItemIdentifier> = {
  className?: string;
  identifier: T;
  index: number;
  children?: React.ReactNode;
};

export const Item = <T extends ItemIdentifier>(props: Props<T>) => {
  const listContext = React.useContext(ListContext);
  const groupContext = React.useContext(GroupContext);

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

      const nodeMeta = getNodeMeta(element, props.identifier, groupContext.identifier, props.index, false);
      listContext.setDraggingNodeMeta(nodeMeta);
      listContext.onDragStart?.({
        identifier: nodeMeta.identifier,
        groupIdentifier: nodeMeta.groupIdentifier,
        index: nodeMeta.index,
        isGroup: nodeMeta.isGroup,
      });
    },
    [listContext.onDragStart, groupContext.identifier, props.identifier, props.index, setGhostElement],
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
      isGroup: false,
      nextGroupIdentifier: destinationMeta?.groupIdentifier ?? groupContext.identifier,
      nextIndex: destinationMeta?.index ?? props.index,
    });

    listContext.setDraggingNodeMeta(undefined);
    listContext.overedNodeMetaRef.current = undefined;
    listContext.destinationMetaRef.current = undefined;
  }, [listContext.onDragEnd, groupContext.identifier, props.identifier, props.index, clearGhostElement]);

  const onMouseOver = React.useCallback(
    (element: HTMLElement) => {
      listContext.overedNodeMetaRef.current = getNodeMeta(
        element,
        props.identifier,
        groupContext.identifier,
        props.index,
        false,
      );
    },
    [groupContext.identifier, props.identifier, props.index],
  );
  const onMouseMove = React.useCallback(
    (absoluteXY: [number, number]) => {
      const draggingNodeMeta = listContext.draggingNodeMeta;
      if (draggingNodeMeta == undefined) return;
      const overedNodeMeta = listContext.overedNodeMetaRef.current;
      if (overedNodeMeta == undefined) return;
      const dropLineElement = listContext.dropLineElementRef.current;
      if (dropLineElement == undefined) return;

      if (draggingNodeMeta.index !== overedNodeMeta.index) listContext.setIsVisibleDropLineElement(true);

      setDropLinePositionElement(absoluteXY, overedNodeMeta);

      const dropLineDirection = getDropLineDirectionFromXY(absoluteXY, overedNodeMeta);
      let nextIndex = draggingNodeMeta.index;
      if (dropLineDirection === "TOP") nextIndex = overedNodeMeta.index;
      if (dropLineDirection === "BOTTOM") nextIndex = overedNodeMeta.index + 1;
      if (draggingNodeMeta.index < nextIndex) nextIndex -= 1;

      listContext.destinationMetaRef.current = {
        groupIdentifier: groupContext.identifier,
        index: nextIndex,
      };
    },
    [listContext.draggingNodeMeta, groupContext.identifier],
  );

  const binder = useGesture({
    onHover: ({ event }) => {
      if (listContext.draggingNodeMeta == undefined) return;

      const element = event.currentTarget;
      if (!(element instanceof HTMLElement)) return;

      onMouseOver(element);
    },
    onMove: ({ xy }) => {
      if (listContext.draggingNodeMeta == undefined) return;

      onMouseMove(xy);
    },
  });
  const draggableBinder = useGesture({
    onDragStart: ({ event }) => {
      const element = event.currentTarget;
      if (!(element instanceof HTMLElement)) return;

      onDragStart(element);
    },
    onDrag: ({ down, movement }) => {
      if (!down) return;

      onDrag(movement);
    },
    onDragEnd,
  });

  return (
    <div
      className={props.className}
      style={{ boxSizing: "border-box", margin: `${listContext.itemSpacing}px 0` }}
      {...binder()}
      {...draggableBinder()}
    >
      {props.children}
    </div>
  );
};
