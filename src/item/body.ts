export const setBodyStyle = (bodyElement: HTMLElement) => {
  // Disables to select elements in entire page.
  bodyElement.style.userSelect = "none";
};

export const clearBodyStyle = (bodyElement: HTMLElement) => {
  // Enables to select elements in entire page.
  bodyElement.style.removeProperty("user-select");
};
