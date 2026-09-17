/**
 * Auto-mounts circ-renderer canvases for ` ```circ ` code blocks rendered
 * by layouts/_default/_markup/render-codeblock-circ.html. Each block has a
 * <div class="circ-canvas-mount" data-circ-wasm="/circ/<hash>.wasm"> in
 * its "interactive" tab; we lazily render into it when the tab is first
 * activated, then leave the canvas mounted for instant re-shows.
 *
 * The look of the canvas is the official site's (circ-lang.org): the four
 * `circ-*.mjs` modules next to this file are verbatim copies of
 * circ-compiler/site/src/utils/ — see README.md in this directory for the
 * mirror rule. This file is the blog's equivalent of the site's
 * LiveCanvas.astro island, with two things from its playground on top:
 *
 *   - the stage. The mount is given a fixed height from the circuit's
 *     natural size and the canvas fills it (`viewport: 'parent'`), so the
 *     reader can zoom and pan inside it and a zoom line — `− + · 100% · fit`
 *     — brings the circuit back. The dot grid is drawn by the theme in world
 *     space (`world-grid.ts`), so it moves with the circuit instead of
 *     sitting still under it.
 *   - markdown emphasis in names (`markdown-names.ts`): `_nand_` draws as
 *     *nand*.
 *
 * It also picks the palette for the current `data-theme`, re-themes live
 * canvases in place when the reader toggles light/dark, and repaints once
 * the gate sprites finish decoding.
 */

import { type CircTheme, type CircView, renderCircuit } from 'circ-renderer';
import { onAssetsReady, type PaletteKey, pickTheme } from './circ-theme.mjs';
import { withMarkdownNames } from './markdown-names';
import { gridDotColor, withWorldGrid } from './world-grid';

type View = CircView<PaletteKey>;

/** Pixels per layout cell — the site's default for gallery cards. */
const CELL = 14;
/**
 * Two cells of padding: the value chip above a pin reaches ~1.4 cells over
 * its box, and a pin on the top row has only the padding above it.
 */
const PADDING = Math.ceil(CELL * 2);
/** The stage's height follows the circuit's natural size, within these. */
const MIN_HEIGHT = 210;
const MAX_HEIGHT = 520;
/** One zoom-button press, as a factor. */
const ZOOM_STEP = 1.25;
/**
 * `onViewChange` fires for the renderer's own fits too (its first
 * measurement under `viewport: 'parent'`); only a change this soon after a
 * wheel, drag or touch counts as the reader navigating.
 */
const GESTURE_WINDOW_MS = 500;

interface Live {
  view: View;
  /** The reader zoomed or panned. Cleared by `fit` and `100%`; while set, a
   *  resize keeps their view instead of refitting. */
  navigated: boolean;
  gestureAt: number;
}

const live = new WeakMap<HTMLElement, Live>();
const inFlight = new WeakSet<HTMLElement>();

/** The site's theme for the current `data-theme`, with the blog's additions. */
function blogTheme(host: HTMLElement): CircTheme<PaletteKey> {
  return withMarkdownNames(withWorldGrid(pickTheme(), gridDotColor(host)));
}

/** `100%` at 1, rounded to the nearest whole percent. */
function formatZoom(scale: number): string {
  if (!Number.isFinite(scale) || scale <= 0) return '100%';
  return `${Math.round(scale * 100)}%`;
}

interface ZoomLine {
  root: HTMLElement;
  out: HTMLButtonElement | null;
  in: HTMLButtonElement | null;
  pct: HTMLButtonElement | null;
  fit: HTMLButtonElement | null;
}

function zoomLineFor(host: HTMLElement): ZoomLine | null {
  const root = host.closest('.circ-tab-panel--interactive')?.querySelector<HTMLElement>('.circ-zoom') ?? null;
  if (!root) return null;
  const q = (cls: string) => root.querySelector<HTMLButtonElement>(cls);
  return { root, out: q('.circ-zoom-out'), in: q('.circ-zoom-in'), pct: q('.circ-zoom-pct'), fit: q('.circ-zoom-fit') };
}

function setEnabled(line: ZoomLine, enabled: boolean): void {
  for (const b of [line.out, line.in, line.pct, line.fit]) b?.setAttribute('aria-disabled', String(!enabled));
}

const recentGesture = (state: Live) => Date.now() - state.gestureAt < GESTURE_WINDOW_MS;

/**
 * The renderer's fit fills the stage, which scales a small circuit UP — a
 * lone NOT gate would fill the column at 186%. A post reads better at the
 * size the site draws at, so a fit that lands above 100% is replaced by the
 * circuit centred at 100%. A wide circuit still fits down to the column.
 */
function settle(state: Live, host: HTMLElement): void {
  const v = state.view.view;
  if (v.getView().scale <= 1) return;
  const layout = v.getLayout();
  const w = layout.width * CELL;
  const h = layout.height * CELL;
  v.setView({ scale: 1, x: (host.clientWidth - w) / 2, y: (host.clientHeight - h) / 2 });
}

