import { ItemIdentifier } from "../items";
import { ElementPosition } from "./elements";

type NodeRect = {
  width: number;
  height: number;
  relativePosition: ElementPosition;
  absolutePosition: ElementPosition;
};
export type NodeMeta<T extends ItemIdentifier> = {
  identifier: T;
  groupIdentifier: T | undefined;
  ancestorIdentifiers: T[];
  index: number;
  isGroup: boolean;
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

export const getNodeMeta = <T extends ItemIdentifier>(
  element: HTMLElement,
  identifier: T,
  groupIdentifier: T | undefined,
  ancestorIdentifiers: T[],
  index: number,
  isGroup: boolean,
): NodeMeta<T> => ({
  identifier,
  groupIdentifier,
  ancestorIdentifiers,
  index,
  isGroup,
  element,
  ...getNodeRect(element),
});
