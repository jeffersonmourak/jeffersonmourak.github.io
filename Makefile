public: clean
	mkdir -p public

clean:
	rm -rf public

preprocess:
	bun scripts/preprocess-circ.ts

dev: public
	@bash -c 'trap "kill 0" SIGINT SIGTERM EXIT; bun scripts/preprocess-circ.ts --watch & hugo server -D; wait'

dev-local: public
	@bash -c 'trap "kill 0" SIGINT SIGTERM EXIT; bun scripts/preprocess-circ.ts --watch & hugo server -D --bind=0.0.0.0 --baseURL=http://192.168.0.70:1313; wait'

build: public preprocess
	hugo