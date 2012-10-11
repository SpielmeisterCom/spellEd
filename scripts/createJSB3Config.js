var fs   = require( 'fs' ),
	path = require( 'path'),
	_    = require( 'underscore' )


var createClassRecords = function( classNames ) {
	return _.map(
		classNames,
		function( className ) {
			var parts = className.split( '.' ),
				first = _.first( parts ),
				path = [ first === 'Ext' ? '../../extjs/src' : 'app' ]

			path = path.concat( _.rest( _.initial( parts ) ) )

			return {
				clsName : className,
				name : _.last( parts ) + '.js',
				path : path.join( '/' ) + '/'
			}
		}
	)
}

var createJSB3 = function( dependencies ) {
	var JSB3ConfigTemplate = {
		"projectName": "SpellEd - the SpellJS Editor",
		"licenseText": "Copyright(c) 2011-2012 Spielmeister GmbH",
		"builds": [
			{
				"name": "Ext Classes",
				"target": "tmp/ext-classes.js",
				"options": {
					"debug": true
				},
				"files": undefined
			},
			{
				"name": "Other Classes",
				"target": "tmp/other-classes.js",
				"options": {
					"debug": true
				},
				"files": undefined
			},
			{
				"name": "Application - Production",
				"target": "output/spelled.js",
				"compress": true,
				"files": [
					{
						"path": "extjs/",
						"name": "ext-debug.js"
					},
					{
						"path": "../build/tmp/",
						"name": "ext-classes.js"
					},
					{
						"path": "",
						"name": "app-configuration.js"
					},
					{
						"path": "",
						"name": "app-initialize.js"
					},
					{
						"path": "../build/tmp/",
						"name": "other-classes.js"
					},
					{
						"path": "",
						"name": "app.js"
					}
				]
			}
		],
		"resources": []
	},
	extClasses = _.filter(
		dependencies,
		function( className ) {
			return _.first( className.split( '.' ) ) === 'Ext'
		}
	),
	otherClasses = _.filter(
		dependencies,
		function( className ) {
			return _.first( className.split( '.' ) ) !== 'Ext'
		}
	)

	JSB3ConfigTemplate.builds[ 0 ].files = createClassRecords( extClasses )
	JSB3ConfigTemplate.builds[ 1 ].files = createClassRecords( otherClasses )


	return JSON.stringify( JSB3ConfigTemplate, null, '\t' )
}

var loadDependenciesFile = function( filePath ) {
	try {
		return JSON.parse( fs.readFileSync( filePath, 'utf-8' ) ).dependencies

	} catch( e ) {
		console.error( 'Error: Parsing file \'' + filePath + '\' failed.' )
		process.exit( 1 )
	}
}

var main = function() {
	var argv = process.argv

	if( argv.length < 3 ) {
		console.log( 'Please provide the path to the \'dependencies.json\' file as argument to this command.' )
		process.exit( 0 )
	}

	var filePath = path.resolve( argv[ 2 ] )

	if( !fs.existsSync( filePath ) ) {
		console.error( 'Error: Could not read file \'' + filePath + '\'.' )
		process.exit( 1 )
	}

	console.log(
		createJSB3(
			loadDependenciesFile( filePath ) ) )
}

main()
