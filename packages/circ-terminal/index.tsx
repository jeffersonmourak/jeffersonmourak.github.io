import { loadLogisimInput } from 'circ-renderer/src';
import CircuitSimulator from 'circ-renderer/src/modules/simulator';
import TerminalCircuit from './components/terminal-circuit';
import { render, Static } from 'ink';
import { fetchConfigFile, fetchFileContent } from './utils/fetchFile';
import { parseArgs } from 'node:util';
import { parseProbeArgs } from './utils/parseArgs';

const [commandFilename, ...args] = [...Bun.argv].slice(2);

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    probe: {
      type: 'string',
      short: 'p',
      multiple: true,
      default: [],
      description: 'Probes to display, can be specified multiple times',
    },
    interactive: {
      type: 'boolean',
      short: 'i',
      default: false,
      description: 'Run in interactive mode',
    },
    noColor: {
      type: 'boolean',
      short: 'C',
      default: false,
      description: 'Disable color output',
    },
  },
  strict: true,
  allowPositionals: true,
});

try {
  const { interactive, noColor, probe } = values;

  const parsedProbes = parseProbeArgs(probe);

  const config = await fetchConfigFile();

  const filename = config?.file ?? commandFilename;

  const probeList: [number, number][] = config?.probe?.map((p) => [p.address, p.value]) ?? [];

  if (parsedProbes.length > 0) {
    probeList.push(...parsedProbes);
  }

  const fileContent = await fetchFileContent(filename);

  const [mainCircuit] = loadLogisimInput(fileContent);

  const sim = new CircuitSimulator();

  sim.loadCircuit(mainCircuit!);

  const instance = render(<TerminalCircuit noColor={noColor} interactive={interactive} circuit={sim.circuit} onUpdateState={onUpdateState} />);

  if (!interactive) {
    instance.rerender(
      <Static items={probeList}>
        {([address, value]) => {
          sim.updateStateValue(address, value);
          sim.step();

          return <TerminalCircuit key={`${address}, ${value}`} noColor={noColor} interactive={interactive} circuit={sim.circuit} onUpdateState={onUpdateState} />;
        }}
      </Static>,
    );

    if (probeList.length === 0) {
      instance.rerender(<TerminalCircuit noColor={noColor} interactive={interactive} circuit={sim.circuit} onUpdateState={onUpdateState} />);
    }

    instance.unmount();
  }

  function onUpdateState(index: number, value: number) {
    sim.updateStateValue(index, value);
    sim.step();
    instance.rerender(<TerminalCircuit noColor={noColor} interactive={interactive} circuit={sim.circuit} onUpdateState={onUpdateState} />);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  } else {
    console.error('An unknown error occurred:', error);
  }
  process.exit(1);
} finally {
  console.log('\u001B[?25h');
  // console.clear();
}
