export const initializeGhostElementStyle = (itemElement: HTMLElement, ghostWrapperElement: HTMLElement | undefined) => {
  if (ghostWrapperElement == undefined) return;

  const elementRect = itemElement.getBoundingClientRect();
  ghostWrapperElement.style.top = `${elementRect.top}px`;
  ghostWrapperElement.style.left = `${elementRect.left}px`;
  ghostWrapperElement.style.width = `${elementRect.width}px`;
  ghostWrapperElement.style.height = `${elementRect.height}px`;
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
