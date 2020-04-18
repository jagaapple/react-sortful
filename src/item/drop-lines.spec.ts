import * as sinon from "sinon";

import * as shared from "../shared";
import { getDropLinePositionItemIndex, setDropLineElementStyle } from "./drop-lines";

describe("setDropLineElementStyle", () => {
  const absoluteXY: [number, number] = [123, 456];
  const nodeMeta: shared.NodeMeta<number> = {
    identifier: 0,
    groupIdentifier: undefined,
    listIdentifier: undefined,
    ancestorIdentifiers: [],
    index: 0,
    isGroup: false,
    element: {} as any,
    width: 1212,
    height: 3434,
    relativePosition: { top: 1, left: 2 },
    absolutePosition: { top: 3, left: 4 },
  };

  afterEach(() => {
    sinon.restore();
  });

  context("when `dropLineElement` is undefined", () => {
    it("should not throw any errors", () => {
      expect(() => setDropLineElementStyle(undefined, absoluteXY, nodeMeta, "horizontal")).not.toThrowError();
      expect(() => setDropLineElementStyle(undefined, absoluteXY, nodeMeta, "vertical")).not.toThrowError();
    });
  });

  context('when `direction` is "vertical"', () => {
    const direction: shared.Direction = "vertical";
    const topByDropLinePositionGetter = 123;
    const leftByDropLinePositionGetter = 256;

    beforeEach(() => {
      sinon
        .stub(shared, "getDropLinePosition")
        .returns({ top: topByDropLinePositionGetter, left: leftByDropLinePositionGetter });
    });

    it("should set `dropLineElement.styles` to `top` and `left` properties returned by `getDropLinePosition`", () => {
      const dropLineElement = { style: {} } as HTMLElement;
      setDropLineElementStyle(dropLineElement, absoluteXY, nodeMeta, direction);

      expect(dropLineElement.style.top).toBe(`${topByDropLinePositionGetter}px`);
      expect(dropLineElement.style.left).toBe(`${leftByDropLinePositionGetter}px`);
    });

    it("should set `dropLineElement.style.width` to `nodeMeta.width`", () => {
      const dropLineElement = { style: {} } as HTMLElement;
      setDropLineElementStyle(dropLineElement, absoluteXY, nodeMeta, direction);

      expect(dropLineElement.style.width).toBe(`${nodeMeta.width}px`);
    });
  });

  context('when `direction` is "horizontal"', () => {
    const direction: shared.Direction = "horizontal";
    const topByDropLinePositionGetter = 123;
    const leftByDropLinePositionGetter = 256;

    beforeEach(() => {
      sinon
        .stub(shared, "getDropLinePosition")
        .returns({ top: topByDropLinePositionGetter, left: leftByDropLinePositionGetter });
    });

    it("should set `dropLineElement.styles` to `top` and `left` properties returned by `getDropLinePosition`", () => {
      const dropLineElement = { style: {} } as HTMLElement;
      setDropLineElementStyle(dropLineElement, absoluteXY, nodeMeta, direction);

      expect(dropLineElement.style.top).toBe(`${topByDropLinePositionGetter}px`);
      expect(dropLineElement.style.left).toBe(`${leftByDropLinePositionGetter}px`);
    });

    it("should set `dropLineElement.style.height` to `nodeMeta.height`", () => {
      const dropLineElement = { style: {} } as HTMLElement;
      setDropLineElementStyle(dropLineElement, absoluteXY, nodeMeta, direction);

      expect(dropLineElement.style.height).toBe(`${nodeMeta.height}px`);
    });
  });
});

