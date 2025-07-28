import { Text } from 'ink';
import type { GridData } from '../hooks/use-display-grid';
import type { Circuit } from 'circ-renderer/src';

function ComponentDescription({ gridData, circuit }: { gridData: GridData | undefined; circuit: Circuit | null }) {
  if (!gridData || circuit === null) {
    return null;
  }

  const [type, index, state, _] = gridData;

  if (type === 'w') {
    return <Text>{`wire (${circuit.state[state] === 1 ? 'ON' : 'OFF'})`}</Text>;
  }

  const component = circuit.components.list[index];
  if (!component) {
    return null;
  }

  const componentName = component.name;
  const componentState = circuit.state[state];

  return (
    <Text>
      {`${componentName}`}
      {componentName === 'Pin' ? ` (${componentState === 1 ? 'ON' : 'OFF'})` : ''}
    </Text>
  );
}

export default ComponentDescription;
