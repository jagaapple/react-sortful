import { Direction, DropLineDirection, getDropLinePosition, ItemIdentifier, NodeMeta } from "../shared";

export const setDropLineElementStyle = <T extends ItemIdentifier>(
  dropLineElement: HTMLElement | undefined,
  absoluteXY: [number, number],
  nodeMeta: NodeMeta<T>,
  direction: Direction,
) => {
  if (dropLineElement == undefined) return;

  const dropLinePosition = getDropLinePosition(absoluteXY, nodeMeta, direction);
  dropLineElement.style.top = `${dropLinePosition.top}px`;
  dropLineElement.style.left = `${dropLinePosition.left}px`;

  if (direction === "vertical") dropLineElement.style.width = `${nodeMeta.width}px`;
  if (direction === "horizontal") dropLineElement.style.height = `${nodeMeta.height}px`;
};

export const getDropLinePositionItemIndex = <T extends ItemIdentifier>(
  dropLineDirection: DropLineDirection | undefined,
  draggingItemIndex: number,
  draggingItemGroupIdentifier: T | undefined,
  hoveredItemIndex: number,
  hoveredItemGroupIdentifier: T | undefined,
) => {
  let nextIndex = draggingItemIndex;
  if (dropLineDirection === "TOP") nextIndex = hoveredItemIndex;
  if (dropLineDirection === "BOTTOM") nextIndex = hoveredItemIndex + 1;
  if (dropLineDirection === "LEFT") nextIndex = hoveredItemIndex;
  if (dropLineDirection === "RIGHT") nextIndex = hoveredItemIndex + 1;

  const isInSameGroup = draggingItemGroupIdentifier === hoveredItemGroupIdentifier;
  if (isInSameGroup && draggingItemIndex < nextIndex) nextIndex -= 1;

  return nextIndex;
};
