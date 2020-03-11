import { ElementPosition } from "./element";
import { NodeIdentifier } from "./node-identifier";

export type OveredNodeMeta = {
  identifier: NodeIdentifier;
  element: HTMLElement;
  width: number;
  height: number;
  relativePosition: ElementPosition;
  absolutePosition: ElementPosition;
};

export const getOveredNodeMeta = (identifier: NodeIdentifier, element: HTMLElement): OveredNodeMeta => {
  const elementRect = element.getBoundingClientRect();

  return {
    identifier,
    element,
    width: elementRect.width,
    height: elementRect.height,
    relativePosition: { top: element.offsetTop, left: element.offsetLeft },
    absolutePosition: { top: elementRect.top, left: elementRect.left },
  };
};
