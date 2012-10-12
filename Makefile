export PATH:=${PATH}:/opt/SenchaSDKTools-2.0.0-beta3:/Applications/SenchaSDKTools-2.0.0-beta3

.PHONY: css
css:
	#create css files from sass
	compass compile public/sass public/sass/ext-all-spelled.scss

	#fix path to images in the generated css file
	sed -i 's/..\/..\/..\/extjs\/resources\/themes\/images\/spelled\//..\/images\/spelled\//' public/css/ext-all-spelled.css

	#slice fallback images for older browsers
	PATH=${PATH} sencha slice theme -d ../extjs -c ./public/css/ext-all-spelled.css -o ./public/images/spelled -v

	cp -aR public/images/spelled-patches/* public/images/spelled/


bootstrap:
	${HOME}/bin/Sencha/Cmd/3.0.0.190/sencha compile -classpath=../extjs/src,public/app meta -alias -out public/bootstrap.js and meta -alt -append -out public/bootstrap.js

deploy:
	# cleaning up and creating directory tree
	rm -rf build
	mkdir build

	# populating output with static content
	cp -R public/css public/images build
	cp -RL public/libs build
	cp ../../node_modules/requirejs/require.js build/libs
	cp ../../node_modules/underscore/underscore.js build/libs
	cp -R ../ace/lib/ace build/libs

	# creating the javascript include
	${HOME}/bin/Sencha/Cmd/3.0.0.190/sencha -debug \
compile -classpath=../extjs/src,public/app \
page -yui -in=public/index.html -out=build/index.html
