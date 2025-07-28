import { Box, Text, useApp, useInput } from 'ink';
import useStdoutDimensions from '../hooks/use-stdout-dimensions';
import type { Circuit } from 'circ-renderer/src';
import { useState } from 'react';
import CircuitBox from './circuit-box';
import { useDisplayGrid } from '../hooks/use-display-grid';
import ComponentDescription from './component-description';

interface TerminalCircuitProps {
  circuit: Circuit | null;
  onUpdateState: (state: number, index: number) => void;
  interactive?: boolean;
  noColor?: boolean;
}

const TerminalCircuit = ({ circuit, onUpdateState, interactive, noColor }: TerminalCircuitProps) => {
  const [columns, rows] = useStdoutDimensions();
  const { grid, maxX, maxY, legend } = useDisplayGrid(circuit, noColor);
  const { exit } = useApp();

  const [[x, y], setCursor] = useState([0, 0]);

  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }

    if (circuit && input === ' ') {
      const gridData = grid.get(`${x},${y}`);
      if (!gridData) {
        return;
      }
      const [type, index, state, char, foregroundColor, backgroundColor] = gridData;
      if (type === 'c') {
        const component = circuit.components.list[index];
        if (!component || component.name !== 'Pin') {
          return;
        }

        onUpdateState(state, circuit.state[state] === 1 ? 0 : 1);
      } else if (type === 'w') {
        onUpdateState(state, circuit.state[state] === 1 ? 0 : 1);
      }
    }

    if (key.leftArrow) {
      setCursor((prev) => [Math.max(prev[0] - 1, 0), prev[1]]);
    }
    if (key.rightArrow) {
      setCursor((prev) => [Math.min(prev[0] + 1, maxX - 1), prev[1]]);
    }
    if (key.upArrow) {
      setCursor((prev) => [prev[0], Math.max(prev[1] - 1, 0)]);
    }
    if (key.downArrow) {
      setCursor((prev) => [prev[0], Math.min(prev[1] + 1, maxY - 1)]);
    }
  });

  if (!interactive) {
    return <CircuitBox grid={grid} width={maxX + 2} height={maxY + 2} cursor={[0, 0]} noColor={noColor} interactive={interactive} legend={legend} />;
  }

  return (
    <Box flexDirection="column" width={columns - 1} height={rows - 1} justifyContent="space-between">
      <Box flexDirection="column">
        <Box>
          <CircuitBox grid={grid} width={maxX + 2} height={maxY + 2} cursor={[x, y]} legend={legend} noColor={noColor} interactive={interactive} />
        </Box>
        <Box flexDirection="row" gap={1}>
          <Text color="gray" backgroundColor="black" bold>
            ({`${x},${y}`})
          </Text>
          <Text>
            <ComponentDescription circuit={circuit} gridData={grid.get(`${x},${y}`)} />
          </Text>
        </Box>
      </Box>
      <Text color="gray" backgroundColor="black" bold>
        {` Press 'q' to exit. `}
      </Text>
    </Box>
  );
};

export default TerminalCircuit;
