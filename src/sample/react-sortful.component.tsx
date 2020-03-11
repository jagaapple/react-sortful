import * as React from "react";
import { useGesture } from "react-use-gesture";

import { getDropLinePosition, getOveredNodeMeta, NodeIdentifier, OveredNodeMeta } from "./react-sortful";

const nodeIdentifierDataAttribute = "data-react-sortful-node-identifier";

type TreeNode = { identifier: NodeIdentifier; children: NodeIdentifier[] };
export type Tree = TreeNode[];

export type Props = {
  className?: string;
  dropLineClassName: string;
  ghostClassName?: string;
  nodeClassName?: string;
  nodeSpacing?: number;
  tree: Tree;
  handleNodeIdentifier: (nodeIdentifier: NodeIdentifier, index: number) => JSX.Element;
};

export const ReactSortful = (props: Props) => {
  const [draggingNodeIdentifierState, setDraggingNodeIdentifierState] = React.useState<NodeIdentifier>();

  const nodeSpacing = props.nodeSpacing ?? 8;
  const isDraggingAnyNode = draggingNodeIdentifierState != undefined;

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const ghostElementRef = React.useRef<HTMLDivElement>();
  const overedNodeMetaRef = React.useRef<OveredNodeMeta>();

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

  const onDragStart = React.useCallback(
    (nodeIdentifier: NodeIdentifier, element: HTMLDivElement) => {
      setDraggingNodeIdentifierState(nodeIdentifier);
      setGhostElement(element);

      document.body.style.userSelect = "none"; // Disables to select nodes in entire page.
    },
    [setGhostElement],
  );
  const onDrag = React.useCallback((movementXY: [number, number]) => {
    const ghostWrapperElement = ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;

    const [x, y] = movementXY;
    ghostWrapperElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);
  const onDragEnd = React.useCallback(() => {
    setDraggingNodeIdentifierState(undefined);
    clearGhostElement();

    document.body.style.userSelect = "auto"; // Enables to select nodes in entire page.
  }, [clearGhostElement]);
  const onMouseOver = React.useCallback((nodeIdentifier: NodeIdentifier, element: HTMLDivElement) => {
    overedNodeMetaRef.current = getOveredNodeMeta(nodeIdentifier, element);
  }, []);
  const onMouseMove = React.useCallback(
    (absoluteXY) => {
      const overedNodeMeta = overedNodeMetaRef.current;
      if (overedNodeMeta == undefined) return;
      const dropLineElement = dropLineElementRef.current;
      if (dropLineElement == undefined) return;

      const dropLinePosition = getDropLinePosition(absoluteXY, overedNodeMeta, nodeSpacing);
      dropLineElement.style.top = `${dropLinePosition.top}px`;
      dropLineElement.style.left = `${dropLinePosition.left}px`;
    },
    [nodeSpacing],
  );

  const bind = useGesture({
    onDrag: ({ down, movement }) => {
      if (!down) return;

      onDrag(movement);
    },
    onDragStart: ({ event }) => {
      const element = event.currentTarget;
      if (!(element instanceof HTMLDivElement)) return;
      const nodeIdentifier = element.getAttribute(nodeIdentifierDataAttribute) ?? undefined;
      if (nodeIdentifier == undefined) return;

      onDragStart(nodeIdentifier, element);
    },
    onDragEnd,
    onHover: ({ event }) => {
      if (!isDraggingAnyNode) return;

      const element = event.currentTarget;
      if (!(element instanceof HTMLDivElement)) return;
      const nodeIdentifier = element.getAttribute(nodeIdentifierDataAttribute) ?? undefined;
      if (nodeIdentifier == undefined) return;

      onMouseOver(nodeIdentifier, element);
    },
    onMove: ({ xy }) => {
      if (!isDraggingAnyNode) return;

      onMouseMove(xy);
    },
  });

  const nodeElements = React.useMemo(
    () =>
      props.tree.map((node, index) => {
        const element = props.handleNodeIdentifier(node.identifier, index);
        const isFirstNode = index === 0;

        const nodeElementDataAttributes = { [nodeIdentifierDataAttribute]: node.identifier };

        return (
          <React.Fragment key={node.identifier}>
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
    [props.tree, props.handleNodeIdentifier, bind, props.nodeClassName],
  );

  const dropLineElementStyle: React.CSSProperties = {
    display: isDraggingAnyNode ? "block" : "none",
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
