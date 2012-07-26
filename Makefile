PATH := ${PATH}:/opt/SenchaSDKTools-2.0.0-beta3

deploy:
	rm -rf build
	mkdir -p build/tmp
	mkdir -p build/output
	mkdir -p build/output/lib/ace
	cp -R public/css public/images build/output
	cp public/lib/ace/ace.js public/lib/ace/worker-javascript.js public/lib/ace/mode-javascript.js public/lib/ace/theme-pastel_on_dark.js build/output/lib/ace
	cp deployPublic/* build/output/
	sencha build -p public/spellEd.jsb3 -v -d build
	cp -R build public/