async function mount(host: HTMLElement): Promise<void> {
  if (live.has(host) || inFlight.has(host)) return;
  const url = host.dataset.circWasm;
  if (!url) return;
  inFlight.add(host);
  const line = zoomLineFor(host);
  const state = { navigated: false, gestureAt: 0 } as Live;
  try {
    const view = await renderCircuit<PaletteKey>({
      url,
      cell: CELL,
      padding: PADDING,
      interactive: true,
      theme: blogTheme(host),
      // Two free rows between stacked boxes: the value chip above a pin
      // needs the second one, or it lands on the box above.
      layoutOptions: { rowGutter: 2 },
      // Zoom on the modifier wheel (a trackpad pinch arrives as one), pan by
      // drag; the page keeps the plain wheel and one finger, since a post is
      // something the reader scrolls. Two fingers pinch.
      navigation: { wheel: 'modifier', drag: true, touch: 'page' },
      onViewChange: (v) => {
        if (recentGesture(state)) state.navigated = true;
        // A change that followed no gesture is the renderer's own fit (its
        // first measurement of the stage); keep it from enlarging.
        else if (v.scale > 1) settle(state, host);
        if (line?.pct) line.pct.textContent = formatZoom(state.view?.view.getView().scale ?? v.scale);
      },
    });
    state.view = view;

    // The stage: as tall as the circuit would be at 100%, within bounds,
    // then the canvas fills it and the renderer fits the circuit in on its
    // first measurement. A wide circuit is scaled to the column rather than
    // scrolled; the reader zooms into whatever they want to read.
    const natural = Number.parseFloat(view.canvas.style.height) || view.canvas.height / (window.devicePixelRatio || 1);
    host.style.height = `${Math.round(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, natural)))}px`;
    host.replaceChildren(view.canvas);
    live.set(host, state);
    view.view.setViewport('parent');

    // Capture phase: the stamp has to land before the canvas's own handler
    // turns the gesture into a view change, or the first wheel tick would
    // read as a fit and be capped.
    for (const type of ['wheel', 'pointerdown', 'touchmove'] as const) {
      host.addEventListener(
        type,
        () => {
          state.gestureAt = Date.now();
        },
        { passive: true, capture: true },
      );
    }
    // The column changed width (a resize, a rotation): a canvas the reader
    // has not navigated refits; one they zoomed or panned keeps their view.
    // Deferred a frame so the renderer's own observer has measured first.
    if (typeof ResizeObserver === 'function') {
      let pending = false;
      new ResizeObserver(() => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          if (state.navigated) return;
          view.view.fit();
          settle(state, host);
        });
      }).observe(host);
    }

    if (line) wireZoomLine(line, state, host);
  } catch (err) {
    const pre = document.createElement('pre');
    pre.className = 'circ-error';
    pre.setAttribute('role', 'alert');
    pre.textContent = `circ-renderer: ${err instanceof Error ? err.message : String(err)}`;
    host.innerHTML = '';
    host.appendChild(pre);
  } finally {
    inFlight.delete(host);
  }
}

/** The zoom line's four buttons, on the canvas they sit under. */
function wireZoomLine(line: ZoomLine, state: Live, host: HTMLElement): void {
  const view = state.view.view;
  const sync = () => {
    if (line.pct) line.pct.textContent = formatZoom(view.getView().scale);
  };
  // A button press is the reader's gesture too: stamped, so the change it
  // makes is never taken for a fit and capped.
  const step = (factor: number) => {
    state.gestureAt = Date.now();
    view.zoomBy(factor);
    state.navigated = true;
    sync();
  };
  line.out?.addEventListener('click', () => step(1 / ZOOM_STEP));
  line.in?.addEventListener('click', () => step(ZOOM_STEP));
  line.pct?.addEventListener('click', () => {
    view.resetView();
    state.navigated = false;
    sync();
  });
  line.fit?.addEventListener('click', () => {
    view.fit();
    settle(state, host);
    state.navigated = false;
    sync();
  });
  setEnabled(line, true);
  sync();
}

function findMountForInput(input: HTMLInputElement): HTMLElement | null {
  const block = input.closest('.circ-block');
  return block?.querySelector<HTMLElement>('.circ-canvas-mount[data-circ-wasm]') ?? null;
}

/**
 * Re-theme every live canvas in place. `setTheme` swaps the palette and
 * redraws; the runtime, its toggled pins, the reader's zoom and everything
 * else they did stay exactly as they were. Used by both the light/dark
 * toggle and the sprite-ready hook. The grid colour is re-read each time,
 * since it follows `data-theme` too.
 */
function rethemeAll(): void {
  for (const host of document.querySelectorAll<HTMLElement>('.circ-canvas-mount')) {
    live.get(host)?.view.view.setTheme(blogTheme(host));
  }
}

function init(): void {
  // Eagerly mount any block where the "interactive" tab is the default.
  for (const radio of document.querySelectorAll<HTMLInputElement>('input.circ-tab-input--interactive:checked')) {
    const host = findMountForInput(radio);
    if (host) mount(host);
  }

  // Lazily mount on first activation. Listening on document keeps live-reloaded
  // blocks working without re-binding.
  document.addEventListener('change', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('circ-tab-input--interactive')) return;
    if (!target.checked) return;
    const host = findMountForInput(target);
    if (host) mount(host);
  });

  // The header's sun/moon button flips `data-theme` on <html>; hand the
  // matching palette to every mounted canvas.
  const observer = new MutationObserver(rethemeAll);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Canvases that mounted before the PNG gate sprites decoded drew the vector
// stand-ins; once the sprites resolve, repaint them all so the art lands.
onAssetsReady(rethemeAll);
