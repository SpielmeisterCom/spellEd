CWD=$(shell pwd)
SENCHA=$(CWD)/../SenchaCmd/sencha
NODE=$(CWD)/../nodejs/node

#todo set path for windows ruby include

.PHONY: all
all: build/spelledjs build/app.nw spelledserver

.PHONY: theme
theme:
	#regenerating theme only (useful for development)
	cd public/packages/spelled-theme && $(SENCHA) package build
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
	rm -R build/nw-package build/app.nw || true 

.PHONY: rebuild-nw
rebuild-nw: clean-nw build/nw-package build/app.nw

build/nw-package: build/spelledjs
	mkdir -p build/nw-package/public

	cp -aR build/spelledjs/public build/nw-package
	cp -aR nw-package/* build/nw-package/
	mkdir -p build/nw-package/node_modules
	cp -aR src build/nw-package/ 
	cp -aR ../../node_modules build/nw-package/

	cp -R ../ace/lib/ace build/nw-package/node_modules


build/app.nw: build/nw-package
	cd build/nw-package && zip -9 -r app.nw *
	mv build/nw-package/app.nw build/app.nw
	

build/spelledjs/public/libs.js:
	# copy all libs into one directory
	cp -RL public/libs build/spelledjs/public
	cp ../../node_modules/requirejs/require.js build/spelledjs/public/libs
	cp ../../node_modules/underscore/underscore.js build/spelledjs/public/libs
	
	# minifying libs
	$(NODE) ../spellCore/tools/n.js -s build/spelledjs/public/libs -m spellEdDeps -i "underscore,ace/ace,spell/ace/mode/spellscript,ace/mode/html,ace/theme/pastel_on_dark" >>build/spelledjs/public/libs.js

build/spelledjs/public:
	# creating extjs build
	mkdir -p build/spelledjs/public
	cd public && $(SENCHA) app build

        # copy sencha build
	cp public/build/spellEd/production/index.html build/spelledjs/public
	cp public/build/spellEd/production/all-classes.js build/spelledjs/public
	cp -R public/build/spellEd/production/resources build/spelledjs/public

build/spelledjs: build/spelledjs/public build/spelledjs/public/libs.js 

