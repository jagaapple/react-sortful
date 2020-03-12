import { ElementPosition } from "./element";
import { NodeIdentifier } from "./node-identifier";

export const nodeIdentifierDataAttribute = "data-react-sortful-node-identifier";
export const nodeIndexDataAttribute = "data-react-sortful-node-index";

export type DraggingNodeMeta = {
  nodeIdentifier: NodeIdentifier;
  index: number;
};
export type OveredNodeMeta = {
  nodeIdentifier: NodeIdentifier;
  index: number;
  element: HTMLElement;
  width: number;
  height: number;
  relativePosition: ElementPosition;
  absolutePosition: ElementPosition;
};
export type DestinationMeta = {
  nodeIdentifier: NodeIdentifier;
  previousParentNodeIdentifier: NodeIdentifier | undefined;
  previousIndex: number;
  parentNodeIdentifier: NodeIdentifier | undefined;
  index: number;
};

export const getOveredNodeMeta = (element: HTMLElement): OveredNodeMeta => {
  const elementRect = element.getBoundingClientRect();

  const identifier = element.getAttribute(nodeIdentifierDataAttribute) ?? undefined;
  if (identifier == undefined) throw new Error("A node identifier is not set as data attributes in the element");
  const index = Number(element.getAttribute(nodeIndexDataAttribute) ?? NaN);
  if (isNaN(index)) throw new Error("A node index is not a number");

  return {
    index,
    element,
    nodeIdentifier: identifier,
    width: elementRect.width,
    height: elementRect.height,
    relativePosition: { top: element.offsetTop, left: element.offsetLeft },
    absolutePosition: { top: elementRect.top, left: elementRect.left },
  };
};

export const getDraggingNodeMeta = (nodeIdentifier: NodeIdentifier, element: HTMLElement): DraggingNodeMeta => {
  const index = Number(element.getAttribute(nodeIndexDataAttribute) ?? NaN);
  if (isNaN(index)) throw new Error("A node index is not a number");

  return {
    nodeIdentifier,
    index,
  };
};
