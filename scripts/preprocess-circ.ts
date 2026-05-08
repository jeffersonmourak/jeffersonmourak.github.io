#!/usr/bin/env bun
/**
 * Pre-renders ASCII previews of `circ` fenced code blocks in content/**\/*.md
 * by running the vendored `circ-compile --preview` binary against each block,
 * then writes the results into data/circ_previews.json keyed by sha256 of
 * (modifier-tag, source). The Hugo render hook at
 * layouts/_default/_markup/render-codeblock-circ.html computes the same hash
 * and looks up the rendered preview at build time.
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  watch,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const CONTENT_ROOT = join(REPO_ROOT, "content");
const DATA_DIR = join(REPO_ROOT, "data");
const OUTPUT_FILE = join(DATA_DIR, "circ_previews.json");
const BIN_DIR = join(REPO_ROOT, "bin");

const BINARY_BY_PLATFORM: Record<string, string> = {
  "darwin-arm64": "circ-compile-darwin-arm64",
  "linux-x64": "circ-compile-linux-x86_64",
};

// Matches a CommonMark fenced block whose info string is exactly `circ`
// (optionally followed by a Hugo `{key=val}` attribute group). Captures:
//   1: indent (0-3 spaces)   2: opening fence (3+ backticks)
//   3: attribute string (may be empty)   4: raw fenced content
const CIRC_FENCE_RE = /^( {0,3})(`{3,})[ \t]*circ(?![A-Za-z0-9_-])(?:[ \t]*\{([^}\n]*)\})?[ \t]*\r?\n([\s\S]*?)\r?\n\1\2`*[ \t]*\r?$/gm;

interface OkEntry {
  status: "ok";
  preview: string;
}
interface ErrorEntry {
  status: "error";
  message: string;
}
type Entry = OkEntry | ErrorEntry;

interface Block {
  file: string;
  line: number;
  expand: boolean;
  source: string;
  key: string;
}

function pickBinary(): string {
  const key = `${process.platform}-${process.arch}`;
  const name = BINARY_BY_PLATFORM[key];
  if (!name) {
    throw new Error(
      `unsupported platform '${key}'. Add a prebuilt binary under bin/ and register it in scripts/preprocess-circ.ts.`,
    );
  }
  const path = join(BIN_DIR, name);
  if (!existsSync(path)) {
    throw new Error(`missing binary at ${relative(REPO_ROOT, path)}; see bin/README.md to refresh.`);
  }
  return path;
}

function walkMarkdown(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkMarkdown(full, out);
    } else if (entry.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function canonicalize(source: string): string {
  return source.replace(/\r\n/g, "\n").replace(/\n+$/, "");
}

function hashKey(expand: boolean, source: string): string {
  const tag = expand ? "expand" : "plain";
  return createHash("sha256").update(`${tag} ${source}`, "utf8").digest("hex");
}

function findBlocks(file: string, content: string): Block[] {
  const blocks: Block[] = [];
  let match: RegExpExecArray | null;
  CIRC_FENCE_RE.lastIndex = 0;
  while ((match = CIRC_FENCE_RE.exec(content)) !== null) {
    const attrs = match[3] ?? "";
    const explicitFalse = /\bexpand\s*=\s*false\b/i.test(attrs);
    const explicitTrue = /\bexpand\s*=\s*true\b/i.test(attrs);
    const expand = explicitTrue && !explicitFalse;
    const source = canonicalize(match[4]);
    const line = content.slice(0, match.index).split("\n").length;
    blocks.push({
      file,
      line,
      expand,
      source,
      key: hashKey(expand, source),
    });
  }
  return blocks;
}

function compileOne(binary: string, source: string, expand: boolean): Entry {
  const dir = mkdtempSync(join(tmpdir(), "circ-pre-"));
  try {
    const file = join(dir, "input.circ");
    writeFileSync(file, `${source}\n`, "utf8");
    const args: string[] = [];
    if (expand) args.push("--expand-macros");
    args.push("--preview", "--color=never", file);
    const res = spawnSync(binary, args, { encoding: "utf8" });
    const cleanup = (msg: string) => msg.split(file).join("circ-block").trim();
    if (res.error) {
      return { status: "error", message: res.error.message };
    }
    if (res.status !== 0) {
      const raw = res.stderr || res.stdout || `circ-compile exited ${res.status}`;
      return { status: "error", message: cleanup(raw) };
    }
    const stdout = (res.stdout ?? "").replace(/\n+$/, "");
    if (!stdout) {
      return { status: "error", message: cleanup(res.stderr || "<empty preview>") };
    }
    return { status: "ok", preview: stdout };
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // best-effort cleanup; tmpdir entries are reaped by the OS anyway
    }
  }
}

function runOnce(binary: string): number {
  if (!existsSync(CONTENT_ROOT)) {
    console.warn(`circ preprocess: no ${relative(REPO_ROOT, CONTENT_ROOT)} dir; nothing to do.`);
    return 0;
  }

  const files = walkMarkdown(CONTENT_ROOT);
  const entries: Record<string, Entry> = {};
  let total = 0;
  let errors = 0;

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    for (const block of findBlocks(file, content)) {
      total++;
      if (entries[block.key]) continue;
      const entry = compileOne(binary, block.source, block.expand);
      entries[block.key] = entry;
      if (entry.status === "error") {
        errors++;
        const rel = relative(REPO_ROOT, block.file);
        console.error(`circ preprocess: error in ${rel}:${block.line} — ${entry.message}`);
      }
    }
  }

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  // Idempotent write: only touch the file when content actually changes, so
  // Hugo's data-file watcher doesn't trigger a no-op rebuild on every run.
  const next = `${JSON.stringify(entries, null, 2)}\n`;
  const prev = existsSync(OUTPUT_FILE) ? readFileSync(OUTPUT_FILE, "utf8") : "";
  if (next !== prev) writeFileSync(OUTPUT_FILE, next, "utf8");

  const unique = Object.keys(entries).length;
  const changed = next !== prev ? "" : " (unchanged)";
  console.log(
    `circ preprocess: ${total} blocks, ${unique} unique, ${errors} errors → ${relative(REPO_ROOT, OUTPUT_FILE)}${changed}`,
  );

  return errors;
}

function watchMode(binary: string): void {
  console.log(
    `circ preprocess: watching ${relative(REPO_ROOT, CONTENT_ROOT)} for .md changes (Ctrl-C to stop)`,
  );
  runOnce(binary);

  let timer: ReturnType<typeof setTimeout> | null = null;
  const trigger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        runOnce(binary);
      } catch (err) {
        console.error(`circ preprocess: ${err instanceof Error ? err.message : String(err)}`);
      }
    }, 150);
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
  const binary = pickBinary();
  if (process.argv.includes("--watch")) {
    watchMode(binary);
    return 0; // unreachable; watchMode blocks
  }
  const errors = runOnce(binary);
  // Fail loudly in CI so a broken block blocks the deploy. Locally, keep going
  // so the in-page error renders and the author can iterate inside `make dev`.
  if (errors > 0 && process.env.CI) return 1;
  return 0;
}

try {
  const code = main();
  if (!process.argv.includes("--watch")) process.exit(code);
} catch (err) {
  console.error(`circ preprocess: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(2);
}
