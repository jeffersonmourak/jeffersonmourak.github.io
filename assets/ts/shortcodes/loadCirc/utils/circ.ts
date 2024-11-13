import { v4 as randomUUID } from "uuid";
import type { RenderContext } from "..";

/**
 * Electric signal types
 * - 0: Low
 * - 1: High - IN
 * - -1: HIGH - OUT
 * - 2: ERROR
 * - null: No signal
 */
export type ElectricSignal = 0 | 1 | -1 | 2 | null;

export type PropagationTarget = [number, number, ElectricSignal];

export type Pin = {
  id: string;
  key: string;
  name: string;
  signal: 0 | 1 | -1 | 2 | null;
  x: number;
  y: number;
  resolveSignalPropagation?: (
    inputSignal: ElectricSignal
  ) => PropagationTarget[];

  checkPointerColision?: (
    id: string,
    x: number,
    y: number,
    context: RenderContext
  ) => void;
  onPointerPress?: (
    id: string,
    x: number,
    y: number,
    context: RenderContext
  ) => void;
};

export const decodeCircCoords = (coords?: string) =>
  coords?.slice(1, -1).split(",").map(Number) ?? [0, 0];

export const getFacingOffset = (facing: string, size: number) => {
  switch (facing) {
    case "north":
      return [-1 * (size / 2), 0];
    case "south":
      return [-1 * (size / 2), -2 * (size / 2)];
    case "east":
      return [-2 * (size / 2), -1 * (size / 2)];
    case "west":
      return [0, -1 * (size / 2)];
  }
};

export const getCollisionFacingOffset = (facing: string, size: number) => {
  switch (facing) {
    case "north":
      return [
        [-size / 2, 0],
        [0, -size / 2],
      ];
    case "south":
      return [
        [-size / 2, 0],
        [-size,  size / 2],
      ];
    case "east":
      return [
        [-size, size / 2],
        [-size / 2, 0],
      ];
    case "west":
      return [
        [0, -size / 2],
        [-size / 2, 0],
      ];
  }
};

export const getArcFacingOffset = (facing: string, size: number) => {
  switch (facing) {
    case "north":
      return [-1 * (size / 2), 0];
    case "south":
      return [-1 * (size / 2), -2 * (size / 2)];
    case "east":
      return [-2 * (size / 2), -1 * (size / 2)];
    case "west":
      return [0, -1 * (size / 2)];
  }
};

export const getPinsData = (
  x: number,
  y: number,
  { pinSlots }: RenderContext
) => {
  const key = `${x},${y}`;

  const pins = pinSlots[key];

  if (!pins) {
    return null;
  }

  return pins;
};

export const getPinPowerState = (
  x: number,
  y: number,
  context: RenderContext
) => {
  const pins = getPinsData(x, y, context);

  if (!pins) {
    return null;
  }

  return pins.reduce((acc, pin) => {
    if (acc === 2 || pin.signal === 2) {
      return 2;
    }

    if (pin.signal === null) {
      return acc;
    }

    const signalSum = acc + pin.signal;

    if (signalSum > acc) {
      return 1;
    }

    if (signalSum < acc) {
      return -1;
    }

    return 0;
  }, 0);
};

export const isPowered = (x: number, y: number, context: RenderContext) => {
  return getPinPowerState(x, y, context) === 1;
};

export interface RegisterPinOptions {
  name: string;
  x: number;
  y: number;
  context: RenderContext;
  idGenerator?: (name: string, x: number, y: number, seed: string) => string;
  resolveSignalPropagation?: (
    inputSignal: ElectricSignal
  ) => PropagationTarget[];
  checkPointerColision?: (
    name: string,
    x: number,
    y: number,
    context: RenderContext
  ) => void;

  onPointerPress?: (
    id: string,
    x: number,
    y: number,
    context: RenderContext
  ) => void;
}

export const registerPin = ({
  name,
  x,
  y,
  context: { pinSlots, collidablePins },
  idGenerator = () => `[${x},${y}]`,
  resolveSignalPropagation = () => [],
  checkPointerColision,
  onPointerPress,
}: RegisterPinOptions): Pin => {
  const pinUuid = idGenerator(name, x, y, randomUUID());
  const key = `${x},${y}`;
  const pin: Pin = {
    id: pinUuid,
    key,
    name,
    signal: null,
    resolveSignalPropagation,
    checkPointerColision,
    onPointerPress,
    x,
    y,
  };

  if (!pinSlots[key]) {
    pinSlots[key] = [];
  }

  if (checkPointerColision !== undefined) {
    collidablePins.add(key);
  }

  const pinExists = pinSlots[key].find(
    (p) => p.id === pinUuid && p.name === name
  );

  if (pinExists) {
    return pinExists;
  }

  pinSlots[key].push(pin);

  return pin;
};

export const setPinSignal = (
  x: number,
  y: number,
  signal: ElectricSignal,
  context: RenderContext
) => {
  const { pinSlots, propagationQueue } = context;
  const key = `${x},${y}`;

  if (!pinSlots[key]) {
    return;
  }

  const resolutionQueue: Set<PropagationTarget> = new Set();

  for (const i in pinSlots[key]) {
    if (pinSlots[key][i].signal === signal) {
      continue;
    }

    pinSlots[key][i].signal = signal;

    if (pinSlots[key][i].resolveSignalPropagation) {
      const propagationEffect =
        pinSlots[key][i].resolveSignalPropagation(signal);

      if (propagationEffect.length > 0) {
        for (const effect of propagationEffect) {
          const skipNoPotential =
            effect[2] !== 2 &&
            getPinPowerState(effect[0], effect[1], context) === signal;

          if (skipNoPotential) {
            continue;
          }

          resolutionQueue.add(effect);
        }
      }
    }
  }

  resolutionQueue.size > 0 &&
    propagationQueue.push(Array.from(resolutionQueue));
};
