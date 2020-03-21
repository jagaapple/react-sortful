const styleElementId = "react-sortful-global-style";

export const setBodyStyle = (
  bodyElement: HTMLElement,
  draggingCusrsorStyle: string | undefined,
  // istanbul ignore next
  documentElement = document,
) => {
  // Disables to select elements in entire page.
  bodyElement.style.userSelect = "none";

  // Applies a cursor style when dragging.
  if (draggingCusrsorStyle != undefined) {
    const styleElement = documentElement.createElement("style");
    styleElement.textContent = `* { cursor: ${draggingCusrsorStyle} !important; }`;
    styleElement.setAttribute("id", styleElementId);

    documentElement.head.appendChild(styleElement);
  }
};

export const clearBodyStyle = (
  bodyElement: HTMLElement,
  // istanbul ignore next
  documentElement = document,
) => {
  // Enables to select elements in entire page.
  bodyElement.style.removeProperty("user-select");

  // Resets a cursor style when dragging.
  documentElement.getElementById(styleElementId)?.remove();
};
