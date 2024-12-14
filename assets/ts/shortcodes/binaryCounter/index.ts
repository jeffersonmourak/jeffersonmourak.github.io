import { initializeShortcode } from "shortcodes/initializeShortcode";


import { calculatorPresenter } from "./presenters/calculator";
import { counterPresenter } from "./presenters/counter";

function getParams(params: URLSearchParams): {
  base: number;
  spots: number;
  width: number;
  height: number;
  mode: string;
} {
  const base = Number(params.get("base"));
  const spots = Number(params.get("spots"));
  const width = Number(params.get("width"));
  const height = Number(params.get("height"));
  const mode = params.get("mode");

  return { base, spots, width, height, mode };
}

function onError(error: Error) {
  console.log(error);
}

async function renderWidget({
  base,
  width,
  height,
  spots,
  mode,
}: {
  base: number;
  width: number;
  height: number;
  spots: number;
  mode: string;
}): Promise<void> {
  const animationDuration = 600;
  const presenter = document.createElement("div");
  presenter.setAttribute("style", `--width: ${width}px; --height: ${height}px; --ratio: ${width}/${height};`);

  switch (mode) {
    case "calculator":
      presenter.appendChild(
        calculatorPresenter({
          base,
          cellCount: spots,
          animationDuration,
        }).dom
      );
      break;
    case "counter":
      presenter.appendChild(
        counterPresenter({
          base,
          cellCount: spots,
          animationDuration,
        }).dom
      );
      break;
    default:
      break;
  }

  document.body.appendChild(presenter);
  return;
}

export default () =>
  initializeShortcode({
    name: "binaryCounter",
    getParams,
    mount: renderWidget,
    onError,
  });
