# circ runtime (interactive ` ```circ ` blocks)

`index.ts` is the entry Hugo bundles (`layouts/_default/baseof.html`). It mounts a
`circ-renderer` canvas into every ` ```circ ` block's "Interactive" tab.

The canvas theme is the official site's, mirrored verbatim so the blog and
[circ-lang.org](https://circ-lang.org/) draw circuits the same way:

| File               | Mirror of (in `circ-compiler/site/src/utils/`) | What it is                                     |
|--------------------|-------------------------------------------------|------------------------------------------------|
| `circ-palette.mjs` | `circ-palette.mjs`                              | light + dark colour tables                     |
| `circ-skins.mjs`   | `circ-skins.mjs`                                | every drawing function (gates, pins, wires, …) |
| `circ-assets.mjs`  | `circ-assets.mjs`                               | the AND / OR sprite PNGs                       |
| `circ-theme.mjs`   | `circ-theme.mjs`                                | binds sprites + skins + palette; `pickTheme()` |

## Refreshing

The four `.mjs` files are **copied, not edited**. When the site's theme changes:

```sh
SITE=~/circus/circ-compiler/site/src/utils
cp $SITE/circ-assets.mjs $SITE/circ-palette.mjs $SITE/circ-skins.mjs $SITE/circ-theme.mjs assets/ts/circ-runtime/
```

They import from `circ-renderer`, so bump the `packages/circ-renderer` submodule to the
commit the site pins (`site/package.json` → `dependencies["circ-renderer"]`) at the same
time; the skins call renderer exports (`traceWire`, `wireStyleOf`, …) that older
versions lack.

Anything blog-specific lives beside them and wraps the site's theme rather than
editing it, so a refresh never has to reconcile edits:

| File                 | What it adds                                                                                   |
|----------------------|------------------------------------------------------------------------------------------------|
| `index.ts`           | finding and mounting blocks, the fixed-height stage, the zoom line, light/dark re-theme        |
| `world-grid.ts`      | the dot grid drawn in world space (port of the playground's `benchTheme`), so it zooms and pans |
| `markdown-names.ts`  | `_nand_` / `*nand*` draw as *nand*, `__x__` / `**x**` as **x** (a proxied context around each skin) |

The topology tab applies the same emphasis to the ASCII schematic in
`layouts/_default/_markup/render-codeblock-circ.html`.
