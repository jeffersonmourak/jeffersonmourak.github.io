import { initializeShortcode } from "../initializeShortcode";
import { CircRenderer } from "circ-renderer";
import { prepareTheme } from "./theme";

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

    const theme = prepareTheme();

    const canvasElement = CircRenderer(fileContent, {
      theme: theme,
      scale,
      width,
      height,
    });

    canvasElement.classList.add("circ-renderer-canvas");

    canvasElement.setAttribute(
      "style",
      `--width: ${width}px; --ratio: ${width}/${height}`
    );

    document.body.appendChild(canvasElement);
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
