/**
 * Auto-mounts circ-renderer canvases for ` ```circ ` code blocks rendered
 * by layouts/_default/_markup/render-codeblock-circ.html. Each block has a
 * <div class="circ-canvas-mount" data-circ-wasm="/circ/<hash>.wasm"> in
 * its "interactive" tab; we lazily render into it when the tab is first
 * activated, then leave the canvas mounted for instant re-shows.
 */

import { renderCircuit, type CircView } from "circ-renderer";
import { blogTheme, onBlogAssetsReady } from "./blog-theme";

const mounted = new WeakMap<HTMLElement, CircView>();
const inFlight = new WeakSet<HTMLElement>();

async function mount(host: HTMLElement): Promise<void> {
  if (mounted.has(host) || inFlight.has(host)) return;
  const url = host.dataset.circWasm;
  if (!url) return;
  inFlight.add(host);
  try {
    const view = await renderCircuit({
      url,
      cell: 14,
      padding: 16,
      interactive: true,
      theme: blogTheme as any,
    });
    host.innerHTML = "";
    host.appendChild(view.canvas);
    mounted.set(host, view);
  } catch (err) {
    const pre = document.createElement("pre");
    pre.className = "circ-error";
    pre.setAttribute("role", "alert");
    pre.textContent = `circ-renderer: ${err instanceof Error ? err.message : String(err)}`;
    host.innerHTML = "";
    host.appendChild(pre);
  } finally {
    inFlight.delete(host);
  }
}

function findMountForInput(input: HTMLInputElement): HTMLElement | null {
  const block = input.closest(".circ-block");
  return block?.querySelector<HTMLElement>(".circ-canvas-mount[data-circ-wasm]") ?? null;
}

function init(): void {
  // Eagerly mount any block where the "interactive" tab is the default.
  for (const radio of document.querySelectorAll<HTMLInputElement>(
    "input.circ-tab-input--interactive:checked",
  )) {
    const host = findMountForInput(radio);
    if (host) mount(host);
  }

  // Lazily mount on first activation. Listening on document keeps live-reloaded
  // blocks working without re-binding.
  document.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains("circ-tab-input--interactive")) return;
    if (!target.checked) return;
    const host = findMountForInput(target);
    if (host) mount(host);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Re-render every active view once the gate sprites finish decoding so the
// dark blog theme picks them up the first time it shows them.
onBlogAssetsReady(() => {
  for (const host of document.querySelectorAll<HTMLElement>(".circ-canvas-mount")) {
    const view = mounted.get(host);
    if (view) view.view.refreshState();
  }
});
