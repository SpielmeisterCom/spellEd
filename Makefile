export PATH:=${PATH}:/opt/SenchaSDKTools-2.0.0-beta3:/Applications/SenchaSDKTools-2.0.0-beta3

.PHONY: css
css:
	#create css files from sass
	compass compile public/sass public/sass/ext-all-spelled.scss

	#fix path to images in the generated css file
	sed -i 's/..\/images\//..\/images\/spelled\//' public/css/ext-all-spelled.css
	sed -i 's/..\/images\/spelled\/spelled\//..\/images\/spelled\//' public/css/ext-all-spelled.css

	#slice fallback images for older browsers
	PATH=${PATH} sencha slice theme -d ../extjs -c ./public/css/ext-all-spelled.css -o ./public/images/spelled -v

	cp -aR public/images/spelled-patches/* public/images/spelled/

deploy:
	# cleaning up and creating directory tree
	rm -rf build
	mkdir -p build/tmp
	mkdir -p build/output

	# populating output with static content
	cp -R public/css public/images build/output
	cp -RL public/libs build/output
	cp ../../node_modules/requirejs/require.js build/output/libs
	cp ../../node_modules/underscore/underscore.js build/output/libs
	cp -R ../ace/lib/ace build/output/libs

	cp deployPublic/* build/output/
	cp public/dependencies.json build/output/

	# creating the build configuration file
	node scripts/createJSB3Config.js public/dependencies.json > public/spellEd.jsb3

	# creating the javascript include
	PATH=${PATH} sencha build -p public/spellEd.jsb3 -v -d build
