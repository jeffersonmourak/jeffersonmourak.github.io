public: clean
	mkdir -p public

clean:
	rm -rf public

dev: public
	hugo server -D

build: public
	hugo