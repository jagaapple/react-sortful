import * as sinon from "sinon";

import { Direction } from "../items";
import { NodeMeta } from "../nodes";
import * as directions from "./direcitons";

describe("getDropLineDirection", () => {
  const nodeWidth = 256;
  const nodeHeight = 128;

  context('when `direction` is "horizontal"', () => {
    const direction: Direction = "horizontal";

    context("`nodeWidth / 2` is less than `pointerX`", () => {
      it('should return "LEFT"', () => {
        const pointerX = nodeWidth / 2 - 1;

        expect(directions.getDropLineDirection(nodeWidth, nodeHeight, [pointerX, 0], direction)).toBe("LEFT");
      });
    });

    context("`nodeWidth / 2` is equal to `pointerX`", () => {
      it('should return "LEFT"', () => {
        const pointerX = nodeWidth / 2;

        expect(directions.getDropLineDirection(nodeWidth, nodeHeight, [pointerX, 0], direction)).toBe("LEFT");
      });
    });

    context("`nodeWidth / 2` is more than `pointerX`", () => {
      it('should return "RIGHT"', () => {
        const pointerX = nodeWidth / 2 + 1;

        expect(directions.getDropLineDirection(nodeWidth, nodeHeight, [pointerX, 0], direction)).toBe("RIGHT");
      });
    });
  });

  context('when `direction` is "vertical"', () => {
    const direction: Direction = "vertical";

    context("`nodeHeight / 2` is less than `pointerY`", () => {
      it('should return "TOP"', () => {
        const pointerY = nodeHeight / 2 - 1;

        expect(directions.getDropLineDirection(nodeWidth, nodeHeight, [0, pointerY], direction)).toBe("TOP");
      });
    });

    context("`nodeHeight / 2` is equal to `pointerY`", () => {
      it('should return "TOP"', () => {
        const pointerY = nodeHeight / 2;

        expect(directions.getDropLineDirection(nodeWidth, nodeHeight, [0, pointerY], direction)).toBe("TOP");
      });
    });

    context("`nodeHeight / 2` is more than `pointerY`", () => {
      it('should return "BOTTOM"', () => {
        const pointerY = nodeHeight / 2 + 1;

        expect(directions.getDropLineDirection(nodeWidth, nodeHeight, [0, pointerY], direction)).toBe("BOTTOM");
      });
    });
  });

  context("when direction is not an allowed string", () => {
    it("should return undefined", () => {
      expect(directions.getDropLineDirection(nodeWidth, nodeHeight, [0, 0], "dummy" as Direction)).toBeUndefined();
    });
  });
});

describe("getDropLineDirectionFromXY", () => {
  const nodeMeta: NodeMeta<number> = {
    identifier: 0,
    groupIdentifier: undefined,
    ancestorIdentifiers: [],
    index: 0,
    isGroup: false,
    element: {} as any,
    width: 1212,
    height: 3434,
    relativePosition: { top: 100, left: 200 },
    absolutePosition: { top: 100, left: 200 },
  };
  const direction: Direction = "horizontal";

  afterEach(() => {
    sinon.restore();
  });

  context("when `absoluteXY[0]` is less than `nodeMeta.absolutePosition.left`", () => {
    const absoluteXY: [number, number] = [nodeMeta.absolutePosition.left - 1, 0];

    it("should call `getDropLineDirection` with 0 as absolute X", () => {
      const stub = sinon.stub(directions, "getDropLineDirection");

      directions.getDropLineDirectionFromXY(absoluteXY, nodeMeta, direction);
      expect(stub.calledOnceWithExactly(nodeMeta.width, nodeMeta.height, [0, 0], direction)).toBe(true);
    });
  });

  context("when `absoluteXY[0]` is equal to `nodeMeta.absolutePosition.left`", () => {
    const absoluteXY: [number, number] = [nodeMeta.absolutePosition.left, 0];

    it("should call `getDropLineDirection` with 0 as absolute X", () => {
      const stub = sinon.stub(directions, "getDropLineDirection");

      directions.getDropLineDirectionFromXY(absoluteXY, nodeMeta, direction);
      expect(stub.calledOnceWithExactly(nodeMeta.width, nodeMeta.height, [0, 0], direction)).toBe(true);
    });
  });

  context("when `absoluteXY[0]` is more than to `nodeMeta.absolutePosition.left`", () => {
    const absoluteXY: [number, number] = [nodeMeta.absolutePosition.left + 1, 0];

    it("should call `getDropLineDirection` with a difference as absolute X", () => {
      const stub = sinon.stub(directions, "getDropLineDirection");

      directions.getDropLineDirectionFromXY(absoluteXY, nodeMeta, direction);
      expect(stub.calledOnceWithExactly(nodeMeta.width, nodeMeta.height, [1, 0], direction)).toBe(true);
    });
  });

  context("when `absoluteXY[1]` is less than `nodeMeta.absolutePosition.top`", () => {
    const absoluteXY: [number, number] = [0, nodeMeta.absolutePosition.top - 1];

    it("should call `getDropLineDirection` with 0 as absolute Y", () => {
      const stub = sinon.stub(directions, "getDropLineDirection");

      directions.getDropLineDirectionFromXY(absoluteXY, nodeMeta, direction);
      expect(stub.calledOnceWithExactly(nodeMeta.width, nodeMeta.height, [0, 0], direction)).toBe(true);
    });
  });

  context("when `absoluteXY[1]` is equal to `nodeMeta.absolutePosition.top`", () => {
    const absoluteXY: [number, number] = [0, nodeMeta.absolutePosition.top];

    it("should call `getDropLineDirection` with 0 as absolute Y", () => {
      const stub = sinon.stub(directions, "getDropLineDirection");

      directions.getDropLineDirectionFromXY(absoluteXY, nodeMeta, direction);
      expect(stub.calledOnceWithExactly(nodeMeta.width, nodeMeta.height, [0, 0], direction)).toBe(true);
    });
  });

  context("when `absoluteXY[1]` is more than to `nodeMeta.absolutePosition.top`", () => {
    const absoluteXY: [number, number] = [0, nodeMeta.absolutePosition.top + 1];

    it("should call `getDropLineDirection` with a difference as absolute Y", () => {
      const stub = sinon.stub(directions, "getDropLineDirection");

      directions.getDropLineDirectionFromXY(absoluteXY, nodeMeta, direction);
      expect(stub.calledOnceWithExactly(nodeMeta.width, nodeMeta.height, [0, 1], direction)).toBe(true);
    });
  });
});
