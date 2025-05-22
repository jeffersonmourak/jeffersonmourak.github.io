import type { CircTheme } from "circ-renderer";

import { assetsManager, decodeCircCoords, ui } from "circ-renderer";

import { AND, NAND, NOT, OR, XOR } from "./assets";
import type { ComponentRenderArgument } from "circ-renderer/src/modules/renderer";
import { box, image, styled, text } from "circ-renderer/src/modules/ui";

export type ComponentFace = "north" | "south" | "east" | "west";

const assetLoader = assetsManager();

export const colors = {
  background: "#090311",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "hsl(134 61% 41% / 1)",
  cyan: "#17a2b8",
  blue: "#007bff",
  purple: "#6f42c1",
  pink: "#e83e8c",
  //white
  white: "#ffffff",
  // green shades
  green00: "#165a26",
  green10: "#dee2e6",
  green20: "#ced4da",
  // orange shades
  orange00: "#634e0d",
  // blue shades
  blue00: "#24b4ff",
  blue10: "#bee3ff",
  blue20: "#0b99ff",
  blue30: "#0059b9",
  // black
  black: "#000000",
} as const;

export type ColorKeys = keyof typeof colors;

const LEDSkin = ({
  ctx,
  dimensions,
  theme,
  portsSignals,
}: ComponentRenderArgument<ColorKeys>) => {
  ctx.beginPath();
  const [width, height] = dimensions;

  const isOn = portsSignals[0] === 1;

  ctx.fillStyle = isOn ? theme.colors.blue20 : theme.colors.blue10;

  ctx.strokeStyle = isOn ? theme.colors.blue30 : theme.colors.blue00;
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
}: ComponentRenderArgument<ColorKeys>) => {
  ctx.beginPath();
  const [width, height] = dimensions;

  const isActive = portsSignals[0] === 1;

  const style = styled(
    [
      { borderRadius: 3, lineWidth: 1 },
      [
        "input:enabled",
        { fillStyle: theme.colors.orange, strokeStyle: theme.colors.orange00 },
      ],
      [
        "input:disabled",
        { fillStyle: theme.colors.green, strokeStyle: theme.colors.green00 },
      ],
      [
        "output:enabled",
        { fillStyle: theme.colors.blue20, strokeStyle: theme.colors.blue30 },
      ],
      [
        "output:disabled",
        { fillStyle: theme.colors.blue10, strokeStyle: theme.colors.blue00 },
      ],
      [
        "pointer",
        { fillStyle: theme.colors.yellow, strokeStyle: theme.colors.yellow },
      ],
    ],
    () => {
      if (pointerLocation !== null) {
        return "pointer";
      }

      const suffix = isActive ? "enabled" : "disabled";
      return component.attributes.output
        ? `output:${suffix}`
        : `input:${suffix}`;
    }
  );

  box({
    ctx,
    position: [3, 0],
    dimensions: [width, height],
    style,
  });

  ctx.translate(width - 2, height / 2);
  ctx.rotate(-rotationAngle);

  text({
    ctx,
    position: [0, 2],
    text: `${isActive ? "1" : "0"}`,
    style: {
      fillStyle: theme.colors.white,
      strokeStyle: theme.colors.blue30,
      lineWidth: 0.5,
      textAlign: "center",
      font: `${6}px monospace`,
    },
  });
};

const NotSkin = ({
  dimensions,
  ctx,
  theme,
  rotationAngle,
}: ComponentRenderArgument<ColorKeys>) => {
  const [width, height] = dimensions;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);

  image({
    ctx,
    assetLoader,
    position: [-height / 2, height],
    dimensions: [width, height * 2],
    image: NOT,
  });

  ctx.restore();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);

  text({
    ctx,
    position: [5, -5],
    text: "NOT",
    style: {
      font: `${6}px monospace`,
      fillStyle: theme.colors.white,
      strokeStyle: theme.colors.blue30,
      lineWidth: 0.5,
      textAlign: "center",
    },
  });
};

const AndSkin = ({
  dimensions,
  ctx,
  theme,
  rotationAngle,
}: ComponentRenderArgument<ColorKeys>) => {
  const [width, height] = dimensions;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);

  image({
    ctx,
    assetLoader,
    position: [0, height / 2],
    dimensions: [width, height],
    image: AND,
  });

  ctx.restore();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);

  text({
    ctx,
    position: [-0.5, 2.5],
    text: "AND",
    style: {
      font: `${6}px monospace`,
      fillStyle: theme.colors.white,
      strokeStyle: theme.colors.blue30,
      lineWidth: 0.5,
      textAlign: "center",
    },
  });
};

