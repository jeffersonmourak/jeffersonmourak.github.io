import type { RenderContext } from "..";
import {
  decodeCircCoords,
  getPinPowerState,
  isPowered,
  registerPin,
} from "../utils/circ";

export function drawWire(
  ctx: CanvasRenderingContext2D,
  component: Element,
  renderContext: RenderContext
) {
  const [x1, y1] = decodeCircCoords(component.getAttribute("from"));
  const [x2, y2] = decodeCircCoords(component.getAttribute("to"));

  const { size } = renderContext;

  registerPin({
    name: "wire-from",
    x: x1,
    y: y1,
    context: renderContext,
    idGenerator: () => `[${x1},${y1}]->[${x2},${y2}]`,
    resolveSignalPropagation: (inputSignal) => [[x2, y2, inputSignal]],
  });

  registerPin({
    name: "wire-to",
    x: x2,
    y: y2,
    context: renderContext,
    idGenerator: () => `[${x2},${y2}]<-[${x1},${y1}]`,
    resolveSignalPropagation: (inputSignal) => [[x1, y1, inputSignal]],
  });

  const wireState1 = isPowered(x1, y1, renderContext);
  const wireState2 = isPowered(x2, y2, renderContext);

  const isOn = wireState1 || wireState2;
  const isError =
    getPinPowerState(x1, y1, renderContext) === 2 ||
    getPinPowerState(x2, y2, renderContext) === 2;

  ctx.beginPath();
  ctx.moveTo(x1 * (size / 10), y1 * (size / 10));
  ctx.lineTo(x2 * (size / 10), y2 * (size / 10));
  ctx.lineWidth = ~~(size / 4);
  ctx.lineCap = "round";
  ctx.strokeStyle = isError ? "red" : isOn ? "cyan" : "white";
  ctx.stroke();
}
