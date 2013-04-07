CWD=$(shell pwd)
SENCHA=$(CWD)/../SenchaCmd/sencha

.PHONY: theme
theme:
	cd public/packages/spelled-theme
	$(SENCHA) package build
	cd $(CWD)

.PHONE: clean
clean:
	# cleaning up and creating directory tree
	rm -rf build

.PHONY: release
release: clean
	mkdir build
	echo $(SENCHA)
	cd public && $(SENCHA) app build
	echo $(SENCHA)

        # copy sencha build
	cp public/build/spellEd/production/index.html build/
	cp public/build/spellEd/production/all-classes.js build/
	cp -R public/build/spellEd/production/resources build/

        # populating output with static content
	cp -RL public/libs build
	cp ../../node_modules/requirejs/require.js build/libs
	cp ../../node_modules/underscore/underscore.js build/libs
	cp -R ../ace/lib/ace build/libs