const OrSkin = ({
  dimensions,
  rotationAngle,
  ctx,
  theme,
}: ComponentRenderArgument<ColorKeys>) => {
  const [width, height] = dimensions;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);

  image({
    ctx,
    assetLoader,
    position: [0, height / 2],
    dimensions: [width, height],
    image: OR,
  });

  ctx.restore();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);

  text({
    ctx,
    position: [-0.5, 2.5],
    text: "OR",
    style: {
      font: `${6}px monospace`,
      fillStyle: theme.colors.white,
      strokeStyle: theme.colors.blue30,
      lineWidth: 0.5,
      textAlign: "center",
    },
  });
};

const NandSkin = ({
  dimensions,
  ctx,
  theme,
  rotationAngle,
}: ComponentRenderArgument<ColorKeys>) => {
  const [width, height] = dimensions;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);

  image({
    ctx,
    assetLoader,
    position: [0, height / 2 + 2.5],
    dimensions: [width, height + 4],
    image: NAND,
  });

  ctx.restore();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);

  text({
    ctx,
    position: [-9, 2.5],
    text: "NAND",
    style: {
      font: `${6}px monospace`,
      fillStyle: theme.colors.white,
      strokeStyle: theme.colors.blue30,
      lineWidth: 0.5,
      textAlign: "center",
    },
  });
};

const XorSkin = ({
  dimensions,
  ctx,
  theme,
  rotationAngle,
}: ComponentRenderArgument<ColorKeys>) => {
  const [width, height] = dimensions;

  ctx.save();
  ctx.translate(-width / 2, height);
  ctx.rotate(-Math.PI / 2);

  image({
    ctx,
    assetLoader,
    position: [0, height / 2],
    dimensions: [width, height + 12],
    image: XOR,
  });

  ctx.restore();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-rotationAngle);

  text({
    ctx,
    position: [-2.5, 2.5],
    text: "XOR",
    style: {
      font: `${6}px monospace`,
      fillStyle: theme.colors.white,
      strokeStyle: theme.colors.blue30,
      lineWidth: 0.5,
      textAlign: "center",
    },
  });
};

export const blogTheme: CircTheme<ColorKeys> = {
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
  wires(ctx, theme, circuit, gridSize) {
    const { wires, state } = circuit;

    for (let i = 0; i < state.length; i++) {
      const groups = wires.connections.get(i);

      if (!groups) {
        continue;
      }

      for (const j of groups) {
        const wire = wires.list[j];
        const to = decodeCircCoords(wire.to);
        const from = decodeCircCoords(wire.from);

        const x1 = from[0] * gridSize;
        const y1 = from[1] * gridSize;
        const x2 = to[0] * gridSize;
        const y2 = to[1] * gridSize;
        const isOn = state[i] === 1;

        ui.line({
          ctx,
          from: [x1, y1],
          to: [x2, y2],
          style: {
            lineWidth: 2,
            lineCap: "round",
            strokeStyle: isOn ? theme.colors.green : theme.colors.green10,
          },
        });
      }
    }
  },
  ports(ctx, theme, component, circuit, _, gridSize = 10) {
    const inputStateAddr = circuit.wireConnections.get(component.location);

    if (inputStateAddr === undefined) {
      return;
    }

    const coords = decodeCircCoords(component.location);
    const inputFillStyle =
      circuit.state[inputStateAddr] === 1
        ? theme.colors.orange
        : theme.colors.orange00;

    ui.circle({
      ctx,
      center: [coords[0] * gridSize, coords[1] * gridSize],
      radius: 0.25 * gridSize,
      style: {
        fillStyle: inputFillStyle,
      },
    });

    for (const port of component.ports) {
      const portStateAdrr = circuit.wireConnections.get(port);
      if (portStateAdrr === undefined) {
        continue;
      }

      const portLoc = decodeCircCoords(port);
      const fillStyle =
        circuit.state[portStateAdrr] === 1
          ? theme.colors.orange
          : theme.colors.orange00;

      ui.circle({
        ctx,
        center: [portLoc[0] * gridSize, portLoc[1] * gridSize],
        radius: 0.25 * gridSize,
        style: {
          fillStyle,
        },
      });
    }
  },
};
