import { initializeShortcode } from "shortcodes/initializeShortcode";

import type { PresentOptions } from "./presenters/cells";

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

  // const baseSlider = document.createElement("input");
  // baseSlider.type = "range";
  // baseSlider.min = "2";
  // baseSlider.max = "16";
  // baseSlider.step = "1";
  // baseSlider.value = `${base}`;

  // const cellsSlider = document.createElement("input");
  // cellsSlider.type = "range";
  // cellsSlider.min = "1";
  // cellsSlider.max = "4";
  // cellsSlider.step = "1";
  // cellsSlider.value = `${spots}`;

  const sharedOptions: PresentOptions = {
    base,
    cellCount: spots,
    animationDuration,
    hideEquation: true,
  };

  // let carryCounterPresenter = presentCells(carryOptions);
  // let topCounterPresenter = presentCells(topOptions);
  // let bottomCounterPresenter = presentCells(bottomOptions);
  // let resultCounterPresenter = presentCells(resultOptions);

  // baseSlider.oninput = () => {
  //   while (presenter.firstChild) {
  //     presenter.removeChild(presenter.firstChild);
  //   }

  //   base = Number(baseSlider.value);
  //   carryCounterPresenter = presentCells({ ...carryOptions, base });
  //   topCounterPresenter = presentCells({ ...topOptions, base });
  //   bottomCounterPresenter = presentCells({ ...bottomOptions, base });
  //   resultCounterPresenter = presentCells({ ...resultOptions, base });
  //   presenter.appendChild(carryCounterPresenter.dom);
  //   presenter.appendChild(topCounterPresenter.dom);
  //   presenter.appendChild(bottomCounterPresenter.dom);
  //   presenter.appendChild(resultCounterPresenter.dom);
  // };

  // cellsSlider.oninput = () => {
  //   while (presenter.firstChild) {
  //     presenter.removeChild(presenter.firstChild);
  //   }

  //   spots = Number(cellsSlider.value);
  //   carryCounterPresenter = presentCells({ ...carryOptions, cellCount: spots });
  //   topCounterPresenter = presentCells({ ...topOptions, cellCount: spots });
  //   bottomCounterPresenter = presentCells({ ...bottomOptions, cellCount: spots });
  //   resultCounterPresenter = presentCells({ ...resultOptions, cellCount: spots });
  //   presenter.appendChild(carryCounterPresenter.dom);
  //   presenter.appendChild(topCounterPresenter.dom);
  //   presenter.appendChild(bottomCounterPresenter.dom);
  //   presenter.appendChild(resultCounterPresenter.dom);
  // };

  // const incrementButton = document.createElement("button");
  // incrementButton.textContent = "increment";

  // incrementButton.style.position = "absolute";
  // incrementButton.style.bottom = "0";
  // incrementButton.style.right = "0";

  // const decrementButton = document.createElement("button");
  // decrementButton.textContent = "decrement";

  // decrementButton.style.position = "absolute";
  // decrementButton.style.bottom = "0";
  // decrementButton.style.left = "0";

  // incrementButton.onclick = () => {
  //   bottomCounterPresenter.increment();
  // };

  // decrementButton.onclick = () => {
  //   bottomCounterPresenter.decrement();
  // };

  // presenter.appendChild(carryCounterPresenter.dom);
  // presenter.appendChild(topCounterPresenter.dom);
  // presenter.appendChild(bottomCounterPresenter.dom);
  // presenter.appendChild(resultCounterPresenter.dom);

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
  // document.body.appendChild(incrementButton);
  // document.body.appendChild(decrementButton);
  // document.body.appendChild(baseSlider);
  // document.body.appendChild(cellsSlider);

  return;
}

export default () =>
  initializeShortcode({
    name: "binaryCounter",
    getParams,
    mount: renderWidget,
    onError,
  });
