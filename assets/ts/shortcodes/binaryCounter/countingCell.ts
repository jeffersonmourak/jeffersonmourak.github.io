import { throttle } from "lodash";
import { presentFlipDisplay } from "./presenters/flipDisplay";

export type CountingCell = {
  cell: HTMLDivElement;
  value: number;
  increment: () => void;
  decrement: () => void;
  clear: () => void;
  set: (value: number) => void;
  safeAttachAt(parent: HTMLElement): void;
};

export type CountingCellOptions = {
  limit?: number;
  duration?: number;
  size?: number;
  onCarry?: (direction: number) => void;
  digitMask?: ((index: number) => string) | string[];
  onChange?: (value: number) => void;
  noControls?: boolean;
  noChangeOnCarry?: boolean;
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
  noControls = false,
  noChangeOnCarry = false,
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
  const digitWidget = presentFlipDisplay({
    maskDigit,
    onIncrement: increment,
    onDecrement: decrement,
    controlsEnabled: !noControls,
  });

  digitWidget.set(instance.value, (instance.value + 1) % limit);

  const cellWidget = document.createElement("div");
  cellWidget.classList.add("cell-widget");
  cellWidget.setAttribute(
    "style",
    `--animation-time: ${duration}ms; --size: ${size}px;`
  );

  setCounterValue(instance.value, undefined, true);

  cellWidget.appendChild(digitWidget.dom);
  //#endregion

// #region possible deprecated code
  const throttledWheelChange = throttle(() => {
    const delta = instance.wheelDelta;
    instance.wheelDelta = 0;

    if (Math.abs(delta) < 13) {
      return;
    }

    const increment = Math.sign(delta);

    const newValue = (instance.value + limit + increment) % limit;

    digitWidget.set(instance.value, newValue);
    setCounterValue(newValue, undefined);

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

  // if (!noControls) {
  //   cellWidget.addEventListener("wheel", wheelEventHandler, { passive: false });
  //   cellWidget.addEventListener("mouseenter", mouseEnterHandler, {
  //     passive: false,
  //   });
  //   cellWidget.addEventListener("mouseleave", mouseLeaveHandler, {
  //     passive: false,
  //   });
  // }
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
  // #endregion

  function animateChange(onComplete?: () => void) {
    digitWidget.dom.classList.add("active");

    const animationTimeout = setTimeout(() => {
      onComplete?.();

      digitWidget.set(instance.value, instance.value);

      digitWidget.dom.classList.remove("active");

      instance.blocked = false;
      clearTimeout(animationTimeout);
    }, duration + 2);
  }

  function setCounterValue(
    newValue: number,
    carryDirection: number | undefined,
    noEmits = false
  ) {
    const previousValue = instance.value;
    const normalizedValue = (newValue + limit) % limit;

    instance.value = normalizedValue;

    const direction =
      carryDirection ?? Math.sign(previousValue - normalizedValue);

    const isCarry =
      limit === 2
        ? normalizedValue === 0
        : Math.abs(previousValue - normalizedValue) === limit - 1;

    if (isCarry) {
      onCarry(direction);
    }

    if (noEmits || (noChangeOnCarry && isCarry)) {
      return;
    }

    onChange(newValue);
  }

  function increment() {
    if (instance.blocked) {
      return;
    }
    instance.blocked = true;

    const newValue = (instance.value + 1) % limit;

    digitWidget.set(instance.value, newValue);
    setCounterValue(newValue, 1);

    animateChange();
  }

  function decrement() {
    if (instance.blocked) {
      return;
    }
    instance.blocked = true;

    const newValue = (instance.value - 1 + limit) % limit;

    digitWidget.set(instance.value, newValue);
    setCounterValue(newValue, -1);
    animateChange();
  }

  function set(value: number) {
    if (instance.blocked || value === instance.value) {
      return;
    }
    instance.blocked = true;

    const normalizedValue = (value + limit) % limit;

    digitWidget.set(instance.value, normalizedValue);
    setCounterValue(value, undefined, true);

    animateChange();
  }

  function clear() {
    instance.value = 0;
    digitWidget.set(instance.value, (instance.value + 1) % limit);
  }

  function safeAttachAt(parent: HTMLElement) {
    parent.appendChild(cellWidget);

    attachDestructionObserver(cellWidget, () => {
      // cellWidget.removeEventListener("wheel", wheelEventHandler);
      // cellWidget.removeEventListener("mouseenter", mouseEnterHandler);
      // cellWidget.removeEventListener("mouseleave", mouseLeaveHandler);
    });
  }

  return {
    ...instance,
    cell: cellWidget,
    increment,
    decrement,
    clear,
    set,
    safeAttachAt,
  };
}

export default countingCell;
