define(
	'connect-pathMapper/pathMapper',
	[
		'fs',
		'path',

		'underscore'
	],
	function(
		fs,
		path,

		_
	) {
		'use strict'

		var contentTypes = {
			'.js'   : 'application/javascript',
			'.html' : 'text/html',
			'.css'  : 'text/css'
		}

		return function( config ) {
			var returnFile = function( filePath, res ) {
				var fileContent = fs.readFileSync( filePath ),
					extension   = path.extname( filePath )

				res.writeHead( 200, {
						'Content-type': ( _.has( contentTypes, extension ) ) ? contentTypes[ extension ] : 'text/html',
						'Content-length': fileContent.length
					}
				)
				res.end( fileContent )
			}

			return function( req, res, next ) {
				var requestUrl = req.url

				if(_.has( config, requestUrl ) ) {
					returnFile( config[ requestUrl ], res )
				} else {

					var directoryKey = _.find( _.keys( config ), function( key ) {
						return ( requestUrl.indexOf( key ) === 0 )
					} )

					if( !!directoryKey ) {
						returnFile( path.join( config[ directoryKey ], requestUrl.substr( directoryKey.length ) ), res )
					} else {
						next()
					}
				}
			}
		}
	}
)
