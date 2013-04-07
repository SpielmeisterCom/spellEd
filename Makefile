CWD=$(shell pwd)
SENCHA=$(CWD)/../SenchaCmd/sencha

#todo set path for windows ruby include

.PHONY: theme
theme:
	cd public/packages/spelled-theme && $(SENCHA) package build
	cd $(CWD)

.PHONE: distclean
distclean:
	# cleaning up and creating directory tree
	rm -rf build

.PHONY: nw-package
nw-package: spelledjs
	mkdir -p build/nw-package
	rm -R build/nw-package/* || true

	cp -aR build/spelledjs/* build/nw-package/
	cp -aR nw-package/* build/nw-package/

.PHONY: app.nw
app.nw: nw-package
	rm build/app.nw || true
	cd build/nw-package && zip -9 -r app.nw *
	mv build/nw-package/app.nw build/app.nw

.PHONY: spelledserver
spelledserver:
	mkdir -p build/spelledserver
	rm -R build/spelledserver/* || true

.PHONY: spelledjs
spelledjs: 
	mkdir -p build/spelledjs
	rm -R build/spelledjs/* || true
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
