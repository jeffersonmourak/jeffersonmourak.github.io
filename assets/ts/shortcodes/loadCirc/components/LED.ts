import type { RenderContext } from "..";
import {
	decodeCircCoords,
	getFacingOffset,
	isPowered,
	registerPin,
} from "../utils/circ";

export function drawLED(
  ctx: CanvasRenderingContext2D,
  component: Element,
  renderContext: RenderContext
) {
  const [x, y] = decodeCircCoords(component.getAttribute("loc"));
  const { size } = renderContext;

  let directionOffsets = getFacingOffset("west", size);
  let color = "#ff0000";
  let offColor = "#404040";

  registerPin({
    name: "LED",
    x,
    y,
    context: renderContext,
  });

  const isOn = isPowered(x, y, renderContext);

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
        break;
      }
      case "color": {
        const value = attribute.getAttribute("val");
        color = value;
        break;
      }
      case "offcolor": {
        const value = attribute.getAttribute("val");
        offColor = value;
        break;
      }
    }
  }

  const scaledX = (x + directionOffsets[0]) * (size / 10);
  const scaledY = (y + directionOffsets[1]) * (size / 10);

  ctx.fillStyle = isOn ? color : offColor;
  ctx.fillRect(scaledX, scaledY, 2 * size + 1, 2 * size + 1);
}
