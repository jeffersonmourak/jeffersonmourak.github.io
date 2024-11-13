import { throttle } from "lodash";
import { initializeShortcode } from "../initializeShortcode";
import { createCanvasController, renderCircuit } from "./canvasController";
import { type Pin, type PropagationTarget, setPinSignal } from "./utils/circ";

export interface RenderContext {
  size: number;
  pinSlots: Record<string, Pin[]>;
  propagationQueue: PropagationTarget[][];
  resolutionLookahead?: number;
  pointerLocation?: [number, number];
  collidablePins: Set<string>;
  collidingPins: Set<string>;
}

const DEFAULT_RENDER_CONTEXT: RenderContext = {
  size: 20,
  pinSlots: {},
  propagationQueue: [],
  resolutionLookahead: 1,
  pointerLocation: [0, 0],
  collidablePins: new Set(),
  collidingPins: new Set(),
};

function getParams(params: URLSearchParams) {
  const entryFile = params.get("entry");

  if (!entryFile) {
    throw new Error("entryFile is required");
  }

  return entryFile;
}

function processPropagationQueue(
  propagationQueue: PropagationTarget[][],
  context: RenderContext,
  rerunCount = 1
) {
  const pinsToProcess = propagationQueue.shift();

  if (!pinsToProcess) {
    return;
  }

  for (let i = 0; i < pinsToProcess.length; i++) {
    const [x, y, signal] = pinsToProcess[i];

    setPinSignal(x, y, signal, context);

    rerunCount <= context.resolutionLookahead &&
      processPropagationQueue(propagationQueue, context, rerunCount + 1);
  }
}

function processPointerInteractions(
  context: RenderContext,
  canvas: HTMLCanvasElement
) {
  const { collidablePins, collidingPins, pinSlots, pointerLocation, size } =
    context;
  const items = Array.from(collidablePins);

  for (const item of items) {
    const pins = pinSlots[item].filter(
      (p) => p.checkPointerColision !== undefined
    );

    for (const pin of pins) {
      pin.checkPointerColision(
        `${pin.x},${pin.y}`,
        ~~(pointerLocation[0] / size) * 10,
        ~~(pointerLocation[1] / size) * 10,
        context
      );
    }
  }

  if (collidingPins.size > 0) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "auto";
  }
}

function processPointerAction(context: RenderContext) {
  const { collidingPins, pinSlots } = context;
  const items = Array.from(collidingPins);

  for (const item of items) {
    const pins =
      pinSlots[item]?.filter(
        (p) =>
          p.checkPointerColision !== undefined && p.onPointerPress !== undefined
      ) ?? [];

    for (const pin of pins) {
      pin.onPointerPress(pin.id, pin.x, pin.y, context);
    }
  }
}

async function mount(file: string) {
  try {
    const response = await fetch(file);
    const fileContent = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(fileContent, "text/xml");

    const pointerLocation: [number, number] = [0, 0];
    let isMouseDown = false;
    let didUserClicked = false;

    const processPointerPress = throttle((context: RenderContext) => {
      if (!didUserClicked) {
        didUserClicked = true;
        processPointerAction(context);
      }
    }, 1000);

    const canvasElement = createCanvasController({
      initialContext: { ...DEFAULT_RENDER_CONTEXT, resolutionLookahead: 1 },
      draw: ({ canvas, context }) => {
        renderCircuit(
          canvas,
          xmlDoc.getElementsByTagName("circuit")[0],
          context
        );
      },
      update: ({ context, canvas }) => {
        context.pointerLocation = pointerLocation;
        processPointerInteractions(context, canvas);
        processPropagationQueue(context.propagationQueue, context);

        if (isMouseDown) {
          processPointerPress(context);
        } else {
          didUserClicked = false;
          processPointerPress.cancel();
        }
      },
      config: {
        limitFPS: 60,
      },
    });

    canvasElement.addEventListener("mousemove", (e) => {
      pointerLocation[0] = e.clientX;
      pointerLocation[1] = e.clientY;
    });

    canvasElement.addEventListener("mousedown", (e) => {
      pointerLocation[0] = e.clientX;
      pointerLocation[1] = e.clientY;
      isMouseDown = true;
    });
    canvasElement.addEventListener("mouseup", (e) => {
      pointerLocation[0] = e.clientX;
      pointerLocation[1] = e.clientY;
      isMouseDown = false;
    });
  } catch (e) {
    console.log(e);
  }
}

function onError(error: Error) {
  console.log(error);
}

export default () =>
  initializeShortcode({
    name: "loadCirc",
    getParams,
    mount,
    onError,
  });
