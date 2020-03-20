import * as sinon from "sinon";

import { clearBodyStyle, setBodyStyle } from "./body";

describe("setBodyStyle", () => {
  it('should set `style.userSelect` to "none"', () => {
    const bodyElement = { style: {} } as HTMLElement;

    setBodyStyle(bodyElement, undefined);
    expect(bodyElement.style.userSelect).toBe("none");
  });

  context("when `draggingCusrsorStyle` is not undefined", () => {
    it('should set `style.userSelect` to "none"', () => {
      const bodyElement = { style: {} } as HTMLElement;

      setBodyStyle(bodyElement, undefined);
      expect(bodyElement.style.userSelect).toBe("none");
    });

    it("should set `style.cursor` to the string", () => {
      const bodyElement = { style: {} } as HTMLElement;
      const draggingCusrsorStyle = "dummy";

      setBodyStyle(bodyElement, draggingCusrsorStyle);
      expect(bodyElement.style.cursor).toBe(draggingCusrsorStyle);
    });
  });
});

describe("clearBodyStyle", () => {
  let bodyElement = {} as HTMLElement;
  let propertyRemoverSpy: sinon.SinonSpy<
    Parameters<CSSStyleDeclaration["removeProperty"]>,
    ReturnType<CSSStyleDeclaration["removeProperty"]>
  >;

  beforeAll(() => {
    propertyRemoverSpy = sinon.spy() as any;
    bodyElement = { style: { removeProperty: propertyRemoverSpy } } as any;
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should call `style.removeProperty` with "user-select" of `bodyElement`', () => {
    clearBodyStyle(bodyElement);

    expect(propertyRemoverSpy.calledWith("user-select")).toBe(true);
  });

  it('should call `style.removeProperty` with "cursor" of `bodyElement`', () => {
    clearBodyStyle(bodyElement);

    expect(propertyRemoverSpy.calledWith("cursor")).toBe(true);
  });
});
