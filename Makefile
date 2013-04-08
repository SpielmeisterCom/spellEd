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
all: build/spelledjs build/app.nw spelledserver

.PHONY: theme
theme:
	#regenerating theme only (useful for development)
	$(SENCHA) -cwd public/packages/spelled-theme package build
	cd $(CWD)

.PHONY: clean
clean:
	# cleaning up and creating directory tree
	rm -Rf build

.PHONY: spelledserver
spelledserver:
	mkdir -p build/spelledserver
	rm -R build/spelledserver/* || true

.PHONY: clean-nw
clean-nw:
	rm -R build/nw-package build/app.nw build/spelledjs/public/libs.js || true 

.PHONY: rebuild-nw
rebuild-nw: clean-nw build/nw-package build/app.nw

.PHONY: rebuild-ace
rebuild-ace: clean-ace public/ace 

.PHONY: clean-ace
clean-ace:
	rm -Rf public/ace

.PHONY: public/ace
public/ace:
	mkdir -p public/ace

	# building ace lib
	cd ../ace && ../nodejs/node ./Makefile.dryice.js normal

	# concatenating needed files to one include
	cat ../ace/build/src/ace.js >>public/ace/ace.js
	$(SED) 's/window.\require/window\.requirejs/g' public/ace/ace.js
	cat ../ace/build/src/theme-pastel_on_dark.js >>public/ace/ace.js
	cat ../ace/build/src/mode-html.js >>public/ace/ace.js
	cat ../ace/build/src/mode-javascript.js >>public/ace/ace.js

	# include spellscript include and worker
#	cp  public/libs/spell/ace/mode/spellscript_worker.js public/ace
	cp ../ace/build/src/worker-javascript.js public/ace

build/nw-package: build/spelledjs
	mkdir -p build/nw-package/public

	cp -aR build/spelledjs/public build/nw-package
	cp -aR nw-package/* build/nw-package/
	mkdir -p build/nw-package/node_modules
	cp -aR src build/nw-package/ 
	cp -aR ../../node_modules build/nw-package/

build/app.nw: build/nw-package
	cd build/nw-package && zip -9 -r app.nw *
	mv build/nw-package/app.nw build/app.nw
	

build/spelledjs/public/libs.js: public/ace
	# copy all libs into one directory
	cp -RL public/libs build/spelledjs/public
	cp ../../node_modules/requirejs/require.js build/spelledjs/public/libs
	cp ../../node_modules/underscore/underscore.js build/spelledjs/public/libs
	
	# minifying libs
	$(NODE) ../spellCore/tools/n.js -s build/spelledjs/public/libs -m spellEdDeps -i "underscore,require,module,exports,ace/ace,ace/mode/html,ace/theme/pastel_on_dark" >>build/spelledjs/public/libs.js



build/spelledjs/public:
	# creating extjs build
	mkdir -p build/spelledjs/public
	$(SENCHA) -cwd public app build

        # copy sencha build
	cp public/build/spellEd/production/index.html build/spelledjs/public
	cp public/build/spellEd/production/all-classes.js build/spelledjs/public
	cp -R public/build/spellEd/production/resources build/spelledjs/public

build/spelledjs: build/spelledjs/public build/spelledjs/public/libs.js 

