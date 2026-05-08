import {
  ComponentKind,
  type CircTheme,
  type Signal,
  type Skin,
} from "./lib";
import { type AssetsLibrary, loadAssets } from "./blog-assets";

/**
 * Async-loaded PNG sprites for the gate symbols. Skins fall back to
 * vector outlines until the images resolve; once they do, the theme
 * fires `onAssetsReady` so the host can re-render.
 */
let sprites: AssetsLibrary | null = null;
const readyCallbacks: Array<() => void> = [];

export const blogAssetsReady = loadAssets().then((lib) => {
  sprites = lib;
  for (const cb of readyCallbacks) cb();
});

export function onBlogAssetsReady(cb: () => void): () => void {
  if (sprites) {
    cb();
    return () => { };
  }
  readyCallbacks.push(cb);
  return () => {
    const i = readyCallbacks.indexOf(cb);
    if (i >= 0) readyCallbacks.splice(i, 1);
  };
}

/**
 * Replicates the dark theme used on jeffersonmourak.github.io.
 *   - Inputs: ORANGE when HIGH, GREEN when LOW (matches the blog's
 *     "calm = green, triggered = orange" convention), YELLOW on hover.
 *   - Outputs / LEDs: blue family.
 *   - NOT / AND: PNG sprites on the dark background.
 *   - Wires: HSL forest green when carrying signal, pale gray when idle.
 *   - Port dots: orange filled circles per the blog's `ports()` override.
 */
export const blogColors = {
  background: "#090311",
  grid: "#1c0f2a",
  stroke: "#ffffff",
  fillIdle: "#1c0f2a",
  fillActive: "hsl(134 61% 41% / 1)",
  fillUndefined: "#241636",
  wireIdle: "#dee2e6",
  wireActive: "hsl(134 61% 41% / 1)",
  wireUndefined: "#3a2752",
  label: "#ffffff",
  labelMuted: "#aaa",
  macro: "#bea7ff",
  // ----- custom keys used by skins below -----
  inputOn: "#fd7e14",            // bright orange — pin clicked HIGH
  inputOff: "hsl(134 61% 41%)",  // forest green — pin resting at LOW
  inputBorderOn: "#634e0d",
  inputBorderOff: "#165a26",     // green00
  inputHover: "#ffc107",
  outputOn: "#0b99ff",
  outputOff: "#bee3ff",
  outputBorderOn: "#0059b9",
  outputBorderOff: "#24b4ff",
  portOn: "#fd7e14",
  portOff: "#634e0d",
} as const;

type Key = keyof typeof blogColors;

/**
 * Stroke a horizontal "tail" between the gate's actual visual edge and
 * the wire's endpoint cell-center. Drawn BEFORE the gate symbol so the
 * symbol covers the tail's gate-edge end cleanly.
 */
function drawTailLine(
  ctx: CanvasRenderingContext2D,
  gateEdge: number,
  portEnd: number,
  y: number,
  signal: Signal,
  theme: CircTheme<Key>
) {
  ctx.strokeStyle =
    signal === 1
      ? theme.colors.wireActive
      : signal === 0
        ? theme.colors.wireIdle
        : theme.colors.wireUndefined;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(gateEdge, y);
  ctx.lineTo(portEnd, y);
  ctx.stroke();
}

/**
 * Stamp the orange terminal dot at the tail's gate-edge end. Drawn
 * AFTER the gate symbol so the dot always sits on top of the gate.
 */
