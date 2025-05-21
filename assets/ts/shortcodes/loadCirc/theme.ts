import type { CircTheme, ThemeColor } from "circ-renderer";

import { assetsManager } from "circ-renderer";

import { AND, NAND, NOT, OR, XOR } from "./assets";
import type { ComponentRenderArgument } from "circ-renderer/src/modules/renderer";

export type ComponentFace = "north" | "south" | "east" | "west";

const assetLoader = assetsManager();

export const colors = {
  primary: "#b097d1",
  primary1: "#6e49ab",
  primary2: "#0056b3",
  backgroundPrimary: "#090311",
  backgroundPrimaryAlt: "#443856",
  backgroundSecondary: "#f8f4ff",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "#28a745",
  cyan: "#17a2b8",
  blue: "#007bff",
  purple: "#6f42c1",
  pink: "#e83e8c",
  //white
  base00: "#ffffff",

  base05: "#f8f9fa",
  base10: "#f1f3f5",
  // green shades
  base20: "#165a26",
  base25: "#dee2e6",
  base30: "#ced4da",
  // orange shades
  base35: "#634e0d",
  // blue shades
  base40: "#24b4ff",
  base50: "#bee3ff",
  base60: "#0b99ff",
  base70: "#0059b9",
  // black
  base100: "#000000",
} satisfies Record<ThemeColor, string>;

const LEDSkin = ({
  ctx,
  dimensions,
  theme,
  portsSignals,
}: ComponentRenderArgument) => {
  ctx.beginPath();
  const [width, height] = dimensions;

  const isOn = portsSignals[0] === 1;

  ctx.fillStyle = isOn ? theme.colors.base60 : theme.colors.base50;

  ctx.strokeStyle = isOn ? theme.colors.base70 : theme.colors.base40;
  ctx.lineWidth = 1;

  ctx.arc(-8, height / 2, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};

const PinSkin = ({
  dimensions,
  ctx,
  theme,
  component,
  pointerLocation,
  portsSignals,
  rotationAngle,
}: ComponentRenderArgument) => {
  ctx.beginPath();
  const [width, height] = dimensions;

  const isOn = portsSignals[0] === 1;

  ctx.lineWidth = 1;

  if (component.attributes.output) {
    ctx.fillStyle = isOn ? theme.colors.base60 : theme.colors.base50;
    ctx.strokeStyle = isOn ? theme.colors.base70 : theme.colors.base40;
  } else if (pointerLocation !== null) {
    ctx.fillStyle = theme.colors.yellow;
    ctx.strokeStyle = theme.colors.yellow;
  } else {
    ctx.strokeStyle = isOn ? theme.colors.base35 : theme.colors.base20;
    ctx.fillStyle = isOn ? theme.colors.orange : theme.colors.green;
  }

  ctx.roundRect(3, 0, width, height, 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();
  ctx.font = `${6}px monospace`;

  ctx.translate(width - 2, height / 2);
  ctx.rotate(-rotationAngle);

  ctx.strokeText(isOn ? "1" : "0", 0, 2);
  ctx.fillText(isOn ? "1" : "0", 0, 2);
};

const NotSkin = ({ dimensions, ctx, theme }: ComponentRenderArgument) => {
  const [width, height] = dimensions;

  if (!assetLoader.load(NOT).next().done) {
    return;
  }

  const notImageAsset = assetLoader.load(NOT).next().value;

  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(notImageAsset, -height / 2, height, width, height * 2);

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.save();
  ctx.translate(height / 2, width);
  ctx.rotate(-Math.PI / 2);

  ctx.strokeText("NOT", 5, -5);

  ctx.fillText("NOT", 5, -5);
  ctx.restore();
};

const AndSkin = ({
  dimensions,
  ctx,
  theme,
  rotationAngle,
}: ComponentRenderArgument) => {
  const [width, height] = dimensions;

  if (!assetLoader.load(AND).next().done) {
    return;
  }

  const andImageAsset = assetLoader.load(AND).next().value;
  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(andImageAsset, 0, height / 2, width, height);
  ctx.restore();

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);
  ctx.strokeText("AND", 0, 3);
  ctx.fillText("AND", 0, 3);
};

const OrSkin = ({
  dimensions,
  rotationAngle,
  ctx,
  theme,
}: ComponentRenderArgument) => {
  const [width, height] = dimensions;

  if (!assetLoader.load(OR).next().done) {
    return;
  }

  const orImageAsset = assetLoader.load(OR).next().value;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(orImageAsset, 0, height / 2, width, height);
  ctx.restore();

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);
  ctx.strokeText("OR", 0, 3);
  ctx.fillText("OR", 0, 3);
};

const NandSkin = ({
  dimensions,
  ctx,
  theme,
  rotationAngle,
}: ComponentRenderArgument) => {
  const [width, height] = dimensions;

  if (!assetLoader.load(NAND).next().done) {
    return;
  }

  const nandImageAsset = assetLoader.load(NAND).next().value;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(nandImageAsset, 0, height / 2 + 2.5, width, height + 4);
  ctx.restore();

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);
  ctx.strokeText("NAND", -9, 2.5);
  ctx.fillText("NAND", -9, 2.5);
};

const XorSkin = ({
  dimensions,
  ctx,
  theme,
  rotationAngle,
}: ComponentRenderArgument) => {
  const [width, height] = dimensions;

  if (!assetLoader.load(XOR).next().done) {
    return;
  }

  const xorImageAsset = assetLoader.load(XOR).next().value;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(xorImageAsset, 0, height / 2 + 2.5, width, height + 7.5);
  ctx.restore();

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  // ctx.strokeText("XOR", width / 2, height / 2 + 3);
  // ctx.fillText("XOR", width / 2, height / 2 + 3);

  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);
  ctx.strokeText("XOR", -2.5, 2.5);
  ctx.fillText("XOR", -2.5, 2.5);
};

export const prepareTheme = (): CircTheme => {
  return {
    colors,
    library: {
      LED: LEDSkin,
      "NOT Gate": NotSkin,
      Pin: PinSkin,
      "AND Gate": AndSkin,
      "NAND Gate": NandSkin,
      "OR Gate": OrSkin,
      "XOR Gate": XorSkin,
    },
  };
};
