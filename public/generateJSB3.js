window.generateJSB3 = function() {
	var classNames = Ext.Loader.history,
		fileStructure = {
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
			classNames,
			function ( className ) {
				return (_.first( className.split( '.' ) ) === 'Ext')
			}
		),
		otherClasses =_.filter(
			classNames,
			function ( className ) {
				return (_.first( className.split( '.' ) ) !== 'Ext')
			}
		)

	var generateFilesFunction = function( classNames ) {
		return _.map(
			classNames,
			function( className ) {
				var parts = className.split( '.' ),
					first = _.first( parts ),
					path = [ first === 'Ext' ? 'extjs/src' : 'app' ]

				path = path.concat( _.rest( _.initial( parts ) ) )

				return {
					clsName : className,
					name : _.last( parts ) + '.js',
					path : path.join( '/' ) + '/'
				}
			})
	}

	fileStructure.builds[ 0 ].files = generateFilesFunction( extClasses )
	fileStructure.builds[ 1 ].files = generateFilesFunction( otherClasses )


	return JSON.stringify( fileStructure, null, '\t' )
}
