import { Direction, ItemIdentifier } from "../items";
import { NodeMeta } from "../nodes";

export type DropLineDirection = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";

export const getDropLineDirection = (
  nodeWidth: number,
  nodeHeight: number,
  pointerXY: [number, number],
  direction: Direction,
): DropLineDirection | undefined => {
  const [pointerX, pointerY] = pointerXY;

  if (direction === "vertical") {
    if (nodeHeight / 2 >= pointerY) return "TOP";
    if (nodeHeight / 2 < pointerY) return "BOTTOM";
  }
  if (direction === "horizontal") {
    if (nodeWidth / 2 >= pointerX) return "LEFT";
    if (nodeWidth / 2 < pointerX) return "RIGHT";
  }
};

export const getDropLineDirectionFromXY = <T extends ItemIdentifier>(
  absoluteXY: [number, number],
  nodeMeta: NodeMeta<T>,
  direction: Direction,
) => {
  const x = Math.max(absoluteXY[0] - nodeMeta.absolutePosition.left, 0);
  const y = Math.max(absoluteXY[1] - nodeMeta.absolutePosition.top, 0);

  return getDropLineDirection(nodeMeta.width, nodeMeta.height, [x, y], direction);
};
