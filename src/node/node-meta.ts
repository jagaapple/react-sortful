import { ItemIdentifier } from "../item";
import { ElementPosition } from "./element";

type NodeRect = {
  width: number;
  height: number;
  relativePosition: ElementPosition;
  absolutePosition: ElementPosition;
};
export type NodeMeta = {
  identifier: ItemIdentifier;
  isGroup: boolean;
  index: number;
  element: HTMLElement;
} & NodeRect;

const getNodeRect = (element: HTMLElement): NodeRect => {
  const elementRect = element.getBoundingClientRect();

  return {
    width: elementRect.width,
    height: elementRect.height,
    relativePosition: { top: element.offsetTop, left: element.offsetLeft },
    absolutePosition: { top: elementRect.top, left: elementRect.left },
  };
};

export const getNodeMeta = (element: HTMLElement, identifier: ItemIdentifier, isGroup: boolean, index: number): NodeMeta => ({
  identifier,
  isGroup,
  index,
  element,
  ...getNodeRect(element),
});
