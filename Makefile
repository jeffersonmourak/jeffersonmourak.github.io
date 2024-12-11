public: clean
	mkdir -p public

clean:
	rm -rf public

dev: public
	hugo server -D

dev-local: public
	hugo server -D --bind=0.0.0.0 --baseURL=http://192.168.0.70:1313

build: public
	hugo