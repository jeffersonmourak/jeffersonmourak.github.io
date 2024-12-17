import type {
  AndState,
  CircTheme,
  DrawArguments,
  LEDState,
  NandState,
  NotState,
  OrState,
  PinState,
  ThemeColor,
  WireState,
  XorState,
} from "circ-renderer";
import { loadAsset } from "./assets";

export type ComponentFace = "north" | "south" | "east" | "west";

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
}: DrawArguments<LEDState>) => {
  ctx.beginPath();
  const [width, height] = dimensions;

  const isOn = portsSignals[0] === 1;

  ctx.fillStyle = isOn ? theme.colors.base60 : theme.colors.base50;

  ctx.strokeStyle = isOn ? theme.colors.base70 : theme.colors.base40;
  ctx.lineWidth = 1;

  ctx.arc(width / 2, height / 2, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};

const PinSkin = ({
  dimensions,
  ctx,
  theme,
  state,
  pointerLocation,
  portsSignals,
}: DrawArguments<PinState>) => {
  ctx.beginPath();
  const [width, height] = dimensions;

  const isOn = portsSignals[0] === 1;

  ctx.lineWidth = 1;

  if (state.output) {
    ctx.fillStyle = isOn ? theme.colors.base60 : theme.colors.base50;
    ctx.strokeStyle = isOn ? theme.colors.base70 : theme.colors.base40;
  } else {
    if (pointerLocation !== null) {
      ctx.fillStyle = theme.colors.yellow;
      ctx.strokeStyle = theme.colors.yellow;
    } else {
      ctx.strokeStyle = isOn ? theme.colors.base35 : theme.colors.base20;
      ctx.fillStyle = isOn ? theme.colors.orange : theme.colors.green;
    }
  }

  ctx.roundRect(0, 0, width, height, 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();
  ctx.font = `${6}px monospace`;
  ctx.strokeText(isOn ? "1" : "0", width / 2, height / 2 + 2);
  ctx.fillText(isOn ? "1" : "0", width / 2, height / 2 + 2);
};

const NotSkin = ({
  dimensions,
  ctx,
  theme,
  assets,
}: DrawArguments<NotState>) => {
  const [width, height] = dimensions;

  ctx.drawImage(assets.NOT, 0, -height / 2, width, height * 2);

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.save();
  ctx.translate(width / 2, height);
  ctx.rotate(-Math.PI / 2);

  ctx.strokeText("NOT", 5, -5);

  ctx.fillText("NOT", 5, -5);
  ctx.restore();
};

const AndSkin = ({
  dimensions,
  ctx,
  theme,
  assets,
}: DrawArguments<AndState>) => {
  const [width, height] = dimensions;

  ctx.drawImage(assets.AND, 0, 0, width, height);

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("AND", width / 2, height / 2 + 3);
  ctx.fillText("AND", width / 2, height / 2 + 3);
};

const NandSkin = ({
  dimensions,
  ctx,
  theme,
  assets,
}: DrawArguments<AndState>) => {
  const [width, height] = dimensions;

  ctx.drawImage(assets.NAND, 0, 2.5, width, height + 5);

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();
  ctx.strokeText("NAND", width / 2, height - 2);
  ctx.fillText("NAND", width / 2, height - 2);
};

const WireSkin = ({
  ctx,
  theme,
  state,
  portsSignals: [signal],
}: DrawArguments<WireState>) => {
  const [x1, y1] = state.from;
  const [x2, y2] = state.to;

  const isOn = signal === 1;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = isOn ? theme.colors.green : theme.colors.base25;
  ctx.stroke();
  ctx.closePath();
};

const OrSkin = ({
  dimensions,
  ctx,
  theme,
  assets,
}: DrawArguments<AndState>) => {
  const [width, height] = dimensions;

  ctx.drawImage(assets.OR, 0, 0, width, height);

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("OR", width / 2, height / 2 + 3);
  ctx.fillText("OR", width / 2, height / 2 + 3);
};

const XorSkin = ({
  dimensions,
  ctx,
  theme,
  assets,
}: DrawArguments<AndState>) => {
  const [width, height] = dimensions;

  ctx.drawImage(assets.XOR, 0, 0, width, height + 10);

  ctx.beginPath();
  ctx.font = `${6}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("XOR", width / 2, height / 2 + 3);
  ctx.fillText("XOR", width / 2, height / 2 + 3);
};

export const prepareTheme = async (): Promise<CircTheme> => {
  const assets = await loadAsset();

  return {
    colors,
    library: {
      LED: (drawArgs) =>
        LEDSkin({ ...(drawArgs as DrawArguments<LEDState>), assets }),
      NOT: (drawArgs) =>
        NotSkin({ ...(drawArgs as DrawArguments<NotState>), assets }),
      pin: (drawArgs) =>
        PinSkin({ ...(drawArgs as DrawArguments<PinState>), assets }),
      wire: (drawArgs) =>
        WireSkin({ ...(drawArgs as DrawArguments<WireState>), assets }),
      AND: (drawArgs) =>
        AndSkin({ ...(drawArgs as DrawArguments<AndState>), assets }),
      NAND: (drawArgs) =>
        NandSkin({ ...(drawArgs as DrawArguments<NandState>), assets }),
      OR: (drawArgs) =>
        OrSkin({ ...(drawArgs as DrawArguments<OrState>), assets }),
      XOR: (drawArgs) =>
        XorSkin({ ...(drawArgs as DrawArguments<XorState>), assets }),
    },
  };
};
