import { throttle } from "lodash";

export type CountingCell = {
  cell: HTMLDivElement;
  value: number;
  increment: () => void;
  clear: () => void;
  set: (value: number) => void;
  safeAttachAt(parent: HTMLElement): void;
};

export type CountingCellOptions = {
  limit?: number;
  duration?: number;
  size?: number;
  onCarry?: () => void;
  digitMask?: ((index: number) => string) | string[];
  onChange?: (value: number) => void;
};

export const HexDigitMask = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

function attachDestructionObserver(element: HTMLElement, callback: () => void) {
  new MutationObserver(function (mutations) {
    if (!document.body.contains(element)) {
      callback();
      this.disconnect();
    }
  }).observe(element.parentElement, { childList: true });
}

function countingCell({
  limit = 10,
  duration = 1000,
  size = 100,
  onCarry = () => {},
  digitMask = (i) => `${i}`,
  onChange = () => {},
}: CountingCellOptions): CountingCell {
  const instance = {
    blocked: false,
    value: 0,
    wheelDelta: 0,
    captureArrows: false,
  };

  const maskDigit = (index: number) => {
    if (typeof digitMask === "function") {
      return digitMask(index);
    }
    return digitMask[index];
  };

  //#region rendering
  const cellWidget = document.createElement("div");
  cellWidget.classList.add("cell-widget");
  cellWidget.setAttribute(
    "style",
    `--animation-time: ${duration}ms; --size: ${size}px;`
  );

  const cell = document.createElement("div");
  cell.classList.add("cell");

  const content = document.createElement("div");
  content.classList.add("content");

  const currentDigitFront = document.createElement("div");
  currentDigitFront.classList.add("current");
  currentDigitFront.classList.add("digit");
  currentDigitFront.classList.add("front");
  currentDigitFront.classList.add("face");

  const currentDigitBack = document.createElement("div");
  currentDigitBack.classList.add("current");
  currentDigitBack.classList.add("digit");
  currentDigitBack.classList.add("back");
  currentDigitBack.classList.add("face");

  const nextDigitFront = document.createElement("div");
  nextDigitFront.classList.add("next");
  nextDigitFront.classList.add("digit");
  nextDigitFront.classList.add("front");
  nextDigitFront.classList.add("face");

  content.appendChild(currentDigitFront);
  content.appendChild(currentDigitBack);
  content.appendChild(nextDigitFront);

  setCounterValue(instance.value, true);

  // currentDigitFront.textContent = `${maskDigit(instance.value)}`;
  // nextDigitFront.textContent = `${maskDigit(instance.value + 1)}`;

  cell.appendChild(content);
  cellWidget.appendChild(cell);
  //#endregion

  const throttledWheelChange = throttle(() => {
    const delta = instance.wheelDelta;
    instance.wheelDelta = 0;

    if (Math.abs(delta) < 13) {
      return;
    }

    const increment = Math.sign(delta);

    const newValue = (instance.value + limit + increment) % limit;

    setCounterValue(newValue);

    animateChange();
  }, duration + 3);

  const wheelEventHandler = (e: WheelEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    instance.wheelDelta += e.deltaY;

    throttledWheelChange();
  };

  const mouseEnterHandler = () => {
    instance.captureArrows = true;
  };
  const mouseLeaveHandler = () => {
    instance.captureArrows = false;
  };

  cellWidget.addEventListener("wheel", wheelEventHandler, { passive: false });
  cellWidget.addEventListener("mouseenter", mouseEnterHandler, {
    passive: false,
  });
  cellWidget.addEventListener("mouseleave", mouseLeaveHandler, {
    passive: false,
  });

  // window.addEventListener(
  //   "keydown",
  //   (e) => {
  //     const shouldCapture = e.key === "ArrowUp" || e.key === "ArrowDown";

  //     if (!shouldCapture || instance.captureArrows === false) {
  //       return;
  //     }

  //     e.preventDefault();
  //     e.stopImmediatePropagation();
  //     e.stopPropagation();

  //     const direction = e.key === "ArrowUp" ? 1 : -1;

  //     const newValue = (instance.value + direction + limit) % limit;
  //     setCounterValue(newValue);
  //     animateChange();
  //   },
  //   { passive: false }
  // );

  function animateChange(onComplete?: () => void) {
    cell.classList.add("active");

    const animationTimeout = setTimeout(() => {
      onComplete?.();

      currentDigitFront.textContent = `${maskDigit(instance.value)}`;

      cell.classList.remove("active");

      instance.blocked = false;
      clearTimeout(animationTimeout);
    }, duration + 2);
  }

  function setCounterValue(newValue: number, noEmits = false) {
    const previousValue = instance.value;
    const normalizedValue = (newValue + limit) % limit;

    instance.value = normalizedValue;

    currentDigitFront.textContent = `${maskDigit(previousValue)}`;
    nextDigitFront.textContent = `${maskDigit(instance.value)}`;

    // if (newValue !== normalizedValue) {
    //   console.log("Carry");
    //   // onCarry();
    // }

    if (noEmits === false) {
      onChange(newValue);
    }
  }

  function increment() {
    if (instance.blocked) {
      return;
    }
    instance.blocked = true;

    const newValue = (instance.value + 1) % limit;

    if (newValue < instance.value) {
      // onCarry();
    }

    setCounterValue(newValue);

    animateChange();
  }

  function set(value: number) {
    if (instance.blocked) {
      return;
    }
    instance.blocked = true;

    const normalizedValue = (value + limit) % limit;

    if (normalizedValue !== value) {
      // onCarry();
    }

    setCounterValue(value, true);

    animateChange();
  }

  function clear() {
    instance.value = 0;
    currentDigitFront.textContent = `${maskDigit(instance.value)}`;
    nextDigitFront.textContent = `${maskDigit((instance.value + 1) % limit)}`;
  }

  function safeAttachAt(parent: HTMLElement) {
    parent.appendChild(cellWidget);

    attachDestructionObserver(cellWidget, () => {
      cellWidget.removeEventListener("wheel", wheelEventHandler);
      console.log('destructed!')
      // cellWidget.removeEventListener("mouseenter", mouseEnterHandler);
      // cellWidget.removeEventListener("mouseleave", mouseLeaveHandler);
    });
  }

  return {
    ...instance,
    cell: cellWidget,
    increment,
    clear,
    set,
    safeAttachAt,
  };
}

export default countingCell;
