import * as React from "react";
import { useGesture } from "react-use-gesture";

type Position = {
  top: number;
  left: number;
};
type ItemPosition = {
  width: number;
  height: number;
  relativePosition: Position;
  absolutePosition: Position;
};

type FocusDirection = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
const getFocusDirection = (
  width: number,
  height: number,
  pointerXY: [number, number],
  mode: "VERTICAL" | "HORIZONTAL",
): FocusDirection | undefined => {
  const [pointerX, pointerY] = pointerXY;

  if (mode === "VERTICAL") {
    if (height / 2 >= pointerY) return "TOP";
    if (height / 2 < pointerY) return "BOTTOM";
  }
  if (mode === "HORIZONTAL") {
    if (width / 2 >= pointerX) return "LEFT";
    if (width / 2 < pointerX) return "RIGHT";
  }
};

const itemIdentifierDataAttribute = "data-react-sortful-identifier";

type NodeIdentifier = string;
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
  const overedNodeMetaRef = React.useRef<{ identifier: NodeIdentifier; element: HTMLDivElement } & ItemPosition>();

  const onDragStart = React.useCallback(
    (itemIdentifier: NodeIdentifier, itemNode: HTMLDivElement) => {
      setDraggingNodeIdentifierState(itemIdentifier);

      // Disables to select nodes in entire page.
      document.body.style.userSelect = "none";

      const itemNodeRect = itemNode.getBoundingClientRect();

      const ghostWrapperElement = ghostWrapperElementRef.current;
      if (ghostWrapperElement == undefined) return;
      ghostWrapperElement.style.top = `${itemNodeRect.top}px`;
      ghostWrapperElement.style.left = `${itemNodeRect.left}px`;
      ghostWrapperElement.style.width = `${itemNodeRect.width}px`;
      ghostWrapperElement.style.height = `${itemNodeRect.height}px`;

      const ghostElement = ghostWrapperElement.appendChild(itemNode.cloneNode(true)) as HTMLDivElement;
      if (props.ghostClassName != undefined) ghostElement.classList.add(...props.ghostClassName.split(" "));
      ghostElement.style.width = "100%";
      ghostElement.style.height = "100%";
      ghostElementRef.current = ghostElement;
    },
    [props.ghostClassName],
  );
  const onDrag = React.useCallback((movementXY: [number, number]) => {
    const ghostWrapperElement = ghostWrapperElementRef.current;
    if (ghostWrapperElement == undefined) return;

    const [x, y] = movementXY;
    ghostWrapperElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);
  const onDragEnd = React.useCallback(() => {
    setDraggingNodeIdentifierState(undefined);

    // Enables to select nodes in entire page.
    document.body.style.userSelect = "auto";

    const ghostWrapperElement = ghostWrapperElementRef.current;
    const ghostElement = ghostElementRef.current;
    if (ghostWrapperElement != undefined && ghostElement != undefined) {
      ghostWrapperElement.removeChild(ghostElement);
      ghostWrapperElement.style.width = "0";
      ghostWrapperElement.style.height = "0";
    }
  }, [draggingNodeIdentifierState]);
  const onMouseOver = React.useCallback((itemIdentifier: NodeIdentifier, itemNode: HTMLDivElement) => {
    const itemNodeRect = itemNode.getBoundingClientRect();
    overedNodeMetaRef.current = {
      identifier: itemIdentifier,
      element: itemNode,
      width: itemNodeRect.width,
      height: itemNodeRect.height,
      relativePosition: { top: itemNode.offsetTop, left: itemNode.offsetLeft },
      absolutePosition: { top: itemNodeRect.top, left: itemNodeRect.left },
    };
  }, []);
  const onMouseMove = React.useCallback(
    (xy) => {
      const overedItemMeta = overedNodeMetaRef.current;
      if (overedItemMeta == undefined) return;
      const dropLineElement = dropLineElementRef.current;
      if (dropLineElement == undefined) return;

      const x = Math.max(xy[0] - overedItemMeta.absolutePosition.left, 0);
      const y = Math.max(xy[1] - overedItemMeta.absolutePosition.top, 0);
      const direction = getFocusDirection(overedItemMeta.width, overedItemMeta.height, [x, y], "VERTICAL");
      if (direction == undefined) return;

      let top = overedItemMeta.relativePosition.top;
      if (direction === "TOP") {
        top -= nodeSpacing / 2;
      } else if (direction === "BOTTOM") {
        top += nodeSpacing / 2 + overedItemMeta.height;
      }
      dropLineElement.style.top = `${top}px`;
      dropLineElement.style.left = `${overedItemMeta.relativePosition.left}px`;
    },
    [nodeSpacing],
  );

  const bind = useGesture({
    onDrag: ({ down, movement }) => {
      if (!down) return;

      onDrag(movement);
    },
    onDragStart: ({ event }) => {
      const itemNode = event.currentTarget;
      if (!(itemNode instanceof HTMLDivElement)) return;
      const itemIdentifier = itemNode.getAttribute(itemIdentifierDataAttribute) ?? undefined;
      if (itemIdentifier == undefined) return;

      onDragStart(itemIdentifier, itemNode);
    },
    onDragEnd,
    onHover: ({ event }) => {
      if (!isDraggingAnyNode) return;
      const overedItemNode = event.currentTarget;
      if (!(overedItemNode instanceof HTMLDivElement)) return;
      const itemIdentifier = overedItemNode.getAttribute(itemIdentifierDataAttribute) ?? undefined;
      if (itemIdentifier == undefined) return;

      onMouseOver(itemIdentifier, overedItemNode);
    },
    onMove: ({ xy }) => {
      if (!isDraggingAnyNode) return;

      onMouseMove(xy);
    },
  });

  const itemElements = React.useMemo(
    () =>
      props.tree.map((node, index) => {
        const element = props.handleNodeIdentifier(node.identifier, index);
        const isFirst = index === 0;

        const itemElementDataAttributes = { [itemIdentifierDataAttribute]: node.identifier };

        return (
          <React.Fragment key={node.identifier}>
            <div
              {...bind()}
              {...itemElementDataAttributes}
              className={props.nodeClassName}
              style={{ boxSizing: "border-box", marginTop: isFirst ? undefined : nodeSpacing }}
            >
              {element}
            </div>
          </React.Fragment>
        );
      }),
    [props.tree, props.handleNodeIdentifier, bind, props.nodeClassName],
  );

  return (
    <div className={props.className} style={{ position: "relative" }}>
      {itemElements}

      <div
        className={props.dropLineClassName}
        ref={dropLineElementRef}
        style={{ display: isDraggingAnyNode ? "block" : "none", position: "absolute", transform: "translate(0, -50%)" }}
      />
      <span ref={ghostWrapperElementRef} style={{ position: "fixed", pointerEvents: "none" }} />
    </div>
  );
};
