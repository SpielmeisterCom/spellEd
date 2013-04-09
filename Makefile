UNAME_S := $(shell uname -s)
CWD=$(shell pwd)
SENCHA=$(CWD)/../SenchaCmd/sencha
NODE=$(CWD)/../nodejs/node

ifeq ($(UNAME_S),Darwin)
SED = sed -i "" -e
else
SED = sed -i
endif


.PHONY: all
all: build/spelledjs/public build/app.nw spelledserver

.PHONY: clean
clean:
	# cleaning up and creating directory tree
	rm -Rf build public/build || true

.PHONY: theme
theme:
	#regenerating theme only (useful for development)
	$(SENCHA) -cwd public/packages/spelled-theme package build
	cd $(CWD)

.PHONY: spelledserver
spelledserver:
	mkdir -p build/spelledserver
	rm -R build/spelledserver/* || true

.PHONY: clean-nw
clean-nw:
	rm -R build/nw-package build/app.nw build/libs.js || true

.PHONY: rebuild-nw
rebuild-nw: clean-nw build/nw-package build/app.nw


../ace/build/src/ace.js:
	# building ace lib
	cd ../ace && ../nodejs/node ./Makefile.dryice.js normal

build/ace.js: ../ace/build/src/ace.js
	# creating concatinated version of the ace lib
	mkdir -p build

	# concatenated needed files to one include
	cat ../ace/build/src/ace.js >>build/ace.js
	$(SED) 's/window\.require/window\.requirejs/g' build/ace.js
	cat ../ace/build/src/theme-pastel_on_dark.js >>build/ace.js
	cat ../ace/build/src/mode-html.js >>build/ace.js
	cat ../ace/build/src/mode-javascript.js >>build/ace.js

	# include spellscript include and worker
	#cp ../ace/build/src-min/worker-javascript.js public/build

build/libs.js: build/ace.js
	# creating concatenated version of all libs
	cat build/ace.js >>build/libs.js

	$(NODE) ../spellCore/tools/n.js -s public/libs -m spellEdDeps \
-i "underscore,require,module,exports,ace/ace,ace/mode/html,ace/mode/javascript,ace/theme/pastel_on_dark"\
>>build/libs.js

build/spelledjs/public/libs.js: build/libs.js
	# minify concatenated libs.js
	$(NODE) ../spellCore/tools/n.js mangle build/libs.js -a >build/spelledjs/public/libs.js

build/spelledjs/public/all-classes.js:
	# creating extjs build
	mkdir -p build/spelledjs/public
	$(SENCHA) -cwd public app build

    # copy sencha build
	cp public/build/spellEd/production/index.html build/spelledjs/public
	cp public/build/spellEd/production/all-classes.js build/spelledjs/public
	cp -R public/build/spellEd/production/resources build/spelledjs/public

build/spelledjs/public: build/spelledjs/public/all-classes.js build/spelledjs/public/libs.js

build/nw-package: build/spelledjs/public
	mkdir -p build/nw-package/public

	cp -aR build/spelledjs/public build/nw-package
	cp -aR nw-package/* build/nw-package/
	mkdir -p build/nw-package/node_modules
	cp -aR src build/nw-package/
	cp -aR ../../node_modules build/nw-package/

build/app.nw: build/nw-package
	cd build/nw-package && zip -9 -r app.nw *
	mv build/nw-package/app.nw build/app.nw
