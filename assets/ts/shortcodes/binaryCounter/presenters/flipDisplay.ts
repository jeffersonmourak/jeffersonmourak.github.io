function makeFlip() {
	const valueElement = document.createElement("div");
	valueElement.classList.add("value");

	const targetElement = document.createElement("div");
	targetElement.classList.add("target");

	const flipElement = document.createElement("div");
	flipElement.classList.add("flip");

	flipElement.appendChild(valueElement);
	flipElement.appendChild(targetElement);

	return {
		dom: flipElement,
		set(value: string, target: string) {
			valueElement.innerText = value;
			targetElement.innerText = target;
		},
	};
}

function makePartial() {
	const topElement = document.createElement("div");
	topElement.classList.add("top");

	const bottomElement = document.createElement("div");
	bottomElement.classList.add("bottom");

	const partialElement = document.createElement("div");
	partialElement.classList.add("partial");

	partialElement.appendChild(topElement);
	partialElement.appendChild(bottomElement);

	return {
		dom: partialElement,
		set(value: string, target: string) {
			topElement.innerText = target;
			bottomElement.innerText = value;
		},
	};
}

export type FlipDisplay = ReturnType<typeof presentFlipDisplay>;

export function presentFlipDisplay({
	maskDigit,
	onIncrement,
	onDecrement,
	controlsEnabled = true,
}: {
	maskDigit: (index: number) => string;
	onIncrement: () => void;
	onDecrement: () => void;
	controlsEnabled?: boolean;
}) {
	const value = 0;
	const displayElement = document.createElement("div");
	displayElement.classList.add("display");

	const flipElement = makeFlip();
	const partialElement = makePartial();

	displayElement.appendChild(flipElement.dom);
	displayElement.appendChild(partialElement.dom);

	if (controlsEnabled) {
		const incrementControl = document.createElement("button");
		incrementControl.classList.add("digit-control");
		incrementControl.classList.add("increment");

		const decrementControl = document.createElement("button");
		decrementControl.classList.add("digit-control");
		decrementControl.classList.add("decrement");

		incrementControl.onclick = () => {
			onIncrement();
		};

		decrementControl.onclick = () => {
			onDecrement();
		};

		incrementControl.textContent = "+";
		decrementControl.textContent = "-";

		const controls = document.createElement("div");
		controls.classList.add("controls");

		controls.appendChild(incrementControl);
		controls.appendChild(decrementControl);

		displayElement.appendChild(controls);
	}

	return {
		dom: displayElement,
		set(value: number, target: number) {
			if (value === 0) {
				displayElement.classList.add("zero");
			} else {
				displayElement.classList.remove("zero");
			}

			flipElement.set(maskDigit(value), maskDigit(target));
			partialElement.set(maskDigit(value), maskDigit(target));
		},
	};
}
