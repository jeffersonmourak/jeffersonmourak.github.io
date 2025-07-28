import type { Circuit, CircuitComponent, WireData } from "circ-renderer/src";
import type { ForegroundColorName } from "chalk";

const decodeCircCoords = (coords?: string, divider = 10): [number, number] => {
  const location = (coords
    ?.slice(1, -1)
    .split(",")
    .map((n) => Number(n) / divider) ?? [0, 0]) as [number, number];

  return location;
};

const getWireDirectionOffsets = (wire: WireData): [number, number] => {
  const from = decodeCircCoords(wire.from);
  const to = decodeCircCoords(wire.to);

  const xOffset = from[0] - to[0];
  const yOffset = from[1] - to[1];

  return [xOffset, yOffset];
};

const getWireDirection = (wire: WireData) => {
  return getWireDirectionOffsets(wire)[0] !== 0 ? "horizontal" : "vertical";
};

const asKey = (
  base: number,
  offset: number,
  direction: "horizontal" | "vertical" = "vertical",
  multiplier = 1
) => {
  return direction === "vertical"
    ? `${base * multiplier},${offset * multiplier}`
    : `${offset * multiplier},${base * multiplier}`;
};

const ComponentsName = {
  Pin: "X",
  LED: "O",
  "NOT Gate": "¬",
  "AND Gate": "∧",
  "OR Gate": "∨",
  "NAND Gate": "⊼",
  "NOR Gate": "⊽",
  "XOR Gate": "⊕",
  "XNOR Gate": "⊙",
} as Record<string, string>;

const makeComponentBlock = (
  component: CircuitComponent,
  noColor = false
): [string, string][] => {
  const [x, y] = decodeCircCoords(component.location);
  const { facing, size } = component.attributes;

  const normalizedSize = Number(size) / 10;

  let xOffset = facing === "east" ? -1 : facing === "west" ? 1 : 0;
  let yOffset = facing === "north" ? 1 : facing === "south" ? -1 : 0;

  let offsets: [number, number] = [xOffset, yOffset];

  if (["Pin", "LED"].includes(component.name)) {
    const char = noColor ? ComponentsName[component.name] ?? "?" : "░";

    return [[asKey(x, y), char]];
  }

  if (component.name === "NOT Gate") {
    const instructions: [string, string][] = [];
    for (let i = 0; i <= normalizedSize; i++) {
      const xOffset = offsets[0] * i;
      const yOffset = offsets[1] * i;

      const char = noColor ? ComponentsName[component.name] ?? "?" : "░";

      instructions.push([asKey(x + xOffset, y + yOffset), char]);
    }

    return instructions;
  }

  xOffset = facing === "east" ? -1 : facing === "west" ? 1 : 1;
  yOffset = facing === "north" ? 1 : facing === "south" ? -1 : 1;

  offsets = [xOffset, yOffset];

  const half = Math.floor(normalizedSize / 2);
  const remaining = normalizedSize - half;

  const instructions: [string, string][] = [];
  for (let i = -half; i < remaining; i++) {
    const yOffset = i * offsets[1] * offsets[0];
    for (let j = 0; j <= normalizedSize; j++) {
      const xOffset = offsets[0] * j;
      const char = noColor ? ComponentsName[component.name] ?? "?" : "▓";

      instructions.push([asKey(x + xOffset, y + yOffset), char]);
    }
  }

  return instructions;
};

export type GridData = [
  "c" | "w",
  number,
  number,
  string,
  string | undefined,
  string | undefined
];

