import * as React from "react";

import { ItemIdentifier } from "./item";
import { NodeMeta } from "./node";

export type GhostRendererMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup"
>;
export type DragStartMeta<T extends ItemIdentifier> = Pick<NodeMeta<T>, "identifier" | "groupIdentifier" | "index" | "isGroup">;
export type DragEndMeta<T extends ItemIdentifier> = Pick<
  NodeMeta<T>,
  "identifier" | "groupIdentifier" | "index" | "isGroup"
> & {
  nextGroupIdentifier: T | undefined;
  nextIndex: number;
};

export type DropLineRendererInjectedProps = {
  ref: React.RefObject<HTMLDivElement>;
  style: React.CSSProperties;
};

type DestinationMeta<T extends ItemIdentifier> = {
  groupIdentifier: T | undefined;
  index: number;
};

export const ListContext = React.createContext<{
  itemSpacing: number;
  draggingNodeMeta: NodeMeta<any> | undefined;
  setDraggingNodeMeta: (meta: NodeMeta<any> | undefined) => void;
  dropLineElementRef: React.RefObject<HTMLDivElement>;
  ghostWrapperElementRef: React.RefObject<HTMLDivElement>;
  isVisibleDropLineElement: boolean;
  setIsVisibleDropLineElement: (isVisible: boolean) => void;
  overedNodeMetaRef: React.MutableRefObject<NodeMeta<any> | undefined>;
  destinationMetaRef: React.MutableRefObject<DestinationMeta<any> | undefined>;
  onDragStart: ((meta: DragStartMeta<any>) => void) | undefined;
  onDragEnd: (meta: DragEndMeta<any>) => void;
}>(undefined as any);

type Props<T extends ItemIdentifier> = {
  className?: string;
  children?: React.ReactNode;
  renderDropLine: (injectedProps: DropLineRendererInjectedProps) => React.ReactNode;
  renderGhost: (meta: GhostRendererMeta<T>) => React.ReactNode;
  itemSpacing?: number;
  onDragStart?: (meta: DragStartMeta<T>) => void;
  onDragEnd: (meta: DragEndMeta<T>) => void;
};

export const List = <T extends ItemIdentifier>(props: Props<T>) => {
  const [draggingNodeMetaState, setDraggingNodeMetaState] = React.useState<NodeMeta<T>>();
  const [isVisibleDropLineElementState, setIsVisibleDropLineElementState] = React.useState(false);

  const itemSpacing = props.itemSpacing ?? 8;

  const dropLineElementRef = React.useRef<HTMLDivElement>(null);
  const ghostWrapperElementRef = React.useRef<HTMLDivElement>(null);
  const overedNodeMetaRef = React.useRef<NodeMeta<T>>();
  const destinationMetaRef = React.useRef<DestinationMeta<T>>();

  const dropLineElement = React.useMemo(() => {
    const style: React.CSSProperties = {
      display: isVisibleDropLineElementState ? "block" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      transform: "translate(0, -50%)",
      pointerEvents: "none",
    };

    return props.renderDropLine({ ref: dropLineElementRef, style });
  }, [props.renderDropLine, isVisibleDropLineElementState]);
  const ghostElement = React.useMemo(() => {
    if (draggingNodeMetaState == undefined) return;

    const { identifier, groupIdentifier, index, isGroup } = draggingNodeMetaState;

    return props.renderGhost({ identifier, groupIdentifier, index, isGroup });
  }, [props.renderGhost, draggingNodeMetaState]);

  return (
    <ListContext.Provider
      value={{
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
