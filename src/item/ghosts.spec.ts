import * as sinon from "sinon";

import { Direction } from "../shared";
import { clearGhostElementStyle, initializeGhostElementStyle, moveGhostElement } from "./ghosts";

describe("initializeGhostElementStyle", () => {
  const itemSpacing = 10;

  afterEach(() => {
    sinon.restore();
  });

  context("when `ghostWrapperElement` is undefined", () => {
    it("should not throw any errors", () => {
      const dummyBoundingClientRect = { width: 10, height: 20, top: 30, left: 40 };
      const boundingRectGetterSpy = sinon.mock().returns(dummyBoundingClientRect);
      const itemElement = ({ getBoundingClientRect: boundingRectGetterSpy } as any) as HTMLElement;

      expect(() => initializeGhostElementStyle(itemElement, undefined, itemSpacing, "horizontal")).not.toThrowError();
    });
  });

  context('when `direction` is "vertical"', () => {
    const direction: Direction = "vertical";

    it("should set `ghostWrapperElement.style` to proper values", () => {
      const dummyBoundingClientRect = { width: 10, height: 20, top: 30, left: 40 };
      const boundingRectGetterSpy = sinon.mock().returns(dummyBoundingClientRect);
      const itemElement = ({ getBoundingClientRect: boundingRectGetterSpy } as any) as HTMLElement;
      const ghostWrapperElement = { style: {} } as HTMLElement;

      initializeGhostElementStyle(itemElement, ghostWrapperElement, itemSpacing, direction);
      expect(ghostWrapperElement.style.top).toBe(`${dummyBoundingClientRect.top + itemSpacing / 2}px`);
      expect(ghostWrapperElement.style.left).toBe(`${dummyBoundingClientRect.left}px`);
      expect(ghostWrapperElement.style.width).toBe(`${dummyBoundingClientRect.width}px`);
      expect(ghostWrapperElement.style.height).toBe(`${dummyBoundingClientRect.height - itemSpacing}px`);
    });
  });

  context('when `direction` is "horizontal"', () => {
    const direction: Direction = "horizontal";

    it("should set `ghostWrapperElement.style` to proper values", () => {
      const dummyBoundingClientRect = { width: 10, height: 20, top: 30, left: 40 };
      const boundingRectGetterSpy = sinon.mock().returns(dummyBoundingClientRect);
      const itemElement = ({ getBoundingClientRect: boundingRectGetterSpy } as any) as HTMLElement;
      const ghostWrapperElement = { style: {} } as HTMLElement;

      initializeGhostElementStyle(itemElement, ghostWrapperElement, itemSpacing, direction);
      expect(ghostWrapperElement.style.top).toBe(`${dummyBoundingClientRect.top}px`);
      expect(ghostWrapperElement.style.left).toBe(`${dummyBoundingClientRect.left + itemSpacing / 2}px`);
      expect(ghostWrapperElement.style.width).toBe(`${dummyBoundingClientRect.width - itemSpacing}px`);
      expect(ghostWrapperElement.style.height).toBe(`${dummyBoundingClientRect.height}px`);
    });
  });
});

describe("moveGhostElement", () => {
  context("when `ghostWrapperElement` is undefined", () => {
    it("should not throw any errors", () => {
      expect(() => moveGhostElement(undefined, [0, 0])).not.toThrowError();
    });
  });

  it("should set `ghostWrapperElement.style.transform` to `movementXY`", () => {
    const ghostWrapperElement = { style: {} } as HTMLElement;
    const movementXY: [number, number] = [123, 456];

    moveGhostElement(ghostWrapperElement, movementXY);
    expect(ghostWrapperElement.style.transform).toBe(`translate3d(${movementXY[0]}px, ${movementXY[1]}px, 0)`);
  });
});

describe("clearGhostElementStyle", () => {
  afterEach(() => {
    sinon.restore();
  });

  context("when `ghostWrapperElement` is undefined", () => {
    it("should not throw any errors", () => {
      expect(() => clearGhostElementStyle(undefined)).not.toThrowError();
    });
  });

  it("should set `ghostWrapperElement.style.transform` to `movementXY`", () => {
    const propertyRemoverSpy = sinon.spy();
    const ghostWrapperElement = ({ style: { removeProperty: propertyRemoverSpy } } as any) as HTMLElement;

    clearGhostElementStyle(ghostWrapperElement);
    expect(propertyRemoverSpy.calledWith("width")).toBe(true);
    expect(propertyRemoverSpy.calledWith("height")).toBe(true);
  });
});
