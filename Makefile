CWD=$(shell pwd)
SENCHA=$(CWD)/../SenchaCmd/sencha

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
	rm -rf build

.PHONY: spelledserver
spelledserver:
	mkdir -p build/spelledserver
	rm -R build/spelledserver/* || true

.PHONY: clean-nw
clean-nw:
	rm -R build/nw-package
	rm build/app.nw

.PHONY: rebuild-nw
rebuild-nw: clean-nw build/nw-package build/app.nw

build/nw-package: build/spelledjs
	mkdir -p build/nw-package/public

	cp -aR build/spelledjs/* build/nw-package/public
	cp -aR nw-package/* build/nw-package/
	mkdir -p build/nw-package/node_modules
	cp -aR src build/nw-package/ 
	cp -aR ../../node_modules/ build/nw-package/

build/app.nw: build/nw-package
	cd build/nw-package && zip -9 -r app.nw *
	mv build/nw-package/app.nw build/app.nw

build/spelledjs: 
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
