import {
  type AndState,
  type CircTheme,
  type DrawArguments,
  type LEDState,
  type PinState,
  type ThemeColor,
  type WireState,
  resolveCn,
} from "circ-renderer";
import { loadAsset } from "./assets";

export type ComponentFace = "north" | "south" | "east" | "west";

export const toFaceIndex = (face: ComponentFace) => {
  switch (face) {
    case "north":
      return 0;
    case "east":
      return 1;
    case "south":
      return 2;
    case "west":
      return 3;
  }
};

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
  state,
  scaleFactor = 1,
  bounds,
  theme,
  portsSignals,
}: DrawArguments<LEDState>) => {
  ctx.beginPath();
  const [loc, dim] = bounds;

  const [x, y] = loc;
  const [width, height] = dim;

  const isOn = portsSignals[0] === 1;

  ctx.fillStyle = isOn ? theme.colors.base60 : theme.colors.base50;

  ctx.strokeStyle = isOn ? theme.colors.base70 : theme.colors.base40;
  ctx.lineWidth = 1 * scaleFactor;

  ctx.arc(
    resolveCn(x, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(y, scaleFactor) + resolveCn(height, scaleFactor) / 2,
    5 * scaleFactor,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};

const PinSkin = ({
  bounds,
  ctx,
  theme,
  state,
  pointerLocation,
  portsSignals,
  scaleFactor = 1,
}: DrawArguments<PinState>) => {
  ctx.beginPath();
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  const isOn = portsSignals[0] === 1;

  ctx.lineWidth = 1 * scaleFactor;

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

  ctx.roundRect(
    resolveCn(ogX, scaleFactor),
    resolveCn(ogY, scaleFactor),
    resolveCn(width, scaleFactor),
    resolveCn(height, scaleFactor),
    2 * scaleFactor
  );
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();
  ctx.font = `${6 * scaleFactor}px monospace`;
  ctx.strokeText(
    isOn ? "1" : "0",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) +
      resolveCn(height, scaleFactor) / 2 +
      scaleFactor * 2
  );

  ctx.fillText(
    isOn ? "1" : "0",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) +
      resolveCn(height, scaleFactor) / 2 +
      scaleFactor * 2
  );
};

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sides: number,
  radius: number,
  rotation: number
) {
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI + rotation;
    const x_i = x + radius * Math.cos(angle) + (i === 0 ? 20 : 0);
    const y_i = y + radius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x_i, y_i);
    } else {
      ctx.lineTo(x_i, y_i);
    }
  }
}

const NotSkin = ({
  bounds,
  ctx,
  theme,
  scaleFactor = 1,
  faceAngles,
  face,
  assets,
}: DrawArguments<PinState>) => {
  ctx.save();
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  const angle = faceAngles[toFaceIndex(face)] + 90;

  const rad = (angle * Math.PI) / 180;

  ctx.translate(
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2
  );

  ctx.rotate(rad);

  const w = resolveCn(width, scaleFactor);
  const h = resolveCn(height, scaleFactor);

  const s = (scaleFactor * 10);

  ctx.drawImage(assets.NOT, -s, -s, w, h + s);

  ctx.rotate(-rad);

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("NOT", 0, -6 * scaleFactor);

  ctx.fillText("NOT", 0, -6 * scaleFactor);

  ctx.restore();
};

const AndSkin = ({
  bounds,
  ctx,
  theme,
  scaleFactor = 1,
  state,
  faceAngles,
  face,
  assets,
}: DrawArguments<AndState>) => {
  ctx.save();
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  const angle = faceAngles[toFaceIndex(face)] + 90;

  const rad = (angle * Math.PI) / 180;

  ctx.translate(
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2
  );

  ctx.rotate(rad);

  const w = resolveCn(width, scaleFactor);
  const h = resolveCn(height, scaleFactor);

  ctx.drawImage(assets.AND, w / -2, h / -2, w, h);

  ctx.rotate(-rad);

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("AND", 0, 2 * scaleFactor);

  ctx.fillText("AND", 0, 2 * scaleFactor);

  ctx.restore();
};

