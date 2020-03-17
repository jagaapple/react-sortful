import { ItemIdentifier } from "../item";
import { ElementPosition, NodeMeta } from "../node";
import { getDropLineDirection } from "./direciton";

export const getDropLinePosition = <T extends ItemIdentifier>(
  absoluteXY: [number, number],
  nodeMeta: NodeMeta<T>,
  itemSpacing: number,
): ElementPosition => {
  const x = Math.max(absoluteXY[0] - nodeMeta.absolutePosition.left, 0);
  const y = Math.max(absoluteXY[1] - nodeMeta.absolutePosition.top, 0);

  const direction = getDropLineDirection(nodeMeta.width, nodeMeta.height, [x, y], "VERTICAL"); // TODO: Support "HORIZONTAL"
  if (direction == undefined) throw new Error("A drop line direction is undefined");

  const left = nodeMeta.relativePosition.left;
  let top = nodeMeta.relativePosition.top;
  if (direction === "TOP") top -= itemSpacing / 2;
  else if (direction === "BOTTOM") top += nodeMeta.height + itemSpacing / 2;

  return { top, left };
};

export const checkIsInStackableArea = <T extends ItemIdentifier>(
  absoluteXY: [number, number],
  nodeMeta: NodeMeta<T>,
  stackableAreaThreshold: number,
) => {
  const y = Math.max(absoluteXY[1] - nodeMeta.absolutePosition.top, 0);

  const nodeTop = 0;
  const nodeBottom = nodeMeta.height;
  const isInStackableAreaY = nodeTop + stackableAreaThreshold < y && y < nodeBottom - stackableAreaThreshold;

  return isInStackableAreaY;
};
