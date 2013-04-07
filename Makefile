CWD=$(shell pwd)
SENCHA=$(CWD)/../SenchaCmd/sencha

#todo set path for windows ruby include

.PHONY: theme
theme:
	cd public/packages/spelled-theme && $(SENCHA) package build
	cd $(CWD)

.PHONY: spelledserver
spelledserver:
	mkdir -p build/spelledserver
	rm -R build/spelledserver/* || true

.PHONE: distclean
distclean:
	# cleaning up and creating directory tree
	rm -rf build

build/nw-package/package.json: build/spelledjs/index.html
	mkdir -p build/nw-package
	cp -aR build/spelledjs/* build/nw-package/
	cp -aR nw-package/* build/nw-package/

build/app.nw: build/nw-package/package.json
	cd build/nw-package && zip -9 -r app.nw *
	mv build/nw-package/app.nw build/app.nw

build/spelledjs/index.html: 
	mkdir -p build/spelledjs
	cd public && $(SENCHA) app build

        # copy sencha build
	cp public/build/spellEd/production/index.html build/spelledjs
	cp public/build/spellEd/production/all-classes.js build/spelledjs
	cp -R public/build/spellEd/production/resources build/spelledjs

        # populating output with static content
	cp -RL public/libs build/spelledjs
	cp ../../node_modules/requirejs/require.js build/spelledjs/libs
	cp ../../node_modules/underscore/underscore.js build/spelledjs/libs
	cp -R ../ace/lib/ace build/spelledjs/libs