const NandSkin = ({
  bounds,
  ctx,
  theme,
  scaleFactor = 1,
  state,
  faceAngles,
  face,
  assets,
}: DrawArguments<AndState>) => {
  ctx.save();
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  const angle = faceAngles[toFaceIndex(face)] + 90;

  const rad = (angle * Math.PI) / 180;

  ctx.translate(
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2
  );

  ctx.rotate(rad);

  const w = resolveCn(width, scaleFactor);
  const h = resolveCn(height, scaleFactor);

  ctx.drawImage(assets.NAND, w / -2, h / -2, w, h + 30);

  ctx.rotate(-rad);

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("NAND", -9 * scaleFactor, 2 * scaleFactor);

  ctx.fillText("NAND", -9 * scaleFactor, 2 * scaleFactor);

  ctx.restore();
};

const WireSkin = ({
  ctx,
  theme,
  state,
  scaleFactor = 1,
  portsSignals: [signal],
}: DrawArguments<WireState>) => {
  const [x1, y1] = state.from;
  const [x2, y2] = state.to;

  const isOn = signal === 1;

  ctx.beginPath();
  ctx.moveTo(resolveCn(x1, scaleFactor), resolveCn(y1, scaleFactor));
  ctx.lineTo(resolveCn(x2, scaleFactor), resolveCn(y2, scaleFactor));
  ctx.lineWidth = ~~(scaleFactor * 2.5);
  ctx.lineCap = "round";
  ctx.strokeStyle = isOn ? theme.colors.green : theme.colors.base25;
  ctx.stroke();
  ctx.closePath();
};

const OrSkin = ({
  bounds,
  ctx,
  theme,
  scaleFactor = 1,
  state,
  faceAngles,
  face,
  assets,
}: DrawArguments<AndState>) => {
  ctx.save();
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  const angle = faceAngles[toFaceIndex(face)] + 90;

  const rad = (angle * Math.PI) / 180;

  ctx.translate(
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2
  );

  ctx.rotate(rad);

  const w = resolveCn(width, scaleFactor);
  const h = resolveCn(height, scaleFactor);

  ctx.drawImage(assets.OR, w / -2, h / -2, w, h);

  ctx.rotate(-rad);

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("OR", -2 * scaleFactor, 2 * scaleFactor);

  ctx.fillText("OR", -2 * scaleFactor, 2 * scaleFactor);

  ctx.restore();
};

const XorSkin = ({
  bounds,
  ctx,
  theme,
  scaleFactor = 1,
  state,
  assets,
  face,
  faceAngles,
}: DrawArguments<AndState>) => {
  ctx.save();
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  const angle = faceAngles[toFaceIndex(face)] + 90;

  const rad = (angle * Math.PI) / 180;

  ctx.translate(
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2
  );

  ctx.rotate(rad);

  const w = resolveCn(width, scaleFactor);
  const h = resolveCn(height, scaleFactor);

  ctx.drawImage(assets.XOR, w / -2, h / -2, w, h + 40);

  ctx.rotate(-rad);

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText("XOR", -2 * scaleFactor, 2 * scaleFactor);

  ctx.fillText("XOR", -2 * scaleFactor, 2 * scaleFactor);

  ctx.restore();
};

export const prepareTheme = async (): Promise<CircTheme> => {
  const assets = await loadAsset();

  return {
    colors,
    library: {
      LED: (drawArgs) => LEDSkin({ ...drawArgs, assets }),
      NOT: (drawArgs) => NotSkin({ ...drawArgs, assets }),
      pin: (drawArgs) => PinSkin({ ...drawArgs, assets }),
      wire: (drawArgs) => WireSkin({ ...drawArgs, assets }),
      AND: (drawArgs) => AndSkin({ ...drawArgs, assets }),
      NAND: (drawArgs) => NandSkin({ ...drawArgs, assets }),
      OR: (drawArgs) => OrSkin({ ...drawArgs, assets }),
      XOR: (drawArgs) => XorSkin({ ...drawArgs, assets }),
    },
  };
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
