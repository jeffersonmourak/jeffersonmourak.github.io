import initializeBinaryCounter from "./binaryCounter/index";
import initializeLoadCirc from "./loadCirc/index";

(() => {
  window.onload = () => {
    initializeBinaryCounter();
    initializeLoadCirc();
  };
})();
