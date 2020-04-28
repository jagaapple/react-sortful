import { ElementPosition } from "./elements";
import { getNodeMeta } from "./node-meta";
import * as sinon from "sinon";

describe("getNodeMeta", () => {
  const identifier = "a8e95d60-a68e-452c-9ba0-a640e911489a";
  const groupIdentifier = "f76d7452-b6fe-4dfd-a5fb-9dac9029e679";
  const listIdentifier = "f76d7452-b6fe-4dfd-a5fb-9dac9029e678";
  const ancestorIdentifiers = ["741959db-f0aa-4f61-aa72-43edd372ab17", "cd1e18e1-e476-476c-b17b-d43542653cf3"];
  const index = 0;
  const isGroup = true;

  it("should return a node meta", () => {
    const dummyBoundingClientRect = { width: 1, height: 2, top: 3, left: 4 };
    const boundingRectGetterSpy = sinon.mock().returns(dummyBoundingClientRect);
    const element = ({
      offsetTop: 5,
      offsetLeft: 6,
      getBoundingClientRect: boundingRectGetterSpy,
    } as any) as HTMLElement;

    const returnedValue = getNodeMeta(
      element,
      identifier,
      groupIdentifier,
      listIdentifier,
      ancestorIdentifiers,
      index,
      isGroup,
    );
    const expectedRelativePosition: ElementPosition = { top: 5, left: 6 };
    const expectedAbsolutePosition: ElementPosition = { top: 3, left: 4 };
    expect(returnedValue).toEqual({
      identifier,
      groupIdentifier,
      ancestorIdentifiers,
      index,
      isGroup,
      listIdentifier,
      element,
      width: dummyBoundingClientRect.width,
      height: dummyBoundingClientRect.height,
      relativePosition: expectedRelativePosition,
      absolutePosition: expectedAbsolutePosition,
    });
  });
});
