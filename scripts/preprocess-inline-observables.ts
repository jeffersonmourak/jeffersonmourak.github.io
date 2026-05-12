#!/usr/bin/env bun
/**
 * Inline `observable:notebook` fenced-block preprocessor.
 *
 * Lets posts author Observable Notebooks inline in Markdown:
 *
 *     ```observable:notebook
 *     <title>Hello, world!</title>
 *     <script id="1" type="text/markdown">
 *       # Hello, world!
 *     </script>
 *     <script id="2" type="module" pinned>
 *       1 + 2
 *     </script>
 *     ```
 *
 * For each such block this script:
 *   1. SHA-256s the canonical source. The first 6 hex chars give a numeric
 *      "namespace prefix" that's prepended to every `<script id="N">` —
 *      the kit's runtime targets cells globally by id (#cell-N), so two
 *      inline blocks on the same page would collide on id="1" without
 *      namespacing. Prefixed ids stay numeric, which the kit requires.
 *   2. Wraps the (rewritten) source in the kit's `<!doctype html><notebook>`
 *      envelope and writes it to `notebooks-src/_inline-<hash>.html`.
 *   3. Tracks all hashes referenced this run and deletes any orphan
 *      `notebooks-src/_inline-*.html` from previous runs.
 *
 * The Hugo render hook at
 * `layouts/_default/_markup/render-codeblock-observable:notebook.html`
 * recomputes the same hash, finds the pre-built bundle in static/notebooks/,
 * and inlines it into the post.
 *
 * Run via `make notebooks` (alongside scripts/build-notebooks.ts, which
 * vite-builds every .html in notebooks-src/, inline ones included).
 *
 * `--watch` mode: re-runs on content/ .md changes and, when the inline
 * block set actually changes, spawns `bun scripts/build-notebooks.ts` so
 * Hugo's static-file watcher picks up the refreshed bundle and rebuilds
 * the page. Used by `make dev`.
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  watch,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const CONTENT_ROOT = join(REPO_ROOT, "content");
const SRC_DIR = join(REPO_ROOT, "notebooks-src");

// Matches a CommonMark fenced block whose info string starts with
// `observable:notebook`. Opening and closing fences are each independently
// indented 0–3 spaces (per spec); the closing fence has at least as many
// backticks as the opening. Captures group 2 (open) for backtick count and
// group 3 (body).
const FENCE_RE =
  /^( {0,3})(`{3,})[ \t]*observable:notebook(?![A-Za-z0-9_-])(?:[ \t]*\{[^}\n]*\})?[ \t]*\r?\n([\s\S]*?)\r?\n {0,3}\2`*[ \t]*\r?$/gm;

function walkMarkdown(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkMarkdown(full, out);
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

function canonicalize(src: string): string {
  return src.replace(/\r\n/g, "\n").replace(/\n+$/, "");
}

/** Strip up to `n` leading spaces from each line — mirrors CommonMark's
 *  rule that fenced-code body lines are dedented by the opening fence's
 *  indent. Hugo's `.Inner` arrives already dedented, so the preprocess
 *  must apply the same transform before hashing or the two will disagree
 *  on the slug. */
function dedent(body: string, n: number): string {
  if (n <= 0) return body;
  const strip = new RegExp(`^ {0,${n}}`, "gm");
  return body.replace(strip, "");
}

/** SHA-256 hex of canonical source; full digest is the cache key, the first
 *  6 chars become the numeric namespace prefix for cell ids. */
function hashOf(source: string): string {
  return createHash("sha256").update(canonicalize(source)).digest("hex");
}

/** Convert the first 6 hex chars of `hash` to a positive integer.
 *  Range: [0, 16777216). Probability of collision across N blocks ≈ N²/2³³. */
function namespacePrefix(hash: string): number {
  return parseInt(hash.slice(0, 6), 16);
}

/** Rewrite every `<script id="X" …>` so X becomes `<prefix><X-padded-to-3>`.
 *  e.g. prefix 123456, id 7 → id 123456007.  The kit parses ids as integers
 *  via Math.floor(Number(...)), so this stays valid; the runtime then
 *  generates DOM ids like #cell-123456007, globally unique per block. */
function rewriteCellIds(body: string, prefix: number): string {
  return body.replace(/<script\b([^>]*?)\bid="(\d+)"/g, (_m, before, idStr) => {
    const id = parseInt(idStr, 10);
    const padded = String(id).padStart(3, "0");
    return `<script${before}id="${prefix}${padded}"`;
  });
}

