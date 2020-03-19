export const setBodyStyle = (bodyElement: HTMLElement, draggingCusrsorStyle: string | undefined) => {
  // Disables to select elements in entire page.
  bodyElement.style.userSelect = "none";

  // Applies a cursor style when dragging.
  console.log(draggingCusrsorStyle);
  if (draggingCusrsorStyle != undefined) bodyElement.style.cursor = draggingCusrsorStyle;
};

export const clearBodyStyle = (bodyElement: HTMLElement) => {
  // Enables to select elements in entire page.
  bodyElement.style.removeProperty("user-select");

  // Resets a cursor style when dragging.
  bodyElement.style.removeProperty("cursor");
};
