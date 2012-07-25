window.generateJSB3 = function() {
	var classNames = Ext.Loader.history,
		fileStructure = {
		    "projectName": "Project Name",
		    "licenseText": "Copyright(c) 2012 Company Name",
		    "builds": [
		        {
		            "name": "All Classes",
		            "target": "tmp/all-classes.js",
		            "options": {
		                "debug": true
		            },
		            "files": undefined
		        },
		        {
		            "name": "Application - Production",
		            "target": "output/app-all.js",
		            "compress": false,
		            "files": [
		                {
		                    "path": "../build/tmp/",
		                    "name": "all-classes.js"
		                },
		                {
		                    "path": "",
		                    "name": "app.js"
		                }
		            ]
		        }
		    ],
		    "resources": []
		}

	fileStructure.builds[ 0 ].files = _.map(
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
		}
	)

	var beautiful = true

	return JSON.stringify( fileStructure, null, '\t' )
}
