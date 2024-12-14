export function toDecimal(base: number, powers: number[]) {
  return powers.reduce((s, v, i, a) => s + v * base ** (a.length - i - 1), 0);
}

export function fromDecimal(
  base: number,
  value: number,
  spots?: number
): [number[], number] {
  const result: number[] = spots === undefined ? [] : new Array(spots).fill(0);

  let remaining = value;
  let currentSpot = 0;

  while (remaining > 0) {
    if (spots !== undefined) {
      if (currentSpot >= spots) {
        break;
      }

      result[spots - currentSpot - 1] = remaining % base;
      currentSpot++;
    } else {
      result.unshift(remaining % base);
    }

    remaining = Math.floor(remaining / base);
  }

  return [result, remaining];
}

export function stepAt(
  value: number,
  step: number,
  pos: number,
  base: number,
  count: number
) {
  const incremental = step * base ** (count - pos - 1);

  return (value + incremental) % base ** count;
}
