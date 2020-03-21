const styleElementId = "react-sortful-global-style";

export const setBodyStyle = (bodyElement: HTMLElement, draggingCusrsorStyle: string | undefined) => {
  // Disables to select elements in entire page.
  bodyElement.style.userSelect = "none";

  // Applies a cursor style when dragging.
  if (draggingCusrsorStyle != undefined) {
    const styleElement = document.createElement("style");
    styleElement.textContent = `* { cursor: ${draggingCusrsorStyle} !important; }`;
    styleElement.setAttribute("id", styleElementId);

    document.head.appendChild(styleElement);
  }
};

export const clearBodyStyle = (bodyElement: HTMLElement) => {
  // Enables to select elements in entire page.
  bodyElement.style.removeProperty("user-select");

  // Resets a cursor style when dragging.
  document.getElementById(styleElementId)?.remove();
};
