import { ElementPosition } from "./element";
import { BaseNodeIdentifier } from "./node-identifier";

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
export type DestinationMeta<NodeIdentifier extends BaseNodeIdentifier> = {
  nodeIdentifier: NodeIdentifier;
  parentNodeIdentifier: NodeIdentifier | undefined;
  index: number;
  nextParentNodeIdentifier: NodeIdentifier | undefined;
  nextIndex: number;
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
