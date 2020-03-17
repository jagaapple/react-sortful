import { DropLineDirection, getDropLinePosition, ItemIdentifier, NodeMeta } from "../shared";

export const setDropLineElementStyle = <T extends ItemIdentifier>(
  dropLineElement: HTMLElement | undefined,
  itemSpacing: number,
  absoluteXY: [number, number],
  nodeMeta: NodeMeta<T>,
) => {
  if (dropLineElement == undefined) return;

  const dropLinePosition = getDropLinePosition(absoluteXY, nodeMeta, itemSpacing);
  dropLineElement.style.top = `${dropLinePosition.top}px`;
  dropLineElement.style.left = `${dropLinePosition.left}px`;
  dropLineElement.style.width = `${nodeMeta.width}px`;
};

export const getDropLinePositionItemIndex = <T extends ItemIdentifier>(
  dropLineDirection: DropLineDirection | undefined,
  draggingItemIndex: number,
  draggingItemGroupIdentifier: T | undefined,
  overedItemIndex: number,
  overedItemGroupIdentifier: T | undefined,
) => {
  let nextIndex = draggingItemIndex;
  if (dropLineDirection === "TOP") nextIndex = overedItemIndex;
  if (dropLineDirection === "BOTTOM") nextIndex = overedItemIndex + 1;

  const isInSameGroup = draggingItemGroupIdentifier === overedItemGroupIdentifier;
  if (isInSameGroup && draggingItemIndex < nextIndex) nextIndex -= 1;

  return nextIndex;
};
