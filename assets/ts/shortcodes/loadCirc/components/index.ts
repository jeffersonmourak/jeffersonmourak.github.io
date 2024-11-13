import type { RenderContext } from "..";
import { drawLED } from "./LED";
import { drawPin } from "./pin";
import { drawWire } from "./wire";

export function drawComponent(
	ctx: CanvasRenderingContext2D,
	component: Element,
	renderContext: RenderContext,
) {
	const type = component.tagName;
	const name = component.getAttribute("name");

	// Ignore attribute nodes for now!
	if (type === "a") {
		return;
	}

	if (type === "wire") {
		return drawWire(ctx, component, renderContext);
	}

	switch (name) {
		case "Pin":
			drawPin(ctx, component, renderContext);
			break;
		case "LED":
			drawLED(ctx, component, renderContext);
			break;

		default:
			break;
	}
}
