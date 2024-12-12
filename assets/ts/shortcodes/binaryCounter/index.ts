import { initializeShortcode } from "shortcodes/initializeShortcode";
import { presentCells } from "./presenters/cells";

function getParams(params: URLSearchParams): {
  scale: number;
  width: number;
  height: number;
} {
  const scale = Number(params.get("scale"));
  const width = Number(params.get("width"));
  const height = Number(params.get("height"));

  return { scale, width, height };
}

function onError(error: Error) {
  console.log(error);
}

async function renderWidget({
  scale,
  width,
  height,
}: {
  scale: number;
  width: number;
  height: number;
}): Promise<void> {
  let base = 2;
  let cellCount = 3;
  const animationDuration = 300;

  const presenter = document.createElement("div");

  const baseSlider = document.createElement("input");
  baseSlider.type = "range";
  baseSlider.min = "2";
  baseSlider.max = "16";
  baseSlider.step = "1";
  baseSlider.value = `${base}`;

  const cellsSlider = document.createElement("input");
  cellsSlider.type = "range";
  cellsSlider.min = "1";
  cellsSlider.max = "4";
  cellsSlider.step = "1";
  cellsSlider.value = `${cellCount}`;

  let counterPresenter = presentCells(base, cellCount, animationDuration);

  baseSlider.oninput = () => {
    while (presenter.firstChild) {
      presenter.removeChild(presenter.firstChild);
    }

    base = Number(baseSlider.value);
    counterPresenter = presentCells(base, cellCount, animationDuration);
    presenter.appendChild(counterPresenter.dom);
  };

  cellsSlider.oninput = () => {
    while (presenter.firstChild) {
      presenter.removeChild(presenter.firstChild);
    }

    cellCount = Number(cellsSlider.value);
    counterPresenter = presentCells(base, cellCount, animationDuration);
    presenter.appendChild(counterPresenter.dom);
  };

  const activateButton = document.createElement("button");
  activateButton.textContent = "Activate";

  activateButton.style.position = "absolute";
  activateButton.style.bottom = "0";
  activateButton.style.left = "0";

  activateButton.onclick = () => {
    counterPresenter.increment();
  };

  presenter.appendChild(counterPresenter.dom);

  document.body.appendChild(presenter);
  document.body.appendChild(activateButton);
  document.body.appendChild(baseSlider);
  document.body.appendChild(cellsSlider);

  return;
}

export default () =>
  initializeShortcode({
    name: "binaryCounter",
    getParams,
    mount: renderWidget,
    onError,
  });