function drawTailDot(
  ctx: CanvasRenderingContext2D,
  cell: number,
  gateEdge: number,
  y: number,
  signal: Signal,
  theme: CircTheme<Key>
) {
  ctx.fillStyle = signal === 1 ? theme.colors.portOn : theme.colors.portOff;
  ctx.beginPath();
  ctx.arc(gateEdge, y, cell * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw the component's name as a small label hovering just below its
 * bounding box. Used by NOT, AND, and the small input/output pins.
 */
function drawNameBelow(
  ctx: CanvasRenderingContext2D,
  cell: number,
  name: string,
  bx: number, by: number, bw: number, bh: number,
  color: string,
  yOffset: number = 0
) {
  if (!name) return;
  ctx.fillStyle = color;
  ctx.font = `500 ${Math.round(cell * 0.65)}px ui-monospace, "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(name, bx + bw / 2, by + bh + (cell + yOffset) * 0.05);
}

/**
 * Pins narrower than ~7 cells (≤2-char names) put the name BELOW the
 * circle; wider boxes can fit the name inside, replacing the 0/1.
 */
function nameFitsInside(component: { name: string; width: number }): boolean {
  return component.name.length >= 3 || component.width >= 7;
}

/** Filled circle inscribed in the box, with a 0/1 label inside. */
function drawPinCircle(
  ctx: CanvasRenderingContext2D,
  cell: number,
  bx: number, by: number,
  bw: number, bh: number,
  fill: string, stroke: string,
  label: string,
  font: string,
  labelColor: string
) {
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  const r = Math.min(bw, bh) / 2 - cell * 0.05;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(3, cell * 0.16);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = labelColor;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy);
}

const drawInputPin: Skin<Key> = ({
  ctx,
  cell,
  component,
  outputSignal,
  hovered,
  theme,
}) => {
  const x = component.x * cell;
  const y = component.y * cell;
  const w = component.width * cell;
  const h = component.height * cell;
  const isOn = outputSignal === 1;

  // Source tail: from where the wire ended (out_port cell-center) to a
  // small gap outside the inscribed circle's east edge — leaves visible
  // breathing room between the orange terminal dot and the pin body.
  const r = Math.min(w, h) / 2 - cell * 0.05;
  const cx = x + w / 2;
  const tailEdge = cx + r + cell * 0.45;
  const portY = component.outPort.y * cell + cell / 2;
  const portX = component.outPort.x * cell + cell / 2;
  drawTailLine(ctx, tailEdge, portX, portY, outputSignal, theme);

  let fill = isOn ? theme.colors.inputOn : theme.colors.inputOff;
  let stroke = isOn ? theme.colors.inputBorderOn : theme.colors.inputBorderOff;
  if (hovered) {
    fill = theme.colors.inputHover;
    stroke = theme.colors.inputHover;
  }
  // Wide-enough boxes carry the name inside the circle; narrow pins keep
  // showing the live 0/1 inside and hover the name below the box.
  const inside = nameFitsInside(component) ? component.name : isOn ? "1" : "0";
  drawPinCircle(
    ctx, cell, x, y, w, h,
    fill, stroke,
    inside,
    theme.font ?? `600 ${Math.round(cell * 0.8)}px ui-monospace, monospace`,
    theme.colors.label
  );
  if (!nameFitsInside(component)) {
    drawNameBelow(ctx, cell, component.name, x, y, w, h, theme.colors.labelMuted);
  }

  drawTailDot(ctx, cell, tailEdge, portY, outputSignal, theme);
};

const drawOutputPin: Skin<Key> = ({
  ctx,
  cell,
  component,
  inputSignals,
  theme,
}) => {
  const x = component.x * cell;
  const y = component.y * cell;
  const w = component.width * cell;
  const h = component.height * cell;
  const sig = inputSignals[0] ?? 2;
  const isOn = sig === 1;

  // Sink tail: from in_port cell-center to a small gap outside the
  // circle's west edge.
  const r = Math.min(w, h) / 2 - cell * 0.05;
  const cx = x + w / 2;
  const tailEdge = cx - r - cell * 0.45;
  const slot = component.inPorts[0];
  let dotY = 0;
  if (slot) {
    const portX = slot.coord.x * cell + cell / 2;
    dotY = slot.coord.y * cell + cell / 2;
    drawTailLine(ctx, tailEdge, portX, dotY, sig, theme);
  }

  const inside = nameFitsInside(component) ? component.name : isOn ? "1" : "0";
  drawPinCircle(
    ctx, cell, x, y, w, h,
    isOn ? theme.colors.outputOn : theme.colors.outputOff,
    isOn ? theme.colors.outputBorderOn : theme.colors.outputBorderOff,
    inside,
    theme.font ?? `600 ${Math.round(cell * 0.7)}px ui-monospace, monospace`,
    theme.colors.label
  );
  if (!nameFitsInside(component)) {
    drawNameBelow(ctx, cell, component.name, x, y, w, h, theme.colors.labelMuted);
  }

  if (slot) drawTailDot(ctx, cell, tailEdge, dotY, sig, theme);
};

const drawLed: Skin<Key> = ({ ctx, cell, component, inputSignals, theme }) => {
  const cx = (component.x + component.width / 2) * cell;
  const cy = (component.y + component.height / 2) * cell;
  const r = Math.min(component.width, component.height) * cell * 0.4;
  const sig = inputSignals[0] ?? 2;
  const isOn = sig === 1;

  // Sink tail with a small gap so the orange dot doesn't kiss the LED.
  const tailEdge = cx - r - cell * 0.45;
  const slot = component.inPorts[0];
  let dotY = 0;
  if (slot) {
    const portX = slot.coord.x * cell + cell / 2;
    dotY = slot.coord.y * cell + cell / 2;
    drawTailLine(ctx, tailEdge, portX, dotY, sig, theme);
  }

  ctx.fillStyle = isOn ? theme.colors.outputOn : theme.colors.outputOff;
  ctx.strokeStyle = isOn ? theme.colors.outputBorderOn : theme.colors.outputBorderOff;
  ctx.lineWidth = Math.max(2, cell * 0.28);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (isOn) {
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  drawNameBelow(
    ctx, cell, component.name,
    component.x * cell, component.y * cell,
    component.width * cell, component.height * cell,
    theme.colors.labelMuted
  );

  if (slot) drawTailDot(ctx, cell, tailEdge, dotY, sig, theme);
};

/**
 * Compute where a square sprite would land inside a box of (w × h),
 * preserving aspect ratio (size = min(w, h), centered). Used by skins
 * to anchor tails at the sprite's actual silhouette rather than at the
 * box border, which can be larger than the sprite for non-square boxes
 * (e.g. NOT is 5×3 cells but the sprite is 1:1).
 */
function spriteRect(x: number, y: number, w: number, h: number) {
  const size = Math.min(w, h);
  const cx = x + w / 2;
  const cy = y + h / 2;
  return { left: cx - size / 2, right: cx + size / 2, size, cx, cy };
}

/**
 * Draw a sprite into the component box, preserving aspect ratio. The
 * blog's PNGs are drawn with the gate pointing UP, so we rotate 90°
 * clockwise to match the layout's left-to-right flow.
 */
function drawSprite(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number,
  w: number, h: number
) {
  const rect = spriteRect(x, y, w, h);
  ctx.save();
  ctx.translate(rect.cx, rect.cy);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(img, -rect.size / 2, -rect.size / 2, rect.size, rect.size);
  ctx.restore();
}

/** PNG triangle+bubble; falls back to a stroked vector while loading. */
const drawNot: Skin<Key> = ({ ctx, cell, component, inputSignals, outputSignal, theme }) => {
  const x0 = component.x * cell;
  const y0 = component.y * cell;
  const w = component.width * cell;
  const h = component.height * cell;

  // Anchor tails just outside the sprite's actual silhouette (with a
  // small gap matching the input/output pins) so the orange dot has
  // breathing room from the gate symbol.
  const usingSprite = !!sprites?.NOT;
  const rect = spriteRect(x0, y0, w, h);
  const gap = cell * 0.45;
  const leftEdge = (usingSprite ? rect.left : x0 + w * 0.1) - gap;
  const rightEdge = (usingSprite ? rect.right : x0 + w * 0.95) + gap;

  const inSlot = component.inPorts[0];
  const inSig = inputSignals[0] ?? 2;
  const inDotY = inSlot ? inSlot.coord.y * cell + cell / 2 : 0;
  if (inSlot) {
    const portX = inSlot.coord.x * cell + cell / 2;
    drawTailLine(ctx, leftEdge, portX, inDotY, inSig, theme);
  }
  const outDotY = component.outPort.y * cell + cell / 2;
  drawTailLine(
    ctx, rightEdge,
    component.outPort.x * cell + cell / 2,
    outDotY, outputSignal, theme
  );

  if (usingSprite) {
    drawSprite(ctx, sprites!.NOT, x0, y0, w, h);
  } else {
    ctx.strokeStyle = theme.colors.stroke;
    ctx.fillStyle = theme.colors.background;
    ctx.lineWidth = Math.max(1, cell * 0.1);
    const triRight = x0 + w * 0.78;
    ctx.beginPath();
    ctx.moveTo(x0 + cell * 0.2, y0 + h * 0.18);
    ctx.lineTo(x0 + cell * 0.2, y0 + h * 0.82);
    ctx.lineTo(triRight, y0 + h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    const bubbleR = Math.min(cell * 0.3, h * 0.18);
    ctx.beginPath();
    ctx.arc(triRight + bubbleR + cell * 0.05, y0 + h / 2, bubbleR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (inSlot) drawTailDot(ctx, cell, leftEdge, inDotY, inSig, theme);
  drawTailDot(ctx, cell, rightEdge, outDotY, outputSignal, theme);

  drawNameBelow(ctx, cell, component.name, x0, y0, w, h, theme.colors.labelMuted, -cell * 15);
};

/** PNG D-shape; falls back to a stroked vector while loading. */
const drawAnd: Skin<Key> = ({ ctx, cell, component, inputSignals, outputSignal, theme }) => {
  const x0 = component.x * cell;
  const y0 = component.y * cell;
  const w = component.width * cell;
  const h = component.height * cell;

  // Anchor tails outside the AND silhouette with the same gap used by
  // the pin skins.
  const gap = cell * 0.45;
  const leftEdge = x0 + w * 0.1 - gap;
  const rightEdge = x0 + w * 0.92 + gap;

  // Input tail lines.
  const inDotYs: number[] = [];
  for (let i = 0; i < component.inPorts.length; i++) {
    const slot = component.inPorts[i];
    const sig = inputSignals[i] ?? 2;
    const portX = slot.coord.x * cell + cell / 2;
    const portY = slot.coord.y * cell + cell / 2;
    inDotYs.push(portY);
    drawTailLine(ctx, leftEdge, portX, portY, sig, theme);
  }
  // Output tail line.
  const outDotY = component.outPort.y * cell + cell / 2;
  drawTailLine(
    ctx, rightEdge,
    component.outPort.x * cell + cell / 2,
    outDotY, outputSignal, theme
  );

  if (sprites?.AND) {
    drawSprite(ctx, sprites.AND, x0, y0, w, h);
  } else {
    ctx.strokeStyle = theme.colors.stroke;
    ctx.fillStyle = theme.colors.background;
    ctx.lineWidth = Math.max(1, cell * 0.1);
    const left = x0 + cell * 0.15;
    const top = y0 + cell * 0.15;
    const bot = y0 + h - cell * 0.15;
    const flat = x0 + w * 0.5;
    const right = x0 + w - cell * 0.15;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(flat, top);
    ctx.bezierCurveTo(right, top, right, bot, flat, bot);
    ctx.lineTo(left, bot);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  for (let i = 0; i < component.inPorts.length; i++) {
    drawTailDot(ctx, cell, leftEdge, inDotYs[i], inputSignals[i] ?? 2, theme);
  }
  drawTailDot(ctx, cell, rightEdge, outDotY, outputSignal, theme);

  // AND is large enough to carry its name centered inside the gate body.
  if (component.name) {
    ctx.fillStyle = theme.colors.label;
    ctx.font = `600 ${Math.round(cell * 0.7)}px ui-monospace, "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(component.name, x0 + w / 2, y0 + h / 2);
  }
};

/**
 * Per-subcircuit-type sprite map. Builtin macros (and/nand/or/xor/not)
 * render with their primitive sprite so the macro reads as a familiar
 * gate; everything else falls back to a labeled box.
 */
function spriteForSubcircuit(type: string): HTMLImageElement | undefined {
  if (!sprites) return undefined;
  switch (type.toLowerCase()) {
    case "and":  return sprites.AND;
    case "nand": return sprites.NAND;
    case "or":   return sprites.OR;
    case "xor":  return sprites.XOR;
    case "not":  return sprites.NOT;
    default:     return undefined;
  }
}

/**
 * Subcircuit (collapsed macro) skin.
 *   - Splits "type:alias" into the gate's TYPE — rendered as the
 *     matching primitive sprite if we have one, else a labeled box —
 *     and the INSTANCE alias hovering below as a normal name label.
 *   - Tails + orange dots for each in_port and the out_port, identical
 *     to the AND/NOT skins.
 */
const drawSubcircuit: Skin<Key> = ({
  ctx, cell, component, inputSignals, outputSignal, theme,
}) => {
  const x0 = component.x * cell;
  const y0 = component.y * cell;
  const w = component.width * cell;
  const h = component.height * cell;
  const subcircuit = component.kind.tag === "subcircuit"
    ? component.kind.subcircuit
    : "";
  const sprite = spriteForSubcircuit(subcircuit);
  const usingSprite = !!sprite;

  // Tails — anchor outside the silhouette with the same gap pin/AND use.
  const gap = cell * 0.45;
  const rect = spriteRect(x0, y0, w, h);
  const leftEdge = (usingSprite ? rect.left : x0 + w * 0.08) - gap;
  const rightEdge = (usingSprite ? rect.right : x0 + w * 0.92) + gap;

  const inDotYs: number[] = [];
  for (let i = 0; i < component.inPorts.length; i++) {
    const slot = component.inPorts[i];
    const sig = inputSignals[i] ?? 2;
    const portX = slot.coord.x * cell + cell / 2;
    const portY = slot.coord.y * cell + cell / 2;
    inDotYs.push(portY);
    drawTailLine(ctx, leftEdge, portX, portY, sig, theme);
  }
  const outDotY = component.outPort.y * cell + cell / 2;
  drawTailLine(
    ctx, rightEdge,
    component.outPort.x * cell + cell / 2,
    outDotY, outputSignal, theme
  );

  // Symbol.
  if (usingSprite) {
    drawSprite(ctx, sprite, x0, y0, w, h);
  } else {
    // Generic macro box for subcircuits without a sprite (mux, dff, etc.).
    ctx.strokeStyle = theme.colors.macro;
    ctx.fillStyle = theme.colors.fillIdle;
    ctx.lineWidth = Math.max(2, cell * 0.12);
    const r = cell * 0.25;
    const bw = w - cell * 0.16, bh = h - cell * 0.16;
    ctx.beginPath();
    ctx.roundRect(x0 + cell * 0.08, y0 + cell * 0.08, bw, bh, r);
    ctx.fill();
    ctx.stroke();
    // Type name centered.
    ctx.fillStyle = theme.colors.label;
    ctx.font = `600 ${Math.round(cell * 0.75)}px ui-monospace, "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(subcircuit, x0 + w / 2, y0 + h / 2);
  }

  // Tail dots on top.
  for (let i = 0; i < component.inPorts.length; i++) {
    drawTailDot(ctx, cell, leftEdge, inDotYs[i], inputSignals[i] ?? 2, theme);
  }
  drawTailDot(ctx, cell, rightEdge, outDotY, outputSignal, theme);

  // Instance alias as a label below the box.
  drawNameBelow(ctx, cell, component.name, x0, y0, w, h, theme.colors.labelMuted);
};

export const blogTheme: CircTheme<Key> = {
  colors: blogColors,
  font: '600 11px ui-monospace, "JetBrains Mono", monospace',
  skins: {
    [ComponentKind.InputPin]: drawInputPin,
    [ComponentKind.OutputPin]: drawOutputPin,
    [ComponentKind.Led]: drawLed,
    [ComponentKind.NotGate]: drawNot,
    [ComponentKind.AndGate]: drawAnd,
    subcircuit: drawSubcircuit,
  },
  background: ({ ctx, cell, width, height, theme }) => {
    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(-4, -4, width * cell + 8, height * cell + 8);
  },
  /**
   * 2px round-cap segments — matches the line style the blog used in its
   * `wires` override. Differs from the default in lineWidth (smaller +
   * uniform regardless of cell size) and skips the in-box stubs (the
   * orange port dots already anchor wires to gates).
   */
  wire: ({ ctx, cell, wire, signal, theme }) => {
    ctx.strokeStyle =
      signal === 1
        ? theme.colors.wireActive
        : signal === 0
          ? theme.colors.wireIdle
          : theme.colors.wireUndefined;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (const seg of wire.segments) {
      ctx.moveTo(seg.from.x * cell + cell / 2, seg.from.y * cell + cell / 2);
      ctx.lineTo(seg.to.x * cell + cell / 2, seg.to.y * cell + cell / 2);
    }
    ctx.stroke();
  },
  /**
   * No port markers — each skin draws its own tail from the gate's
   * visual edge to the wire endpoint, so the wire visually meets the
   * symbol without needing a circle/arrow at the boundary.
   */
  portMarker: () => { },
};
