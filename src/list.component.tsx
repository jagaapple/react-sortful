import * as React from "react";
import { useGesture } from "react-use-gesture";

import {
  BaseItemIdentifier,
  DestinationMeta,
  getDropLineDirectionFromXY,
  getDropLinePosition,
  getNodeMeta,
  Item,
  nodeIndexDataAttribute,
  NodeMeta,
  Tree,
} from "./react-sortful";

type Props<ItemIdentifier extends BaseItemIdentifier> = {
  className?: string;
  dropLineClassName: string;
  ghostClassName?: string;
  itemClassName?: string;
  itemSpacing?: number;
  items: Item<ItemIdentifier>[];
  handleItemIdentifier: (itemIdentifier: ItemIdentifier, index: number) => JSX.Element;
  onDragEnd: (meta: DestinationMeta<ItemIdentifier>) => void;
};

export const List = <T extends BaseItemIdentifier>(props: Props<T>) => {
  const [isDraggingAnyNodeState, setIsDraggingAnyNodeState] = React.useState(false);

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const ghostElementRef = React.useRef<HTMLDivElement>();
  const draggingNodeMetaRef = React.useRef<NodeMeta>();
  const overedNodeMetaRef = React.useRef<NodeMeta>();
  const destinationNodeMetaRef = React.useRef<{ itemIdentifier: T; nextIndex: number }>();

  const tree = React.useMemo(() => new Tree(props.items), [props.items]);
  const itemSpacing = props.itemSpacing ?? 8;

  const setGhostElement = React.useCallback(
    (itemElement: HTMLDivElement) => {
      const ghostWrapperElement = ghostWrapperElementRef.current;
      if (ghostWrapperElement == undefined) return;
      const ghostElement = ghostWrapperElement.appendChild(itemElement.cloneNode(true));
      if (!(ghostElement instanceof HTMLDivElement)) return;

      const elementRect = itemElement.getBoundingClientRect();
      ghostWrapperElement.style.top = `${elementRect.top}px`;
      ghostWrapperElement.style.left = `${elementRect.left}px`;
      ghostWrapperElement.style.width = `${elementRect.width}px`;
      ghostWrapperElement.style.height = `${elementRect.height}px`;

      ghostElement.removeAttribute("style");
      ghostElement.style.width = "100%";
      ghostElement.style.height = "100%";
      ghostElement.classList.add(...(props.ghostClassName ?? "").split(" "));
      ghostElementRef.current = ghostElement;
    },
    [props.ghostClassName],
  );
  const clearGhostElement = React.useCallback(() => {
    const ghostWrapperElement = ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;
    const ghostElement = ghostElementRef.current;
    if (ghostElement == undefined) return;

    ghostWrapperElement.style.width = "0";
    ghostWrapperElement.style.height = "0";
    ghostWrapperElement.removeChild(ghostElement);
  }, []);
  const setDropLinePositionElement = React.useCallback(
    (absoluteXY: [number, number], nodeMeta: NodeMeta) => {
      const dropLineElement = dropLineElementRef.current;
      if (dropLineElement == undefined) return;

      const dropLinePosition = getDropLinePosition(absoluteXY, nodeMeta, itemSpacing);
      dropLineElement.style.top = `${dropLinePosition.top}px`;
      dropLineElement.style.left = `${dropLinePosition.left}px`;
      dropLineElement.style.top = `${dropLinePosition.top}px`;
      dropLineElement.style.left = `${dropLinePosition.left}px`;
    },
    [itemSpacing],
  );

  const onDragStart = React.useCallback(
    (element: HTMLDivElement, absoluteXY: [number, number]) => {
      setGhostElement(element);
      setIsDraggingAnyNodeState(true);
      setDropLinePositionElement(absoluteXY, getNodeMeta(element));

      // Disables to select elements in entire page.
      document.body.style.userSelect = "none";

      draggingNodeMetaRef.current = getNodeMeta(element);
    },
    [setGhostElement, setDropLinePositionElement],
  );
  const onDrag = React.useCallback((movementXY: [number, number]) => {
    const ghostWrapperElement = ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;

    const [x, y] = movementXY;
    ghostWrapperElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);
  const onDragEnd = React.useCallback(() => {
    clearGhostElement();
    setIsDraggingAnyNodeState(false);

    // Enables to select elements in entire page.
    document.body.style.userSelect = "auto";

    const destinationNodeMeta = destinationNodeMetaRef.current;
    if (destinationNodeMeta != undefined) {
      const node = tree.findByItemIdentifier(destinationNodeMeta.itemIdentifier);
      const index = tree.getIndexByItemIdentifier(node.identifier);

      props.onDragEnd({
        itemIdentifier: node.identifier,
        parentItemIdentifier: node.parentItemIdentifier,
        index,
        nextParentItemIdentifier: node.parentItemIdentifier,
        nextIndex: destinationNodeMeta.nextIndex,
      });
    }

    draggingNodeMetaRef.current = undefined;
    overedNodeMetaRef.current = undefined;
    destinationNodeMetaRef.current = undefined;
  }, [clearGhostElement, tree, props.onDragEnd]);
  const onMouseOver = React.useCallback((element: HTMLDivElement) => {
    overedNodeMetaRef.current = getNodeMeta(element);
  }, []);
  const onMouseMove = React.useCallback(
    (absoluteXY: [number, number]) => {
      const draggingNodeMeta = draggingNodeMetaRef.current;
      if (draggingNodeMeta == undefined) return;
      const overedNodeMeta = overedNodeMetaRef.current;
      if (overedNodeMeta == undefined) return;
      const dropLineElement = dropLineElementRef.current;
      if (dropLineElement == undefined) return;

      setDropLinePositionElement(absoluteXY, overedNodeMeta);

      const dropLineDirection = getDropLineDirectionFromXY(absoluteXY, overedNodeMeta);
      let nextIndex = draggingNodeMeta.index;
      if (dropLineDirection === "TOP") nextIndex = overedNodeMeta.index;
      if (dropLineDirection === "BOTTOM") nextIndex = overedNodeMeta.index + 1;
      if (draggingNodeMeta.index < nextIndex) nextIndex -= 1;

      const node = tree.nodes[draggingNodeMeta.index];
      if (node == undefined) throw new Error("Could not find a node");
      destinationNodeMetaRef.current = { itemIdentifier: node.identifier, nextIndex };
    },
    [setDropLinePositionElement, tree],
  );

  const bind = useGesture({
    onDrag: ({ down, movement }) => {
      if (!down) return;

      onDrag(movement);
    },
    onDragStart: ({ event, xy }) => {
      const element = event.currentTarget;
      if (!(element instanceof HTMLDivElement)) return;

      onDragStart(element, xy);
    },
    onDragEnd,
    onHover: ({ event }) => {
      if (!isDraggingAnyNodeState) return;

      const element = event.currentTarget;
      if (!(element instanceof HTMLDivElement)) return;

      onMouseOver(element);
    },
    onMove: ({ xy }) => {
      if (!isDraggingAnyNodeState) return;

      onMouseMove(xy);
    },
  });

  const itemElements = React.useMemo(
    () =>
      tree.nodes.map((node, index) => {
        const element = props.handleItemIdentifier(node.identifier, index);
        const isFirstItem = index === 0;

        return (
          <React.Fragment key={node.identifier}>
            <div
              className={props.itemClassName}
              style={{ boxSizing: "border-box", marginTop: isFirstItem ? undefined : itemSpacing }}
              {...bind()}
              {...{ [nodeIndexDataAttribute]: index }}
            >
              {element}
            </div>
          </React.Fragment>
        );
      }),
    [tree, props.handleItemIdentifier, bind, props.itemClassName],
  );

  const dropLineElementStyle: React.CSSProperties = {
    display: isDraggingAnyNodeState ? "block" : "none",
    position: "absolute",
    transform: "translate(0, -50%)",
  };
  const ghostWrapperElementStyle: React.CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
  };

  return (
    <div className={props.className} style={{ position: "relative" }}>
      {itemElements}

      <div className={props.dropLineClassName} ref={dropLineElementRef} style={dropLineElementStyle} />
      <span ref={ghostWrapperElementRef} style={ghostWrapperElementStyle} />
    </div>
  );
};
