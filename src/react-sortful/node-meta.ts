import { ElementPosition } from "./element";
import { NodeIdentifier } from "./node-identifier";

export const nodeIdentifierDataAttribute = "data-react-sortful-node-identifier";
export const nodeIndexDataAttribute = "data-react-sortful-node-index";

type NodeRect = {
  width: number;
  height: number;
  relativePosition: ElementPosition;
  absolutePosition: ElementPosition;
};

export type NodeMeta = {
  nodeIdentifier: NodeIdentifier;
  index: number;
  element: HTMLElement;
} & NodeRect;
export type DestinationMeta = {
  nodeIdentifier: NodeIdentifier;
  previousParentNodeIdentifier: NodeIdentifier | undefined;
  previousIndex: number;
  parentNodeIdentifier: NodeIdentifier | undefined;
  index: number;
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
  const nodeIdentifier = element.getAttribute(nodeIdentifierDataAttribute) ?? undefined;
  if (nodeIdentifier == undefined) throw new Error("A node identifier is not set as data attributes in the element");
  const index = Number(element.getAttribute(nodeIndexDataAttribute) ?? NaN);
  if (isNaN(index)) throw new Error("A node index is not a number");

  return { nodeIdentifier, index, element, ...getNodeRect(element) };
};
