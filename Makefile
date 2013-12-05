UNAME_S := $(shell uname -s)
CWD=$(shell pwd)
SENCHA=$(CWD)/modules/SenchaCmd/sencha
NODE=$(CWD)/modules/nodejs/node
ADDON=$(CWD)/node_modules/codemirror/addon/

ifeq ($(UNAME_S),Darwin)
SED = sed -i "" -e
else
SED = sed -i
endif


.PHONY: all
all: clean build/spelledjs/public build/win-ia32 build/osx-ia32 build/linux-x64 build/spelledserver

.PHONY: clean
clean:
	# cleaning up and creating directory tree
	rm -Rf build public/build || true

.PHONY: refresh 
refresh:
	#regenerating bootstrap.js 
	$(SENCHA) -cwd public app refresh
	cd $(CWD)

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
-i "connect,http,querystring,formidable,fs,underscore,path,child_process,commander,pathUtil,wrench" >> build/spelledserver/tmp.js

	$(NODE) modules/spellCore/tools/n.js mangle build/spelledserver/tmp.js -a > build/spelledserver/spellEdServer.js
	rm build/spelledserver/tmp.js

	chmod +x build/spelledserver/spellEdServer.js

.PHONY: clean-nw
clean-nw:
	rm -R build/nw-package build/app.nw build/libs.js build/nwlibs.js build/loader.js build/spelledjs/public/loader.js || true

.PHONY: rebuild-nw
rebuild-nw: clean-nw build/nw-package build/app.nw

.PHONY: codemirror
codemirror:
	# building codemirror lib
	mkdir -p node_modules/codemirror/build || true

	#should use: codemirror --local $(CWD)/node_modules/uglify-js/bin/uglifyjs instead
	cd node_modules/codemirror && bin/compress codemirror javascript search searchcursor dialog lint javascript-lint matchbrackets closebrackets foldcode foldgutter brace-fold comment comment-fold show-hint tern match-highlighter active-line > build/tmp.js

	cat $(ADDON)dialog/dialog.css \
$(ADDON)lint/lint.css \
$(ADDON)hint/show-hint.css \
$(ADDON)tern/tern.css \
node_modules/codemirror/lib/codemirror.css > node_modules/codemirror/build/tmp.css

	cat modules/acorn/acorn.js \
modules/acorn/acorn_loose.js \
modules/acorn/util/walk.js \
modules/tern/lib/signal.js \
modules/tern/lib/tern.js \
modules/tern/lib/def.js \
modules/tern/lib/comment.js \
modules/tern/lib/infer.js \
modules/tern/plugin/doc_comment.js > node_modules/codemirror/build/tern.js

	cp -a node_modules/codemirror/build/tmp.js public/lib/codemirror/codemirror.js
	cp -a node_modules/codemirror/build/tmp.css public/lib/codemirror/codemirror.css

	cp -a node_modules/codemirror/build/tern.js public/lib/tern/tern.js
	cp -a modules/tern/defs/ecma5.json public/lib/tern/defs/ecma5.json

	rm -Rf node_modules/codemirror/build || true

nw-debug:
	$(NODE) modules/spellCore/tools/n.js -s public/lib -m spellEdDeps \
-i "underscore,require,module,exports" > public/libs.js
	$(NODE) modules/spellCore/tools/n.js -s src -m webKit/createExtDirectApi -i "amd-helper,path,http,fs,child_process,underscore,pathUtil,wrench" > public/nwlibs.js

	mkdir -p public/lib || true

build/libs.js:
	$(NODE) modules/spellCore/tools/n.js -s public/lib -m spellEdDeps \
-i "underscore,require,module,exports" >> build/libs.js

build/nwlibs.js:
	$(NODE) modules/spellCore/tools/n.js -s src -m webKit/createExtDirectApi -i "amd-helper,path,http,fs,child_process,underscore,pathUtil,wrench" >> build/nwlibs.js

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
	# copy fontdetect library
	mkdir -p build/spelledjs/public/lib/
	cp -aR public/lib/fontDetect build/spelledjs/public/lib

	# copy tern&codemirrir
	cp -aR public/lib/codemirror public/lib/tern build/spelledjs/public/lib

build/nw-package: build/spelledjs/public build/spelledjs/public/nwlibs.js
	mkdir -p build/nw-package/public

	cp -aR build/spelledjs/public build/nw-package
	cp -aR nw-package/* build/nw-package/
	mkdir -p build/nw-package/node_modules
	cp -aR src build/nw-package/
	cp -aR node_modules build/nw-package/

build/package.nw: build/nw-package
	cd build/nw-package && zip -9 -r package.nw *
	mv build/nw-package/package.nw build/package.nw

build/linux-x64: build/package.nw
	mkdir -p build/linux-x64 || true
	cp -aR modules/node-webkit/linux-x64/nw.pak build/linux-x64
	cp -aR modules/node-webkit/linux-x64/libffmpegsumo.so build/linux-x64
	cp -aR modules/node-webkit/linux-x64/nw build/linux-x64/spelled
	cp -aR build/package.nw build/linux-x64
	chmod +x build/linux-x64/spelled

build/osx-ia32: build/package.nw
	mkdir -p build/osx-ia32 || true
	cp -aR modules/node-webkit/osx-ia32/node-webkit.app/ build/osx-ia32/spellEd.app
	cp build/package.nw build/osx-ia32/spellEd.app/Contents/Resources/app.nw

build/win-ia32: build/package.nw
	mkdir -p build/win-ia32 || true
	cp -aR modules/node-webkit/win-ia32/ffmpegsumo.dll build/win-ia32
	cp -aR modules/node-webkit/win-ia32/libEGL.dll build/win-ia32
	cp -aR modules/node-webkit/win-ia32/icudt.dll build/win-ia32
	cp -aR modules/node-webkit/win-ia32/libGLESv2.dll build/win-ia32
	cp -aR modules/node-webkit/win-ia32/nw.pak build/win-ia32
	cp -aR modules/node-webkit/win-ia32/nw.exe build/win-ia32/spelled.exe

	cp -aR build/package.nw build/win-ia32

	chmod +x build/win-ia32/spelled.exe

