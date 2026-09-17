/**
 * The dot grid under a circuit, drawn in world space — a port of the
 * playground's `benchTheme` in circ-compiler/site/src/components/Playground.astro.
 *
 * A CSS `background-image` on the mount stays put while the canvas zooms
 * and pans, so the circuit slides over a grid that does not move with it.
 * Drawing the dots through the renderer's `background` hook instead puts
 * them in the same coordinate space as the gates: the context arrives
 * already transformed by the view, so the grid moves and scales with the
 * contents. Zoomed out, the spacing doubles until the dots are at least
 * 12px apart on screen; a dot stays one screen pixel wide.
 */

import type { CircTheme } from 'circ-renderer';

/** Spacing between dots at 100%, in CSS pixels. */
const STEP = 18;
/** Zoomed out, the step doubles until dots are at least this far apart on screen. */
const MIN_SCREEN_STEP = 12;

/** The page's dot colour for `el`: its `--pg-dot` token, which follows `data-theme`. */
export function gridDotColor(el: Element): string {
  return getComputedStyle(el).getPropertyValue('--pg-dot').trim() || 'rgba(0, 0, 0, 0.14)';
}

/** `theme` with the dot grid as its background, in `dot`. */
export function withWorldGrid<C extends string>(theme: CircTheme<C>, dot: string): CircTheme<C> {
  return {
    ...theme,
    background: ({ ctx, view, viewport }) => {
      const scale = view.scale;
      const left = -view.x / scale;
      const top = -view.y / scale;
      const width = viewport.width / scale;
      const height = viewport.height / scale;
      // The whole element, not the grid: zoomed out, the grid is smaller
      // than the element, and the page must show through around it.
      ctx.clearRect(left, top, width, height);
      let step = STEP;
      while (step * scale < MIN_SCREEN_STEP) step *= 2;
      const r = 1 / scale;
      const x0 = Math.floor(left / step) * step;
      const y0 = Math.floor(top / step) * step;
      ctx.fillStyle = dot;
      ctx.beginPath();
      for (let x = x0; x <= left + width; x += step) {
        for (let y = y0; y <= top + height; y += step) {
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    },
  };
}