describe("getDropLinePositionItemIndex", () => {
  context("when an item group of a dragging item is an item group of a hovered item group", () => {
    const draggingItemGroupIdentifier = "3c05919c-e9b1-4d96-8541-7befa05f1c16";
    const hoveredItemGroupIdentifier = draggingItemGroupIdentifier;
    const draggingItemIndex = 2;

    context('`dropLineDirection` is "TOP"', () => {
      const dropLineDirection: shared.DropLineDirection = "TOP";

      context("a hovered item is located to the top of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });

      context("a hovered item is located to the bottom of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex - 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex - 1);
        });
      });
    });

    context('`dropLineDirection` is "BOTTOM"', () => {
      const dropLineDirection: shared.DropLineDirection = "BOTTOM";

      context("a hovered item is located to the top of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex + 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex + 1);
        });
      });

      context("a hovered item is located to the bottom of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });
    });

    context('`dropLineDirection` is "LEFT"', () => {
      const dropLineDirection: shared.DropLineDirection = "LEFT";

      context("a hovered item is located to the left of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });

      context("a hovered item is located to the right of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex - 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex - 1);
        });
      });
    });

    context('`dropLineDirection` is "RIGHT"', () => {
      const dropLineDirection: shared.DropLineDirection = "RIGHT";

      context("a hovered item is located to the left of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex + 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex + 1);
        });
      });

      context("a hovered item is located to the right of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });
    });

    context("`dropLineDirection` is undefined", () => {
      it("should return `draggingItemIndex`", () => {
        expect(
          getDropLinePositionItemIndex(
            undefined,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            0,
            hoveredItemGroupIdentifier,
          ),
        ).toBe(draggingItemIndex);
        expect(
          getDropLinePositionItemIndex(
            undefined,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            4,
            hoveredItemGroupIdentifier,
          ),
        ).toBe(draggingItemIndex);
      });
    });
  });

  context("when an item group of a dragging item is not an item group of a hovered item group", () => {
    const draggingItemGroupIdentifier = "3c05919c-e9b1-4d96-8541-7befa05f1c16";
    const hoveredItemGroupIdentifier = "04095cac-f478-4d43-afa4-d45683e1efc0";
    const draggingItemIndex = 2;

    context('`dropLineDirection` is "TOP"', () => {
      const dropLineDirection: shared.DropLineDirection = "TOP";

      context("a hovered item is located to the top of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });

      context("a hovered item is located to the bottom of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });
    });

    context('`dropLineDirection` is "BOTTOM"', () => {
      const dropLineDirection: shared.DropLineDirection = "BOTTOM";

      context("a hovered item is located to the top of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex + 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex + 1);
        });
      });

      context("a hovered item is located to the bottom of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex + 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex + 1);
        });
      });
    });

    context('`dropLineDirection` is "LEFT"', () => {
      const dropLineDirection: shared.DropLineDirection = "LEFT";

      context("a hovered item is located to the left of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });

      context("a hovered item is located to the right of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex);
        });
      });
    });

    context('`dropLineDirection` is "RIGHT"', () => {
      const dropLineDirection: shared.DropLineDirection = "RIGHT";

      context("a hovered item is located to the left of a dragging item", () => {
        const hoveredItemIndex = 0;

        it("should return `hoveredItemIndex + 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex + 1);
        });
      });

      context("a hovered item is located to the right of a dragging item", () => {
        const hoveredItemIndex = 4;

        it("should return `hoveredItemIndex + 1`", () => {
          const returnedValue = getDropLinePositionItemIndex(
            dropLineDirection,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            hoveredItemIndex,
            hoveredItemGroupIdentifier,
          );
          expect(returnedValue).toBe(hoveredItemIndex + 1);
        });
      });
    });

    context("`dropLineDirection` is undefined", () => {
      it("should return `draggingItemIndex`", () => {
        expect(
          getDropLinePositionItemIndex(
            undefined,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            0,
            hoveredItemGroupIdentifier,
          ),
        ).toBe(draggingItemIndex);
        expect(
          getDropLinePositionItemIndex(
            undefined,
            draggingItemIndex,
            draggingItemGroupIdentifier,
            4,
            hoveredItemGroupIdentifier,
          ),
        ).toBe(draggingItemIndex);
      });
    });
  });
});
