deploy:
	rm -rf build
	mkdir -p build/tmp
	mkdir -p build/output
	mkdir -p build/output/lib/ace build/output/lib/extjs
	cp -R public/css public/images build/output
	cp public/lib/ace/ace.js public/lib/ace/mode-javascript.js public/lib/ace/theme-pastel_on_dark.js build/output/lib/ace
	cp public/extjs/ext-debug.js build/output/lib/extjs
	cp deployPublic/* build/output/
	sencha build -p public/spellEd.jsb3 -v -d build
	cp -R build public/
