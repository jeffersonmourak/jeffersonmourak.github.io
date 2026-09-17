/**
 * Markdown emphasis in component names, blog-side.
 *
 * A post can name a part `_nand_` or `__carry__` and have the canvas draw it
 * as *nand* or **carry**: the markers are stripped and the label is drawn
 * in italic and/or bold. Both markdown spellings are accepted, `_` and `*`,
 * single for italic, double for bold, triple for both. An inner marker is
 * left alone, as CommonMark does for intraword underscores, so `_not_a_` is
 * *not_a*.
 *
 * The mirrored site skins (`circ-skins.mjs`) are not edited for this. Every
 * label they draw goes through `ctx.fillText` right after they set
 * `ctx.font`, so each skin is given a proxied context whose text methods
 * recognise a marked name, swap the font for the styled one, and put it
 * back. `measureText` gets the same treatment so a value chip sized around
 * the name fits what is actually drawn.
 */

import type { CircTheme, Skin } from 'circ-renderer';

interface Emphasis {
  inner: string;
  italic: boolean;
  bold: boolean;
}

// Longest markers first so `__x__` is bold rather than italic `_x_` around
// two stray underscores. The backreference makes the closing marker match
// the opening one, and the anchored `.+` backtracks past any inner marker.
const MARKED = /^(\*\*\*|___|\*\*|__|\*|_)(.+)\1$/;
const parsed = new Map<string, Emphasis | null>();

/** The emphasis a name carries, or null for a plain one. Memoised: names repeat every frame. */
export function parseEmphasis(text: string): Emphasis | null {
  const hit = parsed.get(text);
  if (hit !== undefined) return hit;
  const m = MARKED.exec(text);
  const result = m ? { inner: m[2], italic: m[1].length !== 2, bold: m[1].length >= 2 } : null;
  if (parsed.size > 512) parsed.clear();
  parsed.set(text, result);
  return result;
}

// `[italic] [weight] size family…` — the shape every skin font string takes.
const FONT = /^(?:(italic|oblique)\s+)?(?:(normal|bold|[1-9]00)\s+)?(.*)$/;

/** `font` with the emphasis applied: italic prepended, bold as weight 700. */
export function emphasisedFont(font: string, e: Emphasis): string {
  const m = FONT.exec(font);
  if (!m) return font;
  const [, slant, weight, rest] = m;
  const parts: string[] = [];
  if (e.italic || slant) parts.push(e.italic ? 'italic' : slant);
  if (e.bold) parts.push('700');
  else if (weight) parts.push(weight);
  parts.push(rest);
  return parts.join(' ');
}

type Ctx = CanvasRenderingContext2D;
const proxies = new WeakMap<Ctx, Ctx>();

/**
 * A context that draws marked names emphasised. One proxy per real context,
 * kept for its lifetime; the skins see it as the plain context, and every
 * other member (including `canvas`, which a skin uses as a cache key) is the
 * real one's.
 */
export function emphasisingContext(ctx: Ctx): Ctx {
  const hit = proxies.get(ctx);
  if (hit) return hit;

  const styled = <T>(text: string, run: (text: string) => T): T => {
    const e = parseEmphasis(text);
    if (!e) return run(text);
    const saved = ctx.font;
    ctx.font = emphasisedFont(saved, e);
    try {
      return run(e.inner);
    } finally {
      ctx.font = saved;
    }
  };

  const overrides: Partial<Record<keyof Ctx, unknown>> = {
    fillText: (text: string, x: number, y: number, maxWidth?: number) => styled(text, (t) => (maxWidth === undefined ? ctx.fillText(t, x, y) : ctx.fillText(t, x, y, maxWidth))),
    strokeText: (text: string, x: number, y: number, maxWidth?: number) => styled(text, (t) => (maxWidth === undefined ? ctx.strokeText(t, x, y) : ctx.strokeText(t, x, y, maxWidth))),
    measureText: (text: string) => styled(text, (t) => ctx.measureText(t)),
  };
  // biome-ignore lint/complexity/noBannedTypes: bound method cache, any signature
  const bound = new Map<PropertyKey, Function>();

  const proxy = new Proxy(ctx, {
    get(target, prop) {
      if (prop in overrides) return overrides[prop as keyof Ctx];
      const value: unknown = Reflect.get(target, prop);
      if (typeof value !== 'function') return value;
      const fn = bound.get(prop) ?? value.bind(target);
      bound.set(prop, fn);
      return fn;
    },
    set(target, prop, value) {
      return Reflect.set(target, prop, value);
    },
  });
  proxies.set(ctx, proxy);
  return proxy;
}

/** `theme` with every skin drawing marked names emphasised. */
export function withMarkdownNames<C extends string>(theme: CircTheme<C>): CircTheme<C> {
  const source = (theme.skins ?? {}) as Record<string, Skin<C>>;
  const skins: Record<string, Skin<C>> = {};
  for (const [kind, skin] of Object.entries(source)) {
    skins[kind] = (args) => skin({ ...args, ctx: emphasisingContext(args.ctx) });
  }
  return { ...theme, skins: skins as CircTheme<C>['skins'] };
}
