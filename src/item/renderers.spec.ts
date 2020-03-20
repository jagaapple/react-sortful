import { Direction, NodeMeta } from "../shared";
import { getPlaceholderElementStyle, getStackedGroupElementStyle } from "./renderers";

describe("getPlaceholderElementStyle", () => {
  const draggingNodeMeta: NodeMeta<number> = {
    identifier: 0,
    groupIdentifier: undefined,
    ancestorIdentifiers: [],
    index: 0,
    isGroup: false,
    element: {} as any,
    width: 1212,
    height: 3434,
    relativePosition: { top: 100, left: 200 },
    absolutePosition: { top: 300, left: 400 },
  };
  const itemSpacing = 123;

  context('`direction` is "horizontal"', () => {
    const direction: Direction = "horizontal";

    it("should return an object which has proper width and height", () => {
      const returnedValue = getPlaceholderElementStyle(draggingNodeMeta, itemSpacing, direction);

      expect(returnedValue.width).toBe(draggingNodeMeta.width - itemSpacing);
      expect(returnedValue.height).toBe(draggingNodeMeta.height);
    });
  });

  context('`direction` is "vertical"', () => {
    const direction: Direction = "vertical";

    it("should return an object which has proper width and height", () => {
      const returnedValue = getPlaceholderElementStyle(draggingNodeMeta, itemSpacing, direction);

      expect(returnedValue.width).toBe(draggingNodeMeta.width);
      expect(returnedValue.height).toBe(draggingNodeMeta.height - itemSpacing);
    });
  });

  context("when `draggingNodeMeta` is undefined", () => {
    context('`direction` is "horizontal"', () => {
      const direction: Direction = "horizontal";

      it("should return an empty object", () => {
        expect(getPlaceholderElementStyle(undefined, itemSpacing, direction)).toEqual({});
      });
    });

    context('`direction` is "vertical"', () => {
      const direction: Direction = "vertical";

      it("should return an empty object", () => {
        expect(getPlaceholderElementStyle(undefined, itemSpacing, direction)).toEqual({});
      });
    });
  });
});

describe("getStackedGroupElementStyle", () => {
  it("should equal to `getPlaceholderElementStyle`", () => {
    expect(getStackedGroupElementStyle).toBe(getPlaceholderElementStyle);
  });
});
