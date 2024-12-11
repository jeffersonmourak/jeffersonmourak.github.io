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
  base00: "#ffffff",
  base05: "#f8f9fa",
  base10: "#f1f3f5",
  base20: "#e9ecef",
  base25: "#dee2e6",
  base30: "#ced4da",
  base35: "#adb5bd",
  base40: "#24b4ff",
  base50: "#bee3ff",
  base60: "#0b99ff",
  base70: "#0059b9",
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
  scaleFactor = 1,
}: DrawArguments<PinState>) => {
  ctx.beginPath();
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  ctx.fillStyle = state.output
    ? "blue"
    : pointerLocation !== null
    ? theme.colors.yellow
    : "green";

  ctx.roundRect(
    resolveCn(ogX, scaleFactor),
    resolveCn(ogY, scaleFactor),
    resolveCn(width, scaleFactor),
    resolveCn(height, scaleFactor),
    2 * scaleFactor
  );
  ctx.fill();
  ctx.closePath();
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
}: DrawArguments<PinState>) => {
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  ctx.beginPath();
  ctx.arc(
    resolveCn(ogX, scaleFactor) +
      resolveCn(width, scaleFactor) -
      3 * scaleFactor,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2,
    3 * scaleFactor,
    0,
    2 * Math.PI
  );

  drawPolygon(
    ctx,
    resolveCn(ogX, scaleFactor) + (5 * scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2,
    3,
    5 * scaleFactor,
    Math.PI * 2
  );

  ctx.closePath();
  ctx.fillStyle = theme.colors.backgroundPrimaryAlt;
  ctx.strokeStyle = theme.colors.primary1;
  ctx.lineWidth = 2 * scaleFactor;
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText(
    "NOT",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor)
  );

  ctx.fillText(
    "NOT",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor)
  );
};

const AndSkin = ({
  bounds,
  ctx,
  theme,
  scaleFactor = 1,
  state,
}: DrawArguments<AndState>) => {
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  ctx.beginPath();
  ctx.rect(
    resolveCn(ogX, scaleFactor),
    resolveCn(ogY, scaleFactor) + scaleFactor,
    resolveCn(width, scaleFactor) - (state.size / 2) * scaleFactor,
    resolveCn(height, scaleFactor) - scaleFactor * 2
  );
  ctx.arc(
    resolveCn(ogX, scaleFactor) +
      resolveCn(width, scaleFactor) -
      (state.size / 2) * scaleFactor,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2,
    (state.size / 3 + 4) * scaleFactor,
    0,
    2 * Math.PI
  );

  // drawPolygon(
  //   ctx,
  //   resolveCn(ogX, scaleFactor) + (5 * scaleFactor) / 2,
  //   resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2,
  //   3,
  //   5 * scaleFactor,
  //   Math.PI * 2
  // );

  ctx.closePath();
  ctx.fillStyle = theme.colors.backgroundPrimaryAlt;
  ctx.strokeStyle = theme.colors.primary1;
  ctx.lineWidth = 2 * scaleFactor;
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText(
    "AND",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) +
      resolveCn(height, scaleFactor) / 2 +
      scaleFactor * 2
  );

  ctx.fillText(
    "AND",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 2,
    resolveCn(ogY, scaleFactor) +
      resolveCn(height, scaleFactor) / 2 +
      scaleFactor * 2
  );
};

const NandSkin = ({
  bounds,
  ctx,
  theme,
  scaleFactor = 1,
  state,
}: DrawArguments<AndState>) => {
  const [loc, dim] = bounds;

  const [ogX, ogY] = loc;
  const [width, height] = dim;

  ctx.beginPath();
  ctx.rect(
    resolveCn(ogX, scaleFactor) - 10 * scaleFactor,
    resolveCn(ogY, scaleFactor) + scaleFactor,
    resolveCn(width, scaleFactor) - (state.size / 2 - 5) * scaleFactor,
    resolveCn(height, scaleFactor) - scaleFactor * 2
  );
  ctx.arc(
    resolveCn(ogX, scaleFactor) +
      resolveCn(width, scaleFactor) -
      (state.size / 2) * scaleFactor -
      5 * scaleFactor,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2,
    (state.size / 3 + 4) * scaleFactor,
    0,
    2 * Math.PI
  );

  // drawPolygon(
  //   ctx,
  //   resolveCn(ogX, scaleFactor) + (5 * scaleFactor) / 2,
  //   resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2,
  //   3,
  //   5 * scaleFactor,
  //   Math.PI * 2
  // );

  ctx.closePath();

  ctx.arc(
    resolveCn(ogX, scaleFactor) +
      resolveCn(width, scaleFactor) -
      state.size / 2 +
      2.6 * scaleFactor,
    resolveCn(ogY, scaleFactor) + resolveCn(height, scaleFactor) / 2,
    6 * scaleFactor,
    0,
    2 * Math.PI
  );

  ctx.fillStyle = theme.colors.backgroundPrimaryAlt;
  ctx.strokeStyle = theme.colors.primary1;
  ctx.lineWidth = 2 * scaleFactor;
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.font = `${6 * scaleFactor}px monospace`;

  ctx.fillStyle = theme.colors.base00;
  ctx.strokeStyle = theme.colors.base70;
  ctx.lineWidth = 0.5 * scaleFactor;
  ctx.textAlign = "center";
  ctx.fill();

  ctx.strokeText(
    "NAND",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 3,
    resolveCn(ogY, scaleFactor) +
      resolveCn(height, scaleFactor) / 2 +
      scaleFactor * 2
  );

  ctx.fillText(
    "NAND",
    resolveCn(ogX, scaleFactor) + resolveCn(width, scaleFactor) / 3,
    resolveCn(ogY, scaleFactor) +
      resolveCn(height, scaleFactor) / 2 +
      scaleFactor * 2
  );
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

export const theme: CircTheme = {
  colors,
  library: {
    LED: LEDSkin,
    NOT: NotSkin,
    pin: PinSkin,
    wire: WireSkin,
    AND: AndSkin,
    NAND: NandSkin,
  },
} as const;