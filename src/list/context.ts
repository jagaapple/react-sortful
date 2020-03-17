import * as React from "react";

import { NodeMeta } from "../shared";
import {
  DestinationMeta,
  DragEndMeta,
  DragStartMeta,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackMeta,
} from "./meta";

export const Context = React.createContext<{
  itemSpacing: number;
  stackableAreaThreshold: number;
  draggingNodeMeta: NodeMeta<any> | undefined;
  setDraggingNodeMeta: (meta: NodeMeta<any> | undefined) => void;
  dropLineElementRef: React.RefObject<HTMLDivElement>;
  ghostWrapperElementRef: React.RefObject<HTMLDivElement>;
  isVisibleDropLineElement: boolean;
  setIsVisibleDropLineElement: (isVisible: boolean) => void;
  renderPlaceholder:
    | ((injectedProps: PlaceholderRendererInjectedProps, meta: PlaceholderRendererMeta<any>) => JSX.Element)
    | undefined;
  overedNodeMetaRef: React.MutableRefObject<NodeMeta<any> | undefined>;
  destinationMetaRef: React.MutableRefObject<DestinationMeta<any> | undefined>;
  onDragStart: ((meta: DragStartMeta<any>) => void) | undefined;
  onDragEnd: (meta: DragEndMeta<any>) => void;
  onStack: ((meta: StackMeta<any>) => void) | undefined;
}>(undefined as any);
