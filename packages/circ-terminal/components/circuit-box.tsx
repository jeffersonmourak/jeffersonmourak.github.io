import { Box, Text } from 'ink';
import type { ForegroundColorName } from 'chalk';
import type { GridData } from '../hooks/use-display-grid';

interface CircuitBoxProps {
  grid: Map<string, GridData>;
  width: number;
  height: number;
  cursor: [number, number];
  legend: [string, string, string, ForegroundColorName][];
  interactive?: boolean;
  noColor?: boolean;
}

function GridCell({ data, inverse, noColor }: { data: GridData | undefined; inverse?: boolean; noColor?: boolean }) {
  if (!data) {
    return (
      <Text color={noColor ? undefined : 'gray'} inverse={inverse}>
        {' '}
      </Text>
    );
  }

  let [t, _i, _s, char, foregroundColor, backgroundColor] = data;

  if (noColor) {
    foregroundColor = undefined;
    backgroundColor = undefined;
  }

  if (t === 'w') {
    return (
      <Text color={foregroundColor} inverse={inverse} backgroundColor={backgroundColor}>
        {char}
      </Text>
    );
  }

  return (
    <Text color={backgroundColor} inverse={inverse} backgroundColor={foregroundColor}>
      {char}
    </Text>
  );
}

function CircuitBox({ grid, legend, width, height, cursor: [x, y], interactive, noColor }: CircuitBoxProps) {
  return (
    <Box borderStyle={interactive ? 'round' : undefined} flexDirection="column">
      {Array.from({ length: height }, (_, yI) => (
        <Box key={`y${yI}`} height={1} width={width} flexDirection="row">
          {Array.from({ length: width }, (_, xI) => (
            <GridCell key={`x${xI}`} data={grid.get(`${xI},${yI}`)} inverse={interactive && xI === x && yI === y} noColor={noColor} />
          ))}
        </Box>
      ))}
      {interactive && (
        <Box flexDirection="row" marginTop={1} gap={1}>
          {legend.map(([key, char, name, color]) => (
            <Text key={key} color="gray">
              <Text backgroundColor={color}>{char}</Text> {name}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CircuitBox;
