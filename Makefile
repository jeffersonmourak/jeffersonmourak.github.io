public: clean
	mkdir -p public

clean:
	rm -rf public

preprocess:
	bun scripts/preprocess-circ.ts

# Build the Observable notebook bundles into static/notebooks/. Two-step:
#   1. preprocess-inline-observables: scan content/*.md for fenced
#      ```observable:notebook blocks and stage one notebooks-src/_inline-*.html
#      per block (hash-keyed, with cell ids namespaced so blocks don't
#      collide on #cell-1).
#   2. build-notebooks: vite-build every .html in notebooks-src/ — named
#      notebooks AND inline ones — into static/notebooks/. Skips re-download
#      when sources are already present, so warm checkouts are fast.
# Notebooks rarely change, so no watch loop here — re-run `make notebooks`
# (or restart the dev server) after editing fenced observable blocks.
notebooks:
	bun scripts/preprocess-inline-observables.ts
	bun scripts/build-notebooks.ts

dev: public notebooks
	@bash -c 'trap "kill 0" SIGINT SIGTERM EXIT; \
		bun scripts/preprocess-circ.ts --watch & \
		bun scripts/preprocess-inline-observables.ts --watch & \
		hugo server -D; \
		wait'

dev-local: public notebooks
	@bash -c 'trap "kill 0" SIGINT SIGTERM EXIT; \
		bun scripts/preprocess-circ.ts --watch & \
		bun scripts/preprocess-inline-observables.ts --watch & \
		hugo server -D --bind=0.0.0.0 --baseURL=http://192.168.0.70:1313; \
		wait'

build: public preprocess notebooks
	hugo

lint-md:
	bunx markdownlint-cli2 --fix