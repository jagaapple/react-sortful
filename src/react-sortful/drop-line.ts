import { ElementPosition } from "./element";
import { OveredNodeMeta } from "./node-meta";

type DropLineDirection = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
const getDropLineDirection = (
  nodeWidth: number,
  nodeHeight: number,
  pointerXY: [number, number],
  mode: "VERTICAL" | "HORIZONTAL",
): DropLineDirection | undefined => {
  const [pointerX, pointerY] = pointerXY;

  if (mode === "VERTICAL") {
    if (nodeHeight / 2 >= pointerY) return "TOP";
    if (nodeHeight / 2 < pointerY) return "BOTTOM";
  }
  if (mode === "HORIZONTAL") {
    if (nodeWidth / 2 >= pointerX) return "LEFT";
    if (nodeWidth / 2 < pointerX) return "RIGHT";
  }
};

export const getDropLinePosition = (
  absoluteXY: [number, number],
  overedNodeMeta: OveredNodeMeta,
  nodeSpacing: number,
): [ElementPosition, DropLineDirection] => {
  const x = Math.max(absoluteXY[0] - overedNodeMeta.absolutePosition.left, 0);
  const y = Math.max(absoluteXY[1] - overedNodeMeta.absolutePosition.top, 0);

  const direction = getDropLineDirection(overedNodeMeta.width, overedNodeMeta.height, [x, y], "VERTICAL");
  if (direction == undefined) throw new Error("A drop line direction is undefined");

  const left = overedNodeMeta.relativePosition.left;
  let top = overedNodeMeta.relativePosition.top;
  switch (direction) {
    case "TOP":
      top -= nodeSpacing / 2;

      break;
    case "BOTTOM":
      top += nodeSpacing / 2 + overedNodeMeta.height;

      break;
  }

  return [{ top, left }, direction];
};
