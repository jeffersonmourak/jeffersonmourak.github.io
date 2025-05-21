import CircuitSimulator from "circ-renderer/src/modules/simulator";
import { initializeShortcode } from "../initializeShortcode";
import { prepareTheme } from "./theme";
import { loadLogisimInput } from "circ-renderer/src/modules/loader";
import { RenderEngine } from "circ-renderer/src/modules/renderer";

export interface RenderContext {
  size: number;
  pointerLocation?: [number, number];
}

function getParams(params: URLSearchParams): {
  input: string;
  scale: number;
  width: number;
  height: number;
} {
  const entryFile = params.get("entry");
  const scale = Number(params.get("scale"));
  const width = Number(params.get("width"));
  const height = Number(params.get("height"));

  if (!entryFile) {
    throw new Error("entryFile is required");
  }

  return { input: entryFile, scale, width, height };
}

function onError(error: Error) {
  console.error(error);
}

async function mountFromCircRenderer({
  input,
  scale,
  width,
  height,
}: {
  input: string;
  scale: number;
  width: number;
  height: number;
}): Promise<void> {
  try {
    const response = await fetch(input);
    const fileContent = await response.text();

    const [mainCircuit] = loadLogisimInput(fileContent);

    const sim = new CircuitSimulator();

    sim.loadCircuit(mainCircuit);

    const renderInstance = new RenderEngine(sim.circuit, {
      theme: prepareTheme(),
      scale,
      width,
      height,
      limitFPS: 60,
      onClick: (context) => {
        const { activePin: index } = context;

        if (index === null || sim.circuit === null) {
          return;
        }

        const activePin = sim.circuit.components.list[index];

        // biome-ignore lint/style/noNonNullAssertion: The activePin is always defined
        const stateIndex = sim.circuit.wireConnections.get(activePin.location)!;

        const value = sim.circuit.state[stateIndex] === 1 ? 0 : 1;

        sim.updateStateValue(stateIndex, value);
        sim.step();
      },
    });

    renderInstance.render();

    document.body.appendChild(renderInstance.canvasElement);
  } catch (e) {
    console.error(e);
  }
  return;
}

export default () =>
  initializeShortcode({
    name: "loadCirc",
    getParams,
    mount: mountFromCircRenderer,
    onError,
  });
