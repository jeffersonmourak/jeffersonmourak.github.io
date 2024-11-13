import type { RenderContext } from ".";
import { drawComponent } from "./components";

export interface RenderInfo {
  canvas: HTMLCanvasElement;
  context: RenderContext;
}

export interface RuntimeConfig {
  limitFPS?: number;
}

export interface CreateCanvasControllerOptions {
  initialContext: RenderContext;
  draw: (payload: {
    canvas: HTMLCanvasElement;
    context: RenderContext;
  }) => void;
  update?: (info: RenderInfo) => void;
  config?: RuntimeConfig;
}

export function createCanvasController({
  initialContext,
  draw,
  config,
  update = () => {},
}: CreateCanvasControllerOptions) {
  const canvasElement = document.createElement("canvas");
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  document.body.appendChild(canvasElement);
  document.body.style.width = `${canvasElement.width}px`;
  document.body.style.height = `${canvasElement.height}px`;

  const ctx = canvasElement.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  const context = { ...initialContext };

  const { limitFPS = 60 } = config ?? {};

  const delay = 1000 / limitFPS;
  let time = null;
  let frame = -1;
  let tref: number;

  function renderLoop(timestamp: DOMHighResTimeStamp) {
    if (time === null) time = timestamp;
    const seg = Math.floor((timestamp - time) / delay);
    if (seg > frame) {
      frame = seg;

      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      update({ context, canvas: canvasElement });
      draw({
        canvas: canvasElement,
        context,
      });
    }
    tref = requestAnimationFrame(renderLoop);
  }

  tref = requestAnimationFrame(renderLoop);

  // () => {
  //   time = null;
  //   frame = -1;

  //   cancelAnimationFrame(tref);
  // };

  return canvasElement;
}

export function renderCircuit(
  canvas: HTMLCanvasElement,
  circuit: Element,
  renderContext: RenderContext
) {
  const { size } = renderContext;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  for (let x = 0; x < canvas.width; x += size) {
    for (let y = 0; y < canvas.height; y += size) {
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, 1, 1);
    }
  }

  for (let i = 0; i < circuit.children.length; i++) {
    const component = circuit.children[i];

    drawComponent(ctx, component, renderContext);
  }
}
