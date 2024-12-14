import { debounce } from "lodash";
import { fromDecimal, stepAt } from "../calculations";
import { HexDigitMask } from "../countingCell";
import { type FlipDisplay, presentFlipDisplay } from "./flipDisplay";

type CounterOptions = {
  base: number;
  cellCount: number;
  animationDuration: number;
  cellSize?: number;
  noControls?: boolean;
};

interface MakeLineOptions extends CounterOptions {
  onChange: (value: number) => void;
  digitMask?: ((index: number, pos: number) => string) | string[];
}

const makeLine = ({
  base,
  cellCount,
  animationDuration,
  noControls,
  cellSize = 100,
  onChange,
  digitMask = HexDigitMask,
}: MakeLineOptions) => {
  const previousValues: number[] = new Array(cellCount).fill(0);

  const cellsWrapper = document.createElement("div");
  cellsWrapper.classList.add("cells-wrapper");
  cellsWrapper.setAttribute(
    "style",
    `--cell-count: ${cellCount}; --size: ${cellSize}px;`
  );

  let numeralValue = 0;
  const digits: FlipDisplay[] = [];

  for (let i = 0; i < cellCount; i++) {
    const digit = presentFlipDisplay({
      controlsEnabled: !noControls,
      maskDigit: (value) => {
        if (Array.isArray(digitMask)) {
          return digitMask[value];
        }
        return digitMask(value, cellCount - i - 1);
      },
      onIncrement: () => {
        numeralValue = stepAt(numeralValue, 1, i, base, cellCount);
        updateDisplay();
        onChange(numeralValue);
      },
      onDecrement: () => {
        numeralValue = stepAt(numeralValue, -1, i, base, cellCount);
        updateDisplay();
        onChange(numeralValue);
      },
    });

    digit.set(numeralValue, numeralValue + 1);

    const digitWrapper = document.createElement("div");
    digitWrapper.classList.add("digit-widget");

    const cellWidget = document.createElement("div");
    cellWidget.classList.add("cell-widget");

    if (cellCount - i - 1 === 0) {
      digitWrapper.classList.add("last-cell");
    }

    cellWidget.setAttribute(
      "style",
      `--animation-time: ${animationDuration}ms; --size: ${cellSize}px; --pos: ${
        cellCount - i - 1
      }`
    );

    cellWidget.appendChild(digit.dom);
    digitWrapper.appendChild(cellWidget);
    cellsWrapper.appendChild(digitWrapper);

    digits[cellCount - i - 1] = digit;
  }

  const updateDisplay = () => {
    const [digitsValue, carry] = fromDecimal(base, numeralValue, cellCount);

    digitsValue.reverse().forEach((value, i) => {
      if (previousValues[i] !== value) {
        previousValues[i] = value;
        digits[i].dom.classList.add("active");
        digits[i].set((value - 1 + base) % base, previousValues[i]);

        const timeout = setTimeout(() => {
          digits[i].dom.classList.remove("active");
          digits[i].set(value, value);
          clearTimeout(timeout);
        }, animationDuration);
      }
    });
  };

  const set = (value: number) => {
    numeralValue = value;
    updateDisplay();
  };

  return {
    dom: cellsWrapper,
    set,

    increment() {
      numeralValue++;
      updateDisplay();
      onChange(numeralValue);
    },
  };
};

const poweredIndexes = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const toPowered = (value: number) => {
  const [digits] = fromDecimal(10, value, 1);

  return digits.map((digit) => poweredIndexes[digit]).join("");
};

export function counterPresenter({
  base,
  cellCount,
  animationDuration,
  noControls,
  cellSize = 100,
}: CounterOptions) {
  let previousSum = 0;
  const counterWapper = document.createElement("div");
  counterWapper.classList.add("counter-wrapper");

  const maxCells = ~~(document.body.clientWidth / cellSize) - 1;
  const visibleCellCount = Math.min(maxCells, cellCount);

  const decimalCellCount = ~~(base ** visibleCellCount / 10) + 1;
  const maxDecimalValue = base ** visibleCellCount;

  const resultDigit = presentFlipDisplay({
    controlsEnabled: false,
    maskDigit: (value) => {
      return `${value}`;
    },
    onIncrement: () => {},
    onDecrement: () => {},
  });

  const resultWidget = document.createElement("div");
  resultWidget.classList.add("cell-widget");

  resultWidget.setAttribute(
    "style",
    `--animation-time: ${animationDuration}ms; --size: ${cellSize}px;`
  );

  resultWidget.appendChild(resultDigit.dom);

  resultDigit.set(0, 0);

  const decimalLine = makeLine({
    base: 10,
    cellCount: decimalCellCount,
    animationDuration,
    noControls,
    cellSize,
    onChange(value) {
      binaryLine.set((value + maxDecimalValue) % maxDecimalValue);

      if ((value + maxDecimalValue) % maxDecimalValue === 0) {
        decimalLine.set(0);
      }
    },
    digitMask(digitValue) {
      return `${digitValue}`;
    },
  });

  const binaryLine = makeLine({
    base,
    cellCount: visibleCellCount,
    animationDuration,
    noControls,
    cellSize,
    onChange(value) {
      const sum = (value + maxDecimalValue) % maxDecimalValue;
      decimalLine.set(sum);
      resolutionLine.set(sum);

      resultDigit.set(sum, previousSum);

      previousSum = sum;
    },
    digitMask(digitValue) {
      return `${digitValue}`;
    },
  });

  const resolutionLine = makeLine({
    base,
    cellCount: visibleCellCount,
    animationDuration,
    noControls: true,
    cellSize,
    onChange(value) {
      decimalLine.set((value + maxDecimalValue) % maxDecimalValue);
    },
    digitMask(digitValue, pos) {
      return `${digitValue}×${base}${toPowered(pos)}`;
    },
  });

  let playing = false;
  let timeoutIncremeter: number | null = null;

  const autoplayButton = document.createElement("button");
  autoplayButton.classList.add("autoplay-button");
  autoplayButton.innerText = "Pause";

  function performAutoplay() {
    if (playing) {
      autoplayButton.innerText = "Play";
      playing = false;
      clearInterval(timeoutIncremeter);

      decimalLine.set(0);
      binaryLine.set(0);

      return;
    }

    autoplayButton.innerText = "Pause";
    playing = true;

    timeoutIncremeter = setInterval(() => {
      if (playing) {
        binaryLine.increment();
      } else {
        decimalLine.set(0);
        binaryLine.set(0);
        clearInterval(timeoutIncremeter);
      }
    }, 1500);
  }

  autoplayButton.onclick = () => {
    performAutoplay();
  };

  binaryLine.dom.appendChild(autoplayButton);
  resolutionLine.dom.appendChild(resultWidget);

  resolutionLine.dom.classList.add("carry-line");
  resolutionLine.dom.classList.add("resolution-line");

  counterWapper.appendChild(binaryLine.dom);
  counterWapper.appendChild(resolutionLine.dom);

  performAutoplay();

  const checkResize = debounce(() => {
    const maxCells = ~~(document.body.clientWidth / cellSize) - 1;
    const resizedCellCount = Math.min(maxCells, cellCount);

    if (resizedCellCount !== visibleCellCount) {
      location.reload();
    }
  }, 600, { leading: false, trailing: true });

  window.addEventListener("resize", checkResize);

  window.addEventListener("beforeunload", () => {
    window.removeEventListener("resize", checkResize);
  });

  return {
    dom: counterWapper,
  };
}
