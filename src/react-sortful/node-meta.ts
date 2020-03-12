import { ElementPosition } from "./element";
import { BaseItemIdentifier } from "./node-identifier";

export const nodeIndexDataAttribute = "data-react-sortful-node-index";

type NodeRect = {
  width: number;
  height: number;
  relativePosition: ElementPosition;
  absolutePosition: ElementPosition;
};

export type NodeMeta = {
  index: number;
  element: HTMLElement;
} & NodeRect;
export type DestinationMeta<ItemIdentifier extends BaseItemIdentifier> = {
  itemIdentifier: ItemIdentifier;
  parentItemIdentifier: ItemIdentifier | undefined;
  index: number;
  nextParentItemIdentifier: ItemIdentifier | undefined;
  nextIndex: number;
};
export type ItemIdentifierHandlerMeta<ItemIdentifier extends BaseItemIdentifier> = {
  identifier: ItemIdentifier;
  index: number;
  isDragging: boolean;
};

const getNodeRect = (element: HTMLElement): NodeRect => {
  const elementRect = element.getBoundingClientRect();

  return {
    width: elementRect.width,
    height: elementRect.height,
    relativePosition: { top: element.offsetTop, left: element.offsetLeft },
    absolutePosition: { top: elementRect.top, left: elementRect.left },
  };
};

export const getNodeMeta = (element: HTMLElement): NodeMeta => {
  const index = Number(element.getAttribute(nodeIndexDataAttribute) ?? NaN);
  if (isNaN(index)) throw new Error("A node index is not a number");

  return { index, element, ...getNodeRect(element) };
};
