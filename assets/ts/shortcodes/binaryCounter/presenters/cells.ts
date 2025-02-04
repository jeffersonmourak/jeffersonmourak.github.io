import { fromDecimal, toDecimal } from "../calculations";
import countingCell, {
  type CountingCell,
  type CountingCellOptions,
  HexDigitMask,
} from "../countingCell";

export type PresentOptions = {
  base: number;
  cellCount: number;
  animationDuration: number;
  cellSize?: number;

  hideEquation?: boolean;
  hideDecimal?: boolean;

  noControls?: boolean;

  onChange?: (value: number) => void;
};

export function presentCells({
  base,
  cellCount,
  animationDuration,
  cellSize = 100,
  hideEquation = false,
  hideDecimal = false,
  onChange = () => {},
  noControls,
}: PresentOptions) {
  const cellOptions: CountingCellOptions = {
    limit: base,
    duration: animationDuration,
    digitMask: HexDigitMask,
  };

  const cellValues: number[] = new Array(cellCount).fill(0);
  const cells: CountingCell[] = [];
  const equationValues: HTMLElement[] = [];

  const decimalCellEquation = document.createElement("div");
  decimalCellEquation.classList.add("cell-equation");

  const decimalCellValue = document.createElement("div");
  decimalCellValue.classList.add("cell-value");

  decimalCellValue.innerText = `${toDecimal(base, cellValues)}`;

  const decimalCounter = countingCell({
    limit: base ** cellCount,
    duration: cellOptions.duration,
    size: cellSize,
    noControls,
    onChange: (value) => {
      const [values] = fromDecimal(base, value, cellCount);

      for (let i = 0; i < cellCount; i++) {
        if (cellValues[i] !== values[i]) {
          cellValues[i] = values[i];
          cells[i].set(values[i]);
          if (equationValues[i]) {
            equationValues[i].innerText = values[i].toString();
          }
        }
      }

      decimalCellValue.innerText = value.toString();
      onChange(value);
    },
  });

  decimalCellEquation.appendChild(decimalCellValue);

  const cellsWrapper = document.createElement("div");
  cellsWrapper.classList.add("cells-wrapper");
  cellsWrapper.setAttribute(
    "style",
    `--cell-count: ${cellCount}; --size: ${cellSize}px;`
  );

  const separator = document.createElement("div");
  separator.classList.add("cells-separator");
  separator.innerText = "=";

  for (let i = 0; i < cellCount; i++) {
    const cell = countingCell({
      ...cellOptions,
      noControls,
      onCarry: () => {
        if (i === 0) {
          return;
        }
        cells[i - 1].increment();
      },
      onChange: (value) => {
        cellValues[i] = value;

        decimalCounter.set(toDecimal(base, cellValues));
        if (equationValues[i]) {
          equationValues[i].innerText = value.toString();
        }
      },
    });

    cells.push(cell);
  }

  cells.forEach((cell, i) => {
    cell.safeAttachAt(cellsWrapper);
  });

  if (hideDecimal === false) {
    cellsWrapper.appendChild(separator);
    cellsWrapper.appendChild(decimalCounter.cell);
  }

  if (hideEquation === false) {
    cells.forEach((cell, i) => {
      const basePowerLocation = cellCount - i - 1;
      const cellEquation = document.createElement("div");
      cellEquation.classList.add("cell-equation");

      const baseValue = document.createElement("div");
      baseValue.classList.add("cell-base-value");
      baseValue.innerHTML = `<span>&nbsp;x&nbsp;</span><span>${base}<sup>${basePowerLocation}</sup></span>`;

      const cellValue = document.createElement("div");
      cellValue.classList.add("cell-value");

      cellValue.innerText = cellValues[i].toString();

      equationValues.push(cellValue);

      cellEquation.appendChild(cellValue);
      cellEquation.appendChild(baseValue);

      cellsWrapper.appendChild(cellEquation);

      if (basePowerLocation !== 0) {
        const separator = document.createElement("div");
        separator.classList.add("equation");
        separator.classList.add("cells-separator");
        separator.innerText = "+";

        cellEquation.appendChild(separator);
      }
    });

    const separator2 = document.createElement("div");
    separator2.classList.add("equation");
    separator2.classList.add("cells-separator");
    separator2.innerText = "=";

    cellsWrapper.appendChild(separator2);
    cellsWrapper.appendChild(decimalCellEquation);
  }

  return {
    dom: cellsWrapper,
    increment() {
      decimalCounter.increment();
    },
    decrement() {
      decimalCounter.decrement();
    },
    set(value: number) {
      if (hideDecimal === false) {
        decimalCounter.set(value);
      }

      const [array] = fromDecimal(base, value, cellCount);

      for (let i = 0; i < cellCount; i++) {
        cells[i].set(array[i]);
      }

      return;
    },
  };
}
