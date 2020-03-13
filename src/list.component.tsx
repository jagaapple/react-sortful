import * as React from "react";
import { useGesture } from "react-use-gesture";

import {
  BaseItemIdentifier,
  DestinationMeta,
  getDropLineDirectionFromXY,
  getDropLinePosition,
  getNodeMeta,
  Item,
  ItemIdentifierHandlerMeta,
  nodeIndexDataAttribute,
  NodeMeta,
  Tree,
} from "./react-sortful";

export type ItemElementInjectedProps = Record<string, any>;
export type ItemElementDraggable = () => Record<any, any>;

type Props<ItemIdentifier extends BaseItemIdentifier> = {
  className?: string;
  dropLineClassName: string;
  ghostClassName?: string;
  itemSpacing?: number;
  items: Item<ItemIdentifier>[];
  handleItemIdentifier: (
    meta: ItemIdentifierHandlerMeta<ItemIdentifier>,
    props: ItemElementInjectedProps,
    draggable: ItemElementDraggable,
  ) => JSX.Element;
  onDragEnd: (meta: DestinationMeta<ItemIdentifier>) => void;
  isDisabled?: boolean;
};

export const List = <T extends BaseItemIdentifier>(props: Props<T>) => {
  const [draggingItemIdentifierState, setDraggingItemIdentifierState] = React.useState<T>();

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const ghostElementRef = React.useRef<HTMLElement>();
  const draggingNodeMetaRef = React.useRef<NodeMeta>();
  const overedNodeMetaRef = React.useRef<NodeMeta>();
  const destinationNodeMetaRef = React.useRef<{ itemIdentifier: T; nextIndex: number }>();

  const tree = React.useMemo(() => new Tree(props.items), [props.items]);
  const itemSpacing = props.itemSpacing ?? 8;

  const setGhostElement = React.useCallback(
    (itemElement: HTMLElement) => {
      const ghostWrapperElement = ghostWrapperElementRef.current;
      if (ghostWrapperElement == undefined) return;
      const ghostElement = ghostWrapperElement.appendChild(itemElement.cloneNode(true));
      if (!(ghostElement instanceof HTMLElement)) return;

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
    (element: HTMLElement, absoluteXY: [number, number]) => {
      setGhostElement(element);
      setDropLinePositionElement(absoluteXY, getNodeMeta(element));

      // Disables to select elements in entire page.
      document.body.style.userSelect = "none";

      draggingNodeMetaRef.current = getNodeMeta(element);

      const node = tree.nodes[draggingNodeMetaRef.current.index];
      setDraggingItemIdentifierState(node.identifier);
    },
    [setGhostElement, setDropLinePositionElement, tree],
  );
  const onDrag = React.useCallback((movementXY: [number, number]) => {
    const ghostWrapperElement = ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;

    const [x, y] = movementXY;
    ghostWrapperElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);
  const onDragEnd = React.useCallback(() => {
    clearGhostElement();
    setDraggingItemIdentifierState(undefined);

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
  const onMouseOver = React.useCallback((element: HTMLElement) => {
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

  const binder = useGesture({
    onHover: ({ event }) => {
      if (draggingItemIdentifierState == undefined) return;

      const element = event.currentTarget;
      if (!(element instanceof HTMLElement)) return;

      onMouseOver(element);
    },
    onMove: ({ xy }) => {
      if (draggingItemIdentifierState == undefined) return;

      onMouseMove(xy);
    },
  });
  const draggableBinder = useGesture({
    onDragStart: ({ event, xy }) => {
      if (props.isDisabled) return;

      let element: HTMLElement | SVGElement | undefined = event.currentTarget;
      if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (element == undefined) break;
        if (element.getAttribute(nodeIndexDataAttribute) != undefined) break;

        element = element.parentElement ?? undefined;
      }
      if (element == undefined) return;
      if (!(element instanceof HTMLElement)) return;

      onDragStart(element, xy);
    },
    onDrag: ({ down, movement }) => {
      if (!down) return;

      onDrag(movement);
    },
    onDragEnd,
  });

  const itemElements = React.useMemo(
    () =>
      tree.nodes.map((node, index) => {
        const isFirstItem = index === 0;
        const element = props.handleItemIdentifier(
          {
            identifier: node.identifier,
            index,
            isDragging: draggingItemIdentifierState === node.identifier,
          },
          {
            ...binder(),
            ...{ [nodeIndexDataAttribute]: index },
            style: { boxSizing: "border-box", marginTop: isFirstItem ? undefined : itemSpacing },
          },
          draggableBinder,
        );

        return <React.Fragment key={node.identifier}>{element}</React.Fragment>;
      }),
    [tree, props.handleItemIdentifier, binder, draggingItemIdentifierState, draggableBinder],
  );

  const dropLineElementStyle: React.CSSProperties = {
    display: draggingItemIdentifierState != undefined ? "block" : "none",
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
