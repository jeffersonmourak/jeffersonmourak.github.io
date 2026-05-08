# Vendored circ-compile binaries

These are produced from the [circ-compiler](https://github.com/jeffersonmourak/circ-compiler) project (currently local at `~/projects/circ-compiler`) and consumed by `scripts/preprocess-circ.ts` to render ASCII previews of `circ` fenced code blocks at Hugo build time.

| File                          | Target               | Built with                                                              |
|-------------------------------|----------------------|-------------------------------------------------------------------------|
| `circ-compile-darwin-arm64`   | macOS Apple Silicon  | `zig build circ-compile -Doptimize=ReleaseSafe`                         |
| `circ-compile-linux-x86_64`   | GitHub Actions CI    | `zig build circ-compile -Dtarget=x86_64-linux-musl -Doptimize=ReleaseSafe` |

The Linux binary uses the `musl` libc target so it is statically linked and runs on any glibc-or-musl distro without further dependencies — required because GitHub Actions `ubuntu-latest` is the only platform we cross-compile for here.

## Refreshing

When `circ-compiler` changes:

```sh
cd ~/projects/circ-compiler
zig build circ-compile -Doptimize=ReleaseSafe
cp zig-out/bin/circ-compile <blog>/bin/circ-compile-darwin-arm64

zig build circ-compile -Dtarget=x86_64-linux-musl -Doptimize=ReleaseSafe
cp zig-out/bin/circ-compile <blog>/bin/circ-compile-linux-x86_64

chmod +x <blog>/bin/circ-compile-*
```

Both binaries must be committed with the executable bit set (git preserves it).
