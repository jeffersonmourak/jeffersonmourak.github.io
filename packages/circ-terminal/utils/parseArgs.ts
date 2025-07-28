const matchExpression = /^\s*?(?<index>[0-9]*)(\s?),(\s?)(?<value>[0-1]*)\s*?$/;

export function parseProbeArgs(args: string[]) {
  const validProbes: [number, number][] = [];

  for (const arg of args) {
    const match = arg.match(matchExpression);
    if (!match || !match.groups) {
      throw new Error(`Invalid probe argument: ${arg}`);
    }

    const { index, value } = match.groups as {
      index: string;
      value: string;
    };

    if (!index || !value) {
      throw new Error(
        `Invalid probe argument: ${arg}. Expected format: <index>,<value>`
      );
    }

    const parsedIndex = Number.parseInt(index, 10);
    const parsedValue = Number.parseInt(value, 10);

    validProbes.push([parsedIndex, parsedValue]);
  }

  return validProbes;
}