/** Expand `type="ojs"` to the kit's full Observable-JavaScript MIME
 *  (`application/vnd.observable.javascript`). Cells written in
 *  Observable's dialect — `mutable X = …`, `viewof X = …`, top-level
 *  imports from notebooks — need the OJS parser; standard `type="module"`
 *  / `type="text/javascript"` flow through acorn and choke on those
 *  keywords. `ojs` is a convenience for migrating cells pasted from
 *  observablehq.com. */
function expandOjsType(body: string): string {
  return body.replace(
    /(<script\b[^>]*?\btype=")ojs(")/g,
    "$1application/vnd.observable.javascript$2",
  );
}

/** Wrap a body fragment in the kit's `<notebook>` envelope. */
function wrap(body: string, title: string): string {
  const trimmed = body.trim();
  return `<!doctype html>\n<notebook theme="air">\n  <title>${title}</title>\n${trimmed}\n</notebook>\n`;
}

/** Scan all markdown, sync notebooks-src/_inline-*.html with what's
 *  referenced. Returns whether anything actually changed on disk —
 *  watch mode uses this to decide whether to re-run vite. */
function runOnce(): { changed: boolean; blockCount: number } {
  if (!existsSync(SRC_DIR)) mkdirSync(SRC_DIR, { recursive: true });

  const referenced = new Set<string>();
  const files = walkMarkdown(CONTENT_ROOT);
  let blockCount = 0;
  let changed = false;

  for (const file of files) {
    const text = readFileSync(file, "utf-8");
    FENCE_RE.lastIndex = 0;
    for (const m of text.matchAll(FENCE_RE)) {
      const openIndent = (m[1] ?? "").length;
      const rawBody = m[3] ?? "";
      // Match Hugo's `.Inner`: dedent by the opening fence indent so
      // both sides hash the same bytes.
      const source = dedent(rawBody, openIndent);
      const hash = hashOf(source);
      referenced.add(hash);
      blockCount++;

      const outPath = join(SRC_DIR, `_inline-${hash}.html`);
      if (existsSync(outPath)) continue; // same hash = same content; nothing to do

      const prefix = namespacePrefix(hash);
      const rewritten = expandOjsType(rewriteCellIds(canonicalize(source), prefix));
      const title = `inline ${hash.slice(0, 8)}`;
      writeFileSync(outPath, wrap(rewritten, title));
      changed = true;
      console.log(`inline-observable: wrote ${relative(REPO_ROOT, outPath)}`);
    }
  }

  // Sweep orphans — _inline-*.html files from previous runs that no
  // markdown references anymore.
  for (const entry of readdirSync(SRC_DIR)) {
    if (!entry.startsWith("_inline-") || !entry.endsWith(".html")) continue;
    const hash = entry.slice("_inline-".length, -".html".length);
    if (referenced.has(hash)) continue;
    unlinkSync(join(SRC_DIR, entry));
    changed = true;
    console.log(`inline-observable: removed orphan ${entry}`);
  }

  console.log(
    `inline-observable: ${blockCount} block(s) across ${files.length} markdown file(s).`,
  );
  return { changed, blockCount };
}

/** Trigger a vite rebuild of every notebook in notebooks-src/. Used
 *  after a watch-mode change wrote or removed an inline source file. */
function rebuildBundles(): void {
  const r = spawnSync("bun", ["scripts/build-notebooks.ts"], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    console.error(`inline-observable: build-notebooks failed (exit ${r.status})`);
  }
}

function watchMode(): void {
  console.log(
    `inline-observable: watching ${relative(REPO_ROOT, CONTENT_ROOT)} for .md changes (Ctrl-C to stop)`,
  );
  const { changed } = runOnce();
  if (changed) rebuildBundles();

  let timer: ReturnType<typeof setTimeout> | null = null;
  const trigger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        const { changed } = runOnce();
        if (changed) rebuildBundles();
      } catch (err) {
        console.error(
          `inline-observable: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }, 200);
  };

  const watcher = watch(CONTENT_ROOT, { recursive: true }, (_event, filename) => {
    if (filename && filename.endsWith(".md")) trigger();
  });

  const stop = () => {
    watcher.close();
    if (timer) clearTimeout(timer);
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

function main(): number {
  if (process.argv.includes("--watch")) {
    watchMode();
    // Return without exiting — the fs.watch handle + signal handlers
    // keep the event loop alive until SIGINT/SIGTERM. Calling
    // process.exit() here would tear the process down immediately,
    // before any file event fires.
    return 0;
  }
  runOnce();
  return 0;
}

const code = main();
if (!process.argv.includes("--watch")) process.exit(code);
