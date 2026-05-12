#!/usr/bin/env bun
/**
 * Notebook build pipeline.
 *
 *   bun scripts/build-notebooks.ts
 *
 * Reads notebooks.config.json at the project root:
 *
 *   [
 *     { "slug": "unicode", "url": "https://observablehq.com/d/<hash>@<version>" }
 *   ]
 *
 * For each entry:
 *   1. `notebooks download <url>`  → notebooks-src/<slug>.html
 *      (commit these so subsequent builds don't hit observablehq.com)
 *   2. `notebooks build`            → static/notebooks/<slug>.html + assets
 *      (served by Hugo at /notebooks/<slug>.html — the shortcode reads it)
 *
 * Step 1 is skipped if notebooks-src/<slug>.html already exists, so updates
 * are explicit: delete the file (or pass --force) to re-download.
 *
 * Caveat — local patches:
 *   Some notebooks need light edits to run under notebook-kit (e.g. the
 *   kit's `html` template tag is htl-based and HTML-escapes string
 *   interpolations, while the legacy observablehq.com `html` parses
 *   strings as markup). Those edits are applied directly to the
 *   downloaded notebooks-src/<slug>.html and survive normal runs of this
 *   script. `--force` re-downloads and clobbers them — re-apply by hand,
 *   or move patches to a separate overlay (TODO if more notebooks need
 *   fixing). Known patches today:
 *     - notebooks-src/unicode.html, cell #250 (encodingVisualizer):
 *       wraps the built `htmlOutput` string in a DOM node before
 *       interpolating, so htl renders the markup instead of escaping it.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Entry = { slug: string; url: string };

const root = process.cwd();
const configPath = join(root, "notebooks.config.json");
const srcDir = join(root, "notebooks-src");
const distDir = join(root, "static/notebooks");
const bin = join(root, "node_modules/.bin/notebooks");

if (!existsSync(configPath)) {
  console.error(`missing ${configPath}`);
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, "utf-8")) as Entry[];

mkdirSync(srcDir, { recursive: true });
mkdirSync(distDir, { recursive: true });

const force = process.argv.includes("--force");

for (const { slug, url } of config) {
  const srcFile = join(srcDir, `${slug}.html`);
  if (!existsSync(srcFile) || force) {
    console.log(`download: ${slug}  ←  ${url}`);
    const r = spawnSync(bin, ["download", url], { encoding: "utf-8" });
    if (r.status !== 0) {
      console.error(r.stderr);
      process.exit(r.status ?? 1);
    }
    writeFileSync(srcFile, r.stdout);
  } else {
    console.log(`download: ${slug}  (cached)`);
  }
}

// Build every .html in notebooks-src/ — named notebooks from the config
// AND inline blocks dropped here by scripts/preprocess-inline-observables.ts.
// One pass is faster than per-file because vite shares chunks across the
// whole build.
console.log("build: vite (notebooks build)");
const files = readdirSync(srcDir)
  .filter((name) => name.endsWith(".html"))
  .map((name) => `notebooks-src/${name}`);
if (files.length === 0) {
  console.log("nothing to build (notebooks-src/ is empty).");
  process.exit(0);
}
// --empty wipes static/notebooks/ before re-building so stale inline-block
// artifacts from previous runs (older hashes, removed blocks) don't pile up.
// The directory is gitignored, so this is safe; vite rebuilds everything in
// ~600ms.
const r = spawnSync(
  bin,
  ["build", "--root", "notebooks-src", "--base", "/notebooks/", "--out", "../static/notebooks", "--empty", "--", ...files],
  { stdio: "inherit" },
);
if (r.status !== 0) process.exit(r.status ?? 1);
console.log("done.");
