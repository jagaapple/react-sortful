import { checkIsAncestorItem } from "./move-events";

describe("checkIsAncestorItem", () => {
  const targetItemIdentifier = "386e0e1b-b02b-4c73-b1d2-e843113f8485";

  context("when `targetItemIdentifier` exists in `ancestorIdentifiersOfChild`", () => {
    context("the last element in `ancestorIdentifiersOfChild` is not the identifier", () => {
      const ancestorIdentifiersOfChild = [
        "f17fc33c-3e1a-4f66-85ad-31067c16a871",
        "af1e83d7-2c6e-4789-950f-28dff465ede2",
        targetItemIdentifier,
        "a29fcce7-0b2c-4ff1-b519-e2e807018ab0",
        "e630e35f-c8ff-4ed4-bead-692fc7cb8c3c",
      ];

      it("should return true", () => {
        expect(checkIsAncestorItem(targetItemIdentifier, ancestorIdentifiersOfChild)).toBe(true);
      });
    });

    context("the last element in `ancestorIdentifiersOfChild` is the identifier", () => {
      const ancestorIdentifiersOfChild = [
        "f17fc33c-3e1a-4f66-85ad-31067c16a871",
        "af1e83d7-2c6e-4789-950f-28dff465ede2",
        "a29fcce7-0b2c-4ff1-b519-e2e807018ab0",
        "e630e35f-c8ff-4ed4-bead-692fc7cb8c3c",
        targetItemIdentifier,
      ];

      it("should return false", () => {
        expect(checkIsAncestorItem(targetItemIdentifier, ancestorIdentifiersOfChild)).toBe(false);
      });
    });
  });

  context("when `targetItemIdentifier` does not exist in `ancestorIdentifiersOfChild`", () => {
    const ancestorIdentifiersOfChild = [
      "f17fc33c-3e1a-4f66-85ad-31067c16a871",
      "af1e83d7-2c6e-4789-950f-28dff465ede2",
      "a29fcce7-0b2c-4ff1-b519-e2e807018ab0",
      "e630e35f-c8ff-4ed4-bead-692fc7cb8c3c",
    ];

    it("should return false", () => {
      expect(checkIsAncestorItem(targetItemIdentifier, ancestorIdentifiersOfChild)).toBe(false);
    });
  });
});
