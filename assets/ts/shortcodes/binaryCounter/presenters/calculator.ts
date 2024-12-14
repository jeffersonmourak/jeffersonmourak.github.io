import { fromDecimal, stepAt, toDecimal } from "../calculations";
import { HexDigitMask } from "../countingCell";
import { type FlipDisplay, presentFlipDisplay } from "./flipDisplay";

type CalculatorOptions = {
	base: number;
	cellCount: number;
	animationDuration: number;
	cellSize?: number;
	noControls?: boolean;
};

interface MakeLineOptions extends CalculatorOptions {
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
		`--cell-count: ${cellCount}; --size: ${cellSize}px;`,
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
			}`,
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

function calculateWithCarry(
	base: number,
	cellCount: number,
	aValue: number,
	bValue: number,
) {
	const [topValues] = fromDecimal(base, aValue, cellCount);
	const [bottomValues] = fromDecimal(base, bValue, cellCount);

	const constructedCarry = new Array(cellCount).fill(0);

	for (let i = cellCount - 1; i >= 0; i--) {
		const a = topValues[i] || 0;
		const b = bottomValues[i] || 0;
		constructedCarry[i - 1] = Math.floor((constructedCarry[i] + a + b + base) / base) - 1;
	}

	const noramlizedCarry: number[] = new Array(cellCount).fill(0);
	for (let i = 0; i < cellCount; i++) {
		noramlizedCarry[i] = constructedCarry[i];
	}

	let sum = aValue + bValue;
	if (sum >= base ** cellCount) {
		sum = 0;
	}

	return [sum, toDecimal(base, noramlizedCarry)];
}

export function calculatorPresenter({
	base,
	cellCount,
	animationDuration,
	noControls,
	cellSize = 100,
}: CalculatorOptions) {
	const calculatorWapper = document.createElement("div");
	calculatorWapper.classList.add("calculator-wrapper");

	let aValue = 0;
	let bValue = 0;

	const carryLine = makeLine({
		base,
		cellCount,
		animationDuration,
		noControls: true,
		cellSize,
		onChange() {},
	});
	const aLine = makeLine({
		base,
		cellCount,
		animationDuration,
		noControls,
		cellSize,
		onChange(value) {
			aValue = value;
			const [_, carry] = calculateWithCarry(
				base,
				cellCount,
				aValue,
				bValue,
			);

			resultLine.set(aValue + bValue);
			carryLine.set(carry);
		},
	});

	const bLine = makeLine({
		base,
		cellCount,
		animationDuration,
		noControls,
		cellSize,
		onChange(value) {
			bValue = value;
			const [_, carry] = calculateWithCarry(
				base,
				cellCount,
				aValue,
				bValue,
			);

			resultLine.set(aValue + bValue);
			carryLine.set(carry);
		},
	});

	const resultLine = makeLine({
		base,
		cellCount: cellCount,
		animationDuration,
		noControls: true,
		cellSize,
		onChange() {},
	});

	let playing = false;
	let timeoutIncremeter: number | null = null;
	let lastIncremented = 0;

	carryLine.dom.classList.add("carry-line");

	const operationIdicator = document.createElement("div");
	operationIdicator.classList.add("operation-indicator");
	operationIdicator.innerText = "+";

	bLine.dom.appendChild(operationIdicator);

	const resultSeparator = document.createElement("div");
	resultSeparator.classList.add("results-separator");

	const autoplayButton = document.createElement("button");
	autoplayButton.classList.add("autoplay-button");
	autoplayButton.innerText = "Pause";

	function performAutoplay() {
		if (playing) {
			autoplayButton.innerText = "Play";
			playing = false;
			clearInterval(timeoutIncremeter);

			aLine.set(0);
			bLine.set(0);
			resultLine.set(0);
			carryLine.set(0);

			return;
		}

		autoplayButton.innerText = "Pause";
		playing = true;

		timeoutIncremeter = setInterval(() => {
			if (playing) {
				if (lastIncremented) {
					bLine.increment();
					lastIncremented = 0;
				} else {
					aLine.increment();
					lastIncremented = 1;
				}
			} else {
				aLine.set(0);
				bLine.set(0);
				resultLine.set(0);
				carryLine.set(0);

				clearInterval(timeoutIncremeter);
			}
		}, 1500);
	}

	autoplayButton.onclick = () => {
		performAutoplay();
	};

	aLine.dom.appendChild(autoplayButton);

	calculatorWapper.appendChild(carryLine.dom);
	calculatorWapper.appendChild(aLine.dom);
	calculatorWapper.appendChild(bLine.dom);
	calculatorWapper.appendChild(resultSeparator);
	calculatorWapper.appendChild(resultLine.dom);

	performAutoplay();

	return {
		dom: calculatorWapper,
	};
}
