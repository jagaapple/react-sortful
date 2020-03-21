import * as sinon from "sinon";

import { clearBodyStyle, setBodyStyle } from "./body";

describe("setBodyStyle", () => {
  let dummyDocumentElement: Document;
  let dummyElement: HTMLElement;
  let elementCreatorMock: sinon.SinonStub<Parameters<Document["createElement"]>, ReturnType<Document["createElement"]>>;
  let elementAttributeSetterSpy: sinon.SinonSpy<Parameters<Element["setAttribute"]>, ReturnType<Element["setAttribute"]>>;
  let childAppenderSpy: sinon.SinonSpy<Parameters<Node["appendChild"]>, ReturnType<Node["appendChild"]>>;

  beforeEach(() => {
    elementAttributeSetterSpy = sinon.spy() as any;
    dummyElement = { setAttribute: elementAttributeSetterSpy, textContent: "" } as any;

    elementCreatorMock = sinon.mock().returns(dummyElement) as any;
    childAppenderSpy = sinon.spy() as any;
    dummyDocumentElement = { createElement: elementCreatorMock, head: { appendChild: childAppenderSpy } } as any;
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should set `style.userSelect` to "none"', () => {
    const bodyElement = { style: {} } as HTMLElement;

    setBodyStyle(bodyElement, undefined, dummyDocumentElement);
    expect(bodyElement.style.userSelect).toBe("none");
  });

  context("when `draggingCusrsorStyle` is undefined", () => {
    it("should not call `document.createElement`", () => {
      const bodyElement = { style: {} } as HTMLElement;

      setBodyStyle(bodyElement, undefined, dummyDocumentElement);
      expect(elementCreatorMock.called).toBe(false);
    });

    it("should not call `document.head.appendChild`", () => {
      const bodyElement = { style: {} } as HTMLElement;

      setBodyStyle(bodyElement, undefined, dummyDocumentElement);
      expect(childAppenderSpy.called).toBe(false);
    });
  });

  context("when `draggingCusrsorStyle` is not undefined", () => {
    const draggingCusrsorStyle = "dummy";

    it('should set `style.userSelect` to "none"', () => {
      const bodyElement = { style: {} } as HTMLElement;

      setBodyStyle(bodyElement, draggingCusrsorStyle, dummyDocumentElement);
      expect(bodyElement.style.userSelect).toBe("none");
    });

    it("should create a style element, set attributes, and append to a document element", () => {
      const bodyElement = { style: {} } as HTMLElement;

      setBodyStyle(bodyElement, draggingCusrsorStyle, dummyDocumentElement);
      expect(elementCreatorMock.calledOnceWith("style")).toBe(true);
      expect(dummyElement.textContent).toBe(`* { cursor: ${draggingCusrsorStyle} !important; }`);
      expect(elementAttributeSetterSpy.calledOnceWith("id", "react-sortful-global-style")).toBe(true);
      expect(childAppenderSpy.calledOnceWith(dummyElement)).toBe(true);
    });
  });
});

describe("clearBodyStyle", () => {
  let bodyElement = {} as HTMLElement;
  let propertyRemoverSpy: sinon.SinonSpy<
    Parameters<CSSStyleDeclaration["removeProperty"]>,
    ReturnType<CSSStyleDeclaration["removeProperty"]>
  >;
  let dummyDocumentElement: Document;
  let dummyElement: HTMLElement;
  let elementGetterMock: sinon.SinonStub<Parameters<Document["getElementById"]>, ReturnType<Document["getElementById"]>>;
  let elementRemoverSpy: sinon.SinonSpy<Parameters<Element["remove"]>, ReturnType<Element["remove"]>>;

  beforeEach(() => {
    propertyRemoverSpy = sinon.spy() as any;
    bodyElement = { style: { removeProperty: propertyRemoverSpy } } as any;

    elementRemoverSpy = sinon.spy() as any;
    dummyElement = { remove: elementRemoverSpy } as any;

    elementGetterMock = sinon.mock().returns(dummyElement) as any;
    dummyDocumentElement = { getElementById: elementGetterMock } as any;
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should call `style.removeProperty` with "user-select" of `bodyElement`', () => {
    clearBodyStyle(bodyElement, dummyDocumentElement);

    expect(propertyRemoverSpy.calledWith("user-select")).toBe(true);
  });

  it("should remove a style element created by react-sortful", () => {
    clearBodyStyle(bodyElement, dummyDocumentElement);

    expect(elementGetterMock.calledOnceWith("react-sortful-global-style")).toBe(true);
    expect(elementRemoverSpy.calledOnce).toBe(true);
  });

  context("when `documentElement.getElementById` returns null", () => {
    beforeEach(() => {
      elementGetterMock = sinon.mock().returns(null) as any;
      dummyDocumentElement = { getElementById: elementGetterMock } as any;
    });

    it("should not raise any errors", () => {
      expect(() => clearBodyStyle(bodyElement, dummyDocumentElement)).not.toThrowError();
    });
  });
});
