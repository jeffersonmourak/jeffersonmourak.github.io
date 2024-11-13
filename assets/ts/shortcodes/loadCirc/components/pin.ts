import type { RenderContext } from "..";
import {
  decodeCircCoords,
  getCollisionFacingOffset,
  getFacingOffset,
  getPinsData,
  registerPin,
  setPinSignal,
} from "../utils/circ";

export function drawPin(
  ctx: CanvasRenderingContext2D,
  component: Element,
  renderContext: RenderContext
) {
  const [x, y] = decodeCircCoords(component.getAttribute("loc"));

  const { size } = renderContext;

  let facing = "east";
  let directionOffsets = getFacingOffset(facing, size);
  let collisionOffsets = getCollisionFacingOffset(facing, size);
  let isPinOutputing = false;

  for (let i = 0; i < component.children.length; i++) {
    const attribute = component.children[i];
    const name = attribute.getAttribute("name");

    if (!name) {
      continue;
    }

    switch (name) {
      case "facing": {
        const value = attribute.getAttribute("val");
        directionOffsets = getFacingOffset(value, size);
        collisionOffsets = getCollisionFacingOffset(value, size);
        facing = value;
        break;
      }
      case "output": {
        const value = attribute.getAttribute("val");
        isPinOutputing = value === "true";
        break;
      }
    }
  }

  const { key: pinKey } = registerPin({
    name: "pin",
    x,
    y,
    context: renderContext,
    resolveSignalPropagation: (inputSignal) => {
      return [];
    },
    checkPointerColision: isPinOutputing
      ? undefined
      : (id, mX, mY, context) => {
          const horizontalOffsets = collisionOffsets[0];
          const verticalOffsets = collisionOffsets[1];

          const [horizontalBeginOffset, horizontalEndOffset] =
            horizontalOffsets;

          const [verticalBeginOffset, veticalEndOffset] = verticalOffsets;

          const collideX =
            mX - horizontalBeginOffset >= x && mX <= x - horizontalEndOffset;
          const collideY =
            mY - verticalBeginOffset >= y && mY <= y - veticalEndOffset;

          const isColliding = collideX && collideY;

          if (isColliding) {
            context.collidingPins.add(id);
          } else {
            context.collidingPins.delete(id);
          }
        },

    onPointerPress: (id, x, y, context) => {
      const { signal: currentSignal } = getPinsData(x, y, context).find(
        (p) => p.id === id
      );

      if (currentSignal === null || currentSignal === 0) {
        setPinSignal(x, y, 1, context);
      } else {
        setPinSignal(x, y, 0, context);
      }
    },
  });

  const scaledX = (x + directionOffsets[0]) * (size / 10);
  const scaledY = (y + directionOffsets[1]) * (size / 10);

  const isHovering = renderContext.collidingPins.has(pinKey);

  ctx.fillStyle = isHovering ? "yellow" : isPinOutputing ? "blue" : "green";
  ctx.fillRect(scaledX, scaledY, 2 * size + 1, 2 * size + 1);
}
