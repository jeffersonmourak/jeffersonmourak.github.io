public: clean
	mkdir -p public

clean:
	rm -rf public

preprocess:
	bun scripts/preprocess-circ.ts

# Build the Observable notebook bundles into static/notebooks/. The script
# skips re-download when notebooks-src/<slug>.html already exists, so this
# is a fast vite-only rebuild on warm checkouts. Run from `make build` and
# once before `make dev` (notebooks rarely change, no watch loop needed).
notebooks:
	bun scripts/build-notebooks.ts

dev: public notebooks
	@bash -c 'trap "kill 0" SIGINT SIGTERM EXIT; bun scripts/preprocess-circ.ts --watch & hugo server -D; wait'

dev-local: public notebooks
	@bash -c 'trap "kill 0" SIGINT SIGTERM EXIT; bun scripts/preprocess-circ.ts --watch & hugo server -D --bind=0.0.0.0 --baseURL=http://192.168.0.70:1313; wait'

build: public preprocess notebooks
	hugo