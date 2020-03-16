import * as React from "react";

import { ItemIdentifier } from "./item";
import { NodeMeta } from "./node";

export type GhostRendererMeta = {
  identifier: ItemIdentifier;
  isGroup: boolean;
};
export type DragStartMeta = {
  identifier: ItemIdentifier;
  index: number;
  isGroup: boolean;
};
export type DragEndMeta = {
  identifier: ItemIdentifier;
  index: number;
  isGroup: boolean;
  nextGroupIdentifier: ItemIdentifier | undefined;
  nextIndex: number;
};

export type DropLineRendererInjectedProps = {
  ref: React.RefObject<HTMLDivElement>;
  style: React.CSSProperties;
};

type DestinationMeta = {
  groupIdentifier: ItemIdentifier | undefined;
  index: number;
};

export const ListContext = React.createContext<{
  groupSpacing: number;
  itemSpacing: number;
  draggingNodeMeta: NodeMeta | undefined;
  setDraggingNodeMeta: (meta: NodeMeta | undefined) => void;
  dropLineElementRef: React.RefObject<HTMLDivElement>;
  ghostWrapperElementRef: React.RefObject<HTMLDivElement>;
  isVisibleDropLineElement: boolean;
  setIsVisibleDropLineElement: (isVisible: boolean) => void;
  overedNodeMetaRef: React.MutableRefObject<NodeMeta | undefined>;
  destinationMetaRef: React.MutableRefObject<DestinationMeta | undefined>;
  onDragStart: ((meta: DragStartMeta) => void) | undefined;
  onDragEnd: (meta: DragEndMeta) => void;
}>(undefined as any);

type Props = {
  className?: string;
  children?: React.ReactNode;
  renderDropLine: (injectedProps: DropLineRendererInjectedProps) => React.ReactNode;
  renderGhost: (meta: GhostRendererMeta) => React.ReactNode;
  groupSpacing?: number;
  itemSpacing?: number;
  onDragStart?: (meta: DragStartMeta) => void;
  onDragEnd: (meta: DragEndMeta) => void;
};

export const List = (props: Props) => {
  const [draggingNodeMetaState, setDraggingNodeMetaState] = React.useState<NodeMeta>();
  const [isVisibleDropLineElementState, setIsVisibleDropLineElementState] = React.useState(false);

  const groupSpacing = props.groupSpacing ?? 12;
  const itemSpacing = props.itemSpacing ?? 8;

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const overedNodeMetaRef = React.useRef<NodeMeta>();
  const destinationMetaRef = React.useRef<DestinationMeta>();

  const dropLineElement = React.useMemo(() => {
    const style: React.CSSProperties = {
      display: isVisibleDropLineElementState ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      transform: "translate(0, -50%)",
    };

    return props.renderDropLine({ ref: dropLineElementRef, style });
  }, [isVisibleDropLineElementState, props.renderDropLine]);
  const ghostElement = React.useMemo(() => {
    if (draggingNodeMetaState == undefined) return;

    return props.renderGhost({ identifier: draggingNodeMetaState.identifier, isGroup: draggingNodeMetaState.isGroup });
  }, [draggingNodeMetaState, props.renderGhost]);

  return (
    <ListContext.Provider
      value={{
        groupSpacing,
        itemSpacing,
        draggingNodeMeta: draggingNodeMetaState,
        setDraggingNodeMeta: setDraggingNodeMetaState,
        dropLineElementRef,
        ghostWrapperElementRef,
        isVisibleDropLineElement: isVisibleDropLineElementState,
        setIsVisibleDropLineElement: setIsVisibleDropLineElementState,
        overedNodeMetaRef,
        destinationMetaRef,
        onDragStart: props.onDragStart,
        onDragEnd: props.onDragEnd,
      }}
    >
      <div className={props.className} style={{ position: "relative" }}>
        {props.children}

        {dropLineElement}
        <div ref={ghostWrapperElementRef} style={{ position: "fixed", pointerEvents: "none" }}>
          {ghostElement}
        </div>
      </div>
    </ListContext.Provider>
  );
};
