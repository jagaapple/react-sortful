import { Direction } from "../shared";

export const initializeGhostElementStyle = (
  itemElement: HTMLElement,
  ghostWrapperElement: HTMLElement | undefined,
  itemSpacing: number,
  direction: Direction,
) => {
  if (ghostWrapperElement == undefined) return;

  const elementRect = itemElement.getBoundingClientRect();
  const top = direction === "vertical" ? elementRect.top + itemSpacing / 2 : elementRect.top;
  const left = direction === "horizontal" ? elementRect.left + itemSpacing / 2 : elementRect.left;
  const width = direction === "horizontal" ? elementRect.width - itemSpacing : elementRect.width;
  const height = direction === "vertical" ? elementRect.height - itemSpacing : elementRect.height;

  ghostWrapperElement.style.top = `${top}px`;
  ghostWrapperElement.style.left = `${left}px`;
  ghostWrapperElement.style.width = `${width}px`;
  ghostWrapperElement.style.height = `${height}px`;
};

export const moveGhostElement = (ghostWrapperElement: HTMLElement | undefined, movementXY: [number, number]) => {
  if (ghostWrapperElement == undefined) return;

  const [x, y] = movementXY;
  ghostWrapperElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

export const clearGhostElementStyle = (ghostWrapperElement: HTMLElement | undefined) => {
  if (ghostWrapperElement == undefined) return;

  ghostWrapperElement.style.removeProperty("width");
  ghostWrapperElement.style.removeProperty("height");
};
