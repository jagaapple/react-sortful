import * as sinon from "sinon";

import { Direction } from "../items";
import { NodeMeta } from "../nodes";
import { checkIsInStackableArea, getDropLinePosition } from "./positions";
import * as directions from "./direcitons";

describe("getDropLinePosition", () => {
  const absoluteXY: [number, number] = [0, 0];
  const nodeMeta: NodeMeta<number> = {
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
  const direction: Direction = "horizontal";

  afterEach(() => {
    sinon.restore();
  });

  context("when `getDropLineDirection` returns undefined", () => {
    it("should throw an error", () => {
      sinon.stub(directions, "getDropLineDirection").returns(undefined);

      expect(() => getDropLinePosition(absoluteXY, nodeMeta, direction)).toThrowError();
    });
  });

  context('when `getDropLineDirection` return "TOP"', () => {
    it("should return an object which has `nodeMeta.relativePosition.top` as `top` property and `nodeMeta.relativePosition.left` as `left` property", () => {
      sinon.stub(directions, "getDropLineDirection").returns("TOP");

      expect(getDropLinePosition(absoluteXY, nodeMeta, direction)).toEqual({
        top: nodeMeta.relativePosition.top,
        left: nodeMeta.relativePosition.left,
      });
    });
  });

  context('when `getDropLineDirection` return "RIGHT"', () => {
    it("should return an object which has `nodeMeta.relativePosition.top` as `top` property and `nodeMeta.relativePosition.left + nodeMeta.width` as `left` property", () => {
      sinon.stub(directions, "getDropLineDirection").returns("RIGHT");

      expect(getDropLinePosition(absoluteXY, nodeMeta, direction)).toEqual({
        top: nodeMeta.relativePosition.top,
        left: nodeMeta.relativePosition.left + nodeMeta.width,
      });
    });
  });

  context('when `getDropLineDirection` return "BOTTOM"', () => {
    it("should return an object which has `nodeMeta.relativePosition.top + nodeMeta.height` as `top` property and `nodeMeta.relativePosition.left` as `left` property", () => {
      sinon.stub(directions, "getDropLineDirection").returns("BOTTOM");

      expect(getDropLinePosition(absoluteXY, nodeMeta, direction)).toEqual({
        top: nodeMeta.relativePosition.top + nodeMeta.height,
        left: nodeMeta.relativePosition.left,
      });
    });
  });

  context('when `getDropLineDirection` return "LEFT"', () => {
    it("should return an object which has `nodeMeta.relativePosition.top` as `top` property and `nodeMeta.relativePosition.left` as `left` property", () => {
      sinon.stub(directions, "getDropLineDirection").returns("TOP");

      expect(getDropLinePosition(absoluteXY, nodeMeta, direction)).toEqual({
        top: nodeMeta.relativePosition.top,
        left: nodeMeta.relativePosition.left,
      });
    });
  });
});

describe("checkIsInStackableArea", () => {
  const nodeMeta: NodeMeta<number> = {
    identifier: 0,
    groupIdentifier: undefined,
    listIdentifier: undefined,
    ancestorIdentifiers: [],
    index: 0,
    isGroup: false,
    element: {} as any,
    width: 100,
    height: 100,
    relativePosition: { top: 50, left: 50 },
    absolutePosition: { top: 500, left: 500 },
  };
  const stackableAreaThreshold = 20;

  context('when `direction` is "vertical"', () => {
    const direction: Direction = "vertical";

    context("`absoluteXY` is located to the top of a stackable area", () => {
      it("should return false", () => {
        expect(
          checkIsInStackableArea([0, nodeMeta.absolutePosition.top - 1], nodeMeta, stackableAreaThreshold, direction),
        ).toBe(false);
      });
    });

    context("`absoluteXY` is located in the top of a stackable area", () => {
      it("should return true", () => {
        expect(
          checkIsInStackableArea(
            [0, nodeMeta.absolutePosition.top + stackableAreaThreshold],
            nodeMeta,
            stackableAreaThreshold,
            direction,
          ),
        ).toBe(true);
      });
    });

    context("`absoluteXY` is located in the bottom of a stackable area", () => {
      it("should return true", () => {
        expect(
          checkIsInStackableArea(
            [0, nodeMeta.absolutePosition.top + nodeMeta.height - stackableAreaThreshold],
            nodeMeta,
            stackableAreaThreshold,
            direction,
          ),
        ).toBe(true);
      });
    });

    context("`absoluteXY` is located to the bottom of a stackable area", () => {
      it("should return false", () => {
        expect(
          checkIsInStackableArea(
            [0, nodeMeta.absolutePosition.top + nodeMeta.height - stackableAreaThreshold + 1],
            nodeMeta,
            stackableAreaThreshold,
            direction,
          ),
        ).toBe(false);
      });
    });
  });

  context('when `direction` is "horizontal"', () => {
    const direction: Direction = "horizontal";

    context("`absoluteXY` is located to the left of a stackable area", () => {
      it("should return false", () => {
        expect(
          checkIsInStackableArea([nodeMeta.absolutePosition.left - 1, 0], nodeMeta, stackableAreaThreshold, direction),
        ).toBe(false);
      });
    });

    context("`absoluteXY` is located in the left of a stackable area", () => {
      it("should return true", () => {
        expect(
          checkIsInStackableArea(
            [nodeMeta.absolutePosition.left + stackableAreaThreshold, 0],
            nodeMeta,
            stackableAreaThreshold,
            direction,
          ),
        ).toBe(true);
      });
    });

    context("`absoluteXY` is located in the right of a stackable area", () => {
      it("should return true", () => {
        expect(
          checkIsInStackableArea(
            [nodeMeta.absolutePosition.left + nodeMeta.width - stackableAreaThreshold, 0],
            nodeMeta,
            stackableAreaThreshold,
            direction,
          ),
        ).toBe(true);
      });
    });

    context("`absoluteXY` is located to the right of a stackable area", () => {
      it("should return false", () => {
        expect(
          checkIsInStackableArea(
            [nodeMeta.absolutePosition.left + nodeMeta.width - stackableAreaThreshold + 1, 0],
            nodeMeta,
            stackableAreaThreshold,
            direction,
          ),
        ).toBe(false);
      });
    });
  });

  context("when `direction` is not an allowed value", () => {
    it("should throw an error", () => {
      expect(() => checkIsInStackableArea([0, 0], nodeMeta, stackableAreaThreshold, "dummy" as Direction)).toThrowError();
    });
  });
});
