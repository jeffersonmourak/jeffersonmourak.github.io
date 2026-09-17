# Vendored circ-compile binaries

These are produced from the [circ-compiler](https://github.com/jeffersonmourak/circ-compiler) project (locally at `~/circus/circ-compiler`) and consumed by `scripts/preprocess-circ.ts`, which runs at Hugo build time to turn every ` ```circ ` fenced block into an ASCII preview (`--preview`) and a runtime `.wasm` artifact for the interactive tab.

| File                          | Target               | Built with                                                              |
|-------------------------------|----------------------|-------------------------------------------------------------------------|
| `circ-compile-darwin-arm64`   | macOS Apple Silicon  | `zig build circ-compile -Doptimize=ReleaseSafe`                         |
| `circ-compile-linux-x86_64`   | GitHub Actions CI    | `zig build circ-compile -Dtarget=x86_64-linux-musl -Doptimize=ReleaseSafe` |

Current build: `circ-compile --version` → `v0.0.3 (rev:c13d466)`, Zig 0.15.1.

The Linux binary uses the `musl` libc target so it is statically linked and runs on any glibc-or-musl distro without further dependencies — required because GitHub Actions `ubuntu-latest` is the only platform we cross-compile for here.

## Refreshing

When `circ-compiler` changes:

```sh
cd ~/circus/circ-compiler
zig build circ-compile -Doptimize=ReleaseSafe
cp zig-out/bin/circ-compile <blog>/bin/circ-compile-darwin-arm64

zig build circ-compile -Dtarget=x86_64-linux-musl -Doptimize=ReleaseSafe
cp zig-out/bin/circ-compile <blog>/bin/circ-compile-linux-x86_64

chmod +x <blog>/bin/circ-compile-*
```

Both binaries must be committed with the executable bit set (git preserves it).

The compiled artifacts under `static/circ/` are keyed by source hash, so a new
compiler would otherwise leave stale `.wasm` files in place; `preprocess-circ.ts`
rebuilds any artifact older than the binary, so simply re-running it (or `make dev`)
after a refresh is enough.

Keep the `packages/circ-renderer` submodule on the commit `circ-compiler/site/package.json`
pins: the renderer has to understand the topology version the compiler emits.