export const useDisplayGrid = (circuit: Circuit | null, noColor = false) => {
  const grid = new Map<string, GridData>();
  let maxX = 0;
  let maxY = 0;

  const state = circuit?.state ?? [];

  for (let sI = 0; sI < state.length; sI++) {
    const color = state[sI] === 1 ? "green" : state[sI] === 0 ? "red" : "gray";
    const noColorChar = state[sI] === 1 ? "1" : "0";

    const group = circuit?.wires.connections.get(sI) ?? [];

    const wires =
      circuit?.wires.list?.filter((_, wI) => group.includes(wI)) ?? [];

    const pendingCorners: Set<string> = new Set();

    for (let wI = 0; wI < wires.length; wI++) {
      const wire = wires[wI]!;
      const to = decodeCircCoords(wire.to);
      const from = decodeCircCoords(wire.from);
      const direction = getWireDirection(wire);

      let smaller = Number.MAX_SAFE_INTEGER;
      let bigger = Number.MIN_SAFE_INTEGER;
      let base = from[1];
      let char = noColor ? noColorChar : "─";

      if (direction === "horizontal") {
        smaller = Math.min(from[0], to[0]) + 1;
        bigger = Math.max(from[0], to[0]);
        maxX = Math.max(maxX, bigger);
        maxY = Math.max(maxY, from[1]);
      } else {
        smaller = Math.min(from[1], to[1]) + 1;
        bigger = Math.max(from[1], to[1]);
        maxX = Math.max(maxX, from[0]);
        maxY = Math.max(maxY, bigger);
        base = from[0];
        char = noColor ? noColorChar : "│";
      }

      const cornerChar = noColor ? noColorChar : "?";

      grid.set(asKey(base, smaller - 1, direction), [
        "w",
        wI,
        sI,
        cornerChar,
        color,
        undefined,
      ]);

      if (!noColor) {
        pendingCorners.add(asKey(base, smaller - 1, direction));
      }

      while (smaller < bigger) {
        const key = asKey(base, smaller, direction);

        if (!grid.has(key)) {
          grid.set(key, ["w", wI, sI, char, color, undefined]);
        }

        smaller++;
      }

      grid.set(asKey(base, smaller, direction), [
        "w",
        wI,
        sI,
        cornerChar,
        color,
        undefined,
      ]);

      if (!noColor) {
        pendingCorners.add(asKey(base, smaller, direction));
      }
    }

    for (const corner of pendingCorners) {
      const [x, y] = corner.split(",").map(Number) as [number, number];

      const [left] = grid.get(asKey(x - 1, y)) ?? [];
      const [right] = grid.get(asKey(x + 1, y)) ?? [];
      const [up] = grid.get(asKey(x, y - 1)) ?? [];
      const [down] = grid.get(asKey(x, y + 1)) ?? [];
      const [type, cI, sI, _, foregroundColor, backgroundColor] =
        grid.get(corner)!;

      const neighbors = [left, right, up, down];
      const cornerNeighbors = neighbors.filter((n) => n !== undefined);

      if (cornerNeighbors.length === 4) {
        grid.set(corner, [type, cI, sI, "┼", foregroundColor, backgroundColor]);
        continue;
      }

      if (cornerNeighbors.length === 3) {
        if (left !== undefined && right !== undefined) {
          grid.set(corner, [
            type,
            cI,
            sI,
            up !== undefined ? "┴" : "┬",
            foregroundColor,
            backgroundColor,
          ]);
        } else if (up !== undefined && down !== undefined) {
          grid.set(corner, [
            type,
            cI,
            sI,
            left !== undefined ? "┤" : "├",
            foregroundColor,
            backgroundColor,
          ]);
        }
        continue;
      }

      if (cornerNeighbors.length === 2) {
        if (up !== undefined) {
          grid.set(corner, [
            type,
            cI,
            sI,
            left !== undefined ? "┘" : "└",
            foregroundColor,
            backgroundColor,
          ]);
        } else {
          grid.set(corner, [
            type,
            cI,
            sI,
            left !== undefined ? "┐" : "┌",
            foregroundColor,
            backgroundColor,
          ]);
        }
        continue;
      }

      if (cornerNeighbors.length === 1) {
        grid.set(corner, [type, cI, sI, "◉", foregroundColor, backgroundColor]);
      }
    }
  }

  const availableForegroundColors: ForegroundColorName[] = [
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "blueBright",
    "cyanBright",
    "magentaBright",
    "yellowBright",
  ];

  const componentTypeMap: Map<
    string,
    [string, string, string, ForegroundColorName]
  > = new Map();

  for (let i = 0; i < (circuit?.components.list.length ?? 0); i++) {
    const component = circuit!.components.list[i]!;
    const stateIndex = circuit?.wireConnections.get(component.location)!;
    const instructions = makeComponentBlock(component, noColor);

    for (const [key, char] of instructions) {
      grid.set(key, [
        "c",
        i,
        stateIndex,
        char,
        undefined,
        availableForegroundColors[i] as string,
      ]);

      if (!componentTypeMap.has(component.name)) {
        componentTypeMap.set(component.name, [
          key,
          char,
          component.name,
          availableForegroundColors[i]!,
        ]);
      }
    }
  }

  return {
    grid,
    maxX: maxX + 2,
    maxY: maxY + 2,
    legend: Array.from(componentTypeMap.values()),
  };
};
