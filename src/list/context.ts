import * as React from "react";

import { Direction, ItemIdentifier, NodeMeta } from "../shared";
import {
  DestinationMeta,
  DragEndMeta,
  DragStartMeta,
  PlaceholderRendererInjectedProps,
  PlaceholderRendererMeta,
  StackedGroupRendererInjectedProps,
  StackedGroupRendererMeta,
  StackGroupMeta,
} from "./meta";

export type IListContext = {
  itemSpacing: number;
  stackableAreaThreshold: number;
  draggingNodeMeta: NodeMeta<any> | undefined;
  setDraggingNodeMeta: (meta: NodeMeta<any> | undefined) => void;
  dropLineElementRef: React.RefObject<HTMLDivElement>;
  ghostWrapperElementRef: React.RefObject<HTMLDivElement>;
  isVisibleDropLineElement: boolean;
  setIsVisibleDropLineElement: (isVisible: boolean) => void;
  isVisibleDropLineElementOnChildList: boolean;
  setIsVisibleDropLineElementOnChildList: (isVisible: boolean) => void;
  renderPlaceholder:
    | ((injectedProps: PlaceholderRendererInjectedProps, meta: PlaceholderRendererMeta<any>) => JSX.Element)
    | undefined;
  listIdentifier: ItemIdentifier;
  rootList: IListContext;
  childrenLists: React.MutableRefObject<Set<IListContext>>;
  stackedGroupIdentifier: any;
  setStackedGroupIdentifier: (identifier: any) => void;
  renderStackedGroup:
    | ((injectedProps: StackedGroupRendererInjectedProps, meta: StackedGroupRendererMeta<any>) => JSX.Element)
    | undefined;
  hoveredNodeMetaRef: React.MutableRefObject<NodeMeta<any> | undefined>;
  destinationMetaRef: React.MutableRefObject<DestinationMeta<any> | undefined>;
  direction: Direction;
  draggingCursorStyle: React.CSSProperties["cursor"] | undefined;
  isDisabled: boolean;
  resetDragState: () => void;
  onDragStart: ((meta: DragStartMeta<any>) => void) | undefined;
  onDragEnd: (meta: DragEndMeta<any>) => void;
  onStackGroup: ((meta: StackGroupMeta<any>) => void) | undefined;
};

export const Context = React.createContext<IListContext>(undefined as any);
