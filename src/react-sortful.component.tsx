import * as React from "react";
import { useGesture } from "react-use-gesture";

import {
  DestinationMeta,
  getDropLineDirectionFromXY,
  getDropLinePosition,
  getNodeMeta,
  NodeIdentifier,
  nodeIdentifierDataAttribute,
  nodeIndexDataAttribute,
  NodeMeta,
  normalizeTree,
  Tree,
} from "./react-sortful";

type Props = {
  className?: string;
  dropLineClassName: string;
  ghostClassName?: string;
  nodeClassName?: string;
  nodeSpacing?: number;
  tree: Tree;
  handleNodeIdentifier: (nodeIdentifier: NodeIdentifier, index: number) => JSX.Element;
  onDragEnd: (meta: DestinationMeta) => void;
};

export const ReactSortful = (props: Props) => {
  const [isDraggingAnyNodeState, setIsDraggingAnyNodeState] = React.useState(false);

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const ghostElementRef = React.useRef<HTMLDivElement>();
  const draggingNodeMetaRef = React.useRef<NodeMeta>();
  const overedNodeMetaRef = React.useRef<NodeMeta>();
  const destinationMetaRef = React.useRef<DestinationMeta>();

  const normalizedTree = React.useMemo(() => normalizeTree(props.tree), [props.tree]);
  const nodeSpacing = props.nodeSpacing ?? 8;

  const setGhostElement = React.useCallback(
    (nodeElement: HTMLDivElement) => {
      const ghostWrapperElement = ghostWrapperElementRef.current;
      if (ghostWrapperElement == undefined) return;
      const ghostElement = ghostWrapperElement.appendChild(nodeElement.cloneNode(true));
      if (!(ghostElement instanceof HTMLDivElement)) return;

      const elementRect = nodeElement.getBoundingClientRect();
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

      const dropLinePosition = getDropLinePosition(absoluteXY, nodeMeta, nodeSpacing);
      dropLineElement.style.top = `${dropLinePosition.top}px`;
      dropLineElement.style.left = `${dropLinePosition.left}px`;
      dropLineElement.style.top = `${dropLinePosition.top}px`;
      dropLineElement.style.left = `${dropLinePosition.left}px`;
    },
    [nodeSpacing],
  );

  const onDragStart = React.useCallback(
    (element: HTMLDivElement, absoluteXY: [number, number]) => {
      setGhostElement(element);
      setIsDraggingAnyNodeState(true);
      setDropLinePositionElement(absoluteXY, getNodeMeta(element));

      // Disables to select nodes in entire page.
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

    // Enables to select nodes in entire page.
    document.body.style.userSelect = "auto";

    const destinationMeta = destinationMetaRef.current;
    if (destinationMeta != undefined) props.onDragEnd(destinationMeta);

    draggingNodeMetaRef.current = undefined;
    overedNodeMetaRef.current = undefined;
    destinationMetaRef.current = undefined;
  }, [clearGhostElement, props.onDragEnd]);
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
      const { parentIdentifier } = normalizedTree[overedNodeMeta.index];
      let nextIndex = draggingNodeMeta.index;
      if (dropLineDirection === "TOP") nextIndex = overedNodeMeta.index;
      if (dropLineDirection === "BOTTOM") nextIndex = overedNodeMeta.index + 1;
      if (draggingNodeMeta.index < nextIndex) nextIndex -= 1;
      destinationMetaRef.current = {
        nodeIdentifier: draggingNodeMeta.nodeIdentifier,
        previousParentNodeIdentifier: normalizedTree[draggingNodeMeta.index].parentIdentifier,
        previousIndex: draggingNodeMeta.index,
        parentNodeIdentifier: parentIdentifier,
        index: nextIndex,
      };
    },
    [setDropLinePositionElement, normalizedTree],
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

  const nodeElements = React.useMemo(
    () =>
      Array.from(normalizedTree.values()).map((normalizedNode, index) => {
        const element = props.handleNodeIdentifier(normalizedNode.identifier, index);
        const isFirstNode = index === 0;

        const nodeElementDataAttributes = {
          [nodeIdentifierDataAttribute]: normalizedNode.identifier,
          [nodeIndexDataAttribute]: index,
        };

        return (
          <React.Fragment key={normalizedNode.identifier}>
            <div
              className={props.nodeClassName}
              style={{ boxSizing: "border-box", marginTop: isFirstNode ? undefined : nodeSpacing }}
              {...bind()}
              {...nodeElementDataAttributes}
            >
              {element}
            </div>
          </React.Fragment>
        );
      }),
    [normalizedTree, props.handleNodeIdentifier, bind, props.nodeClassName],
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
      {nodeElements}

      <div className={props.dropLineClassName} ref={dropLineElementRef} style={dropLineElementStyle} />
      <span ref={ghostWrapperElementRef} style={ghostWrapperElementStyle} />
    </div>
  );
};
