UNAME_S := $(shell uname -s)
CWD=$(shell pwd)
SENCHA=$(CWD)/modules/SenchaCmd/sencha
NODE=$(CWD)/modules/nodejs/node

ifeq ($(UNAME_S),Darwin)
SED = sed -i "" -e
else
SED = sed -i
endif


.PHONY: all
all: clean build/spelledjs/public build/app.nw build/spelledserver

.PHONY: clean
clean:
	# cleaning up and creating directory tree
	rm -Rf build public/build || true
	cd modules/ace && make clean

.PHONY: theme
theme:
	#regenerating theme only (useful for development)
	$(SENCHA) -cwd public/packages/spelled-theme package build
	cd $(CWD)

build/spelledserver:
	mkdir -p build/spelledserver
	tail -n+2 server > build/spelledserver/tmp.js

	echo >> build/spelledserver/tmp.js

	$(NODE) modules/spellCore/tools/n.js -s src -m server/spellEdServer \
-i "connect,http,querystring,formidable,fs,underscore,path,child_process,commander,pathUtil" >> build/spelledserver/tmp.js

	$(NODE) modules/spellCore/tools/n.js mangle build/spelledserver/tmp.js -a > build/spelledserver/spellEdServer.js
	rm build/spelledserver/tmp.js

	chmod +x build/spelledserver/spellEdServer.js

.PHONY: clean-nw
clean-nw:
	rm -R build/nw-package build/app.nw build/libs.js build/nwlibs.js build/loader.js build/spelledjs/public/loader.js || true

.PHONY: rebuild-nw
rebuild-nw: clean-nw build/nw-package build/app.nw

.PHONY: ace
ace:
	# building ace lib
	cd ../ace && ../nodejs/node ./Makefile.dryice.js normal

	rm -Rf public/lib/ace || true
	mkdir -p public/lib/ace || true
	cp -aR modules/ace/build/src-min/* public/lib/ace/
	$(SED) 's/window\.require/window\.requirejs/g' public/lib/ace/ace.js

nw-debug:
	$(NODE) modules/spellCore/tools/n.js -s public/lib -m spellEdDeps \
-i "underscore,require,module,exports,ace/ace,ace/mode/html,ace/mode/javascript,ace/theme/pastel_on_dark" > public/libs.js
	$(NODE) modules/spellCore/tools/n.js -s src -m webKit/createExtDirectApi -i "path,http,fs,child_process,underscore,pathUtil" > public/nwlibs.js

	mkdir -p public/lib || true
	cp -aR build/spelledjs/public/lib/ace/ public/lib/

build/libs.js:
	$(NODE) modules/spellCore/tools/n.js -s public/lib -m spellEdDeps \
-i "underscore,require,module,exports,ace/ace,ace/mode/html,ace/mode/javascript,ace/theme/pastel_on_dark" >> build/libs.js

build/nwlibs.js:
	$(NODE) modules/spellCore/tools/n.js -s src -m webKit/createExtDirectApi -i "path,http,fs,child_process,underscore,pathUtil" >> build/nwlibs.js

build/spelledjs/public/nwlibs.js: build/nwlibs.js
	$(NODE) modules/spellCore/tools/n.js mangle build/nwlibs.js -a > build/spelledjs/public/nwlibs.js

build/spelledjs/public/libs.js: build/libs.js
	# minify concatenated libs.js
	$(NODE) modules/spellCore/tools/n.js mangle build/libs.js -a > build/spelledjs/public/libs.js

build/spelledjs/public/loader.js:
	# minifing loader
	$(NODE) modules/spellCore/tools/n.js mangle public/loader.js -a > build/spelledjs/public/loader.js

build/spelledjs/public/all-classes.js:
	mv public/index.html.orig public/index.html || true

	# creating extjs build
	mkdir -p build/spelledjs/public
	mv public/index.html public/index.html.orig
	cp public/index.html.SenchaCmd public/index.html
	$(SENCHA) -cwd public app build
	mv public/index.html.orig public/index.html

	# copy sencha build
	cp public/build/spellEd/production/index.html build/spelledjs/public
	cp public/build/spellEd/production/all-classes.js build/spelledjs/public
	cp -R public/build/spellEd/production/resources build/spelledjs/public

	# override index.html
	cp public/index.html build/spelledjs/public
	cp public/error.html build/spelledjs/public

build/spelledjs/public: build/spelledjs/public/all-classes.js build/spelledjs/public/libs.js build/spelledjs/public/loader.js
	# copy ace & fontdetect library
	mkdir -p build/spelledjs/public/lib/
	cp -aR public/lib/fontDetect public/lib/ace build/spelledjs/public/lib

build/nw-package: build/spelledjs/public build/spelledjs/public/nwlibs.js
	mkdir -p build/nw-package/public

	cp -aR build/spelledjs/public build/nw-package
	cp -aR nw-package/* build/nw-package/
	mkdir -p build/nw-package/node_modules
	cp -aR src build/nw-package/
	cp -aR node_modules build/nw-package/

build/app.nw: build/nw-package
	cd build/nw-package && zip -9 -r app.nw *
	mv build/nw-package/app.nw build/app.nw
