import { ElementPosition } from "./element";
import { NodeMeta } from "./node-meta";

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

export const getDropLineDirectionFromXY = (absoluteXY: [number, number], nodeMeta: NodeMeta) => {
  const x = Math.max(absoluteXY[0] - nodeMeta.absolutePosition.left, 0);
  const y = Math.max(absoluteXY[1] - nodeMeta.absolutePosition.top, 0);

  return getDropLineDirection(nodeMeta.width, nodeMeta.height, [x, y], "VERTICAL");
};

export const getDropLinePosition = (absoluteXY: [number, number], nodeMeta: NodeMeta, itemSpacing: number): ElementPosition => {
  const x = Math.max(absoluteXY[0] - nodeMeta.absolutePosition.left, 0);
  const y = Math.max(absoluteXY[1] - nodeMeta.absolutePosition.top, 0);

  const direction = getDropLineDirection(nodeMeta.width, nodeMeta.height, [x, y], "VERTICAL");
  if (direction == undefined) throw new Error("A drop line direction is undefined");

  const left = nodeMeta.relativePosition.left;
  let top = nodeMeta.relativePosition.top;
  switch (direction) {
    case "TOP":
      top -= itemSpacing / 2;

      break;
    case "BOTTOM":
      top += itemSpacing / 2 + nodeMeta.height;

      break;
  }

  return { top, left };
};
