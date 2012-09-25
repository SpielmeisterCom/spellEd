define(
	'server/extDirectApi/createUtil',
	[
		'path',

		'underscore'
	],
	function(
		path,

		_
	) {
		'use strict'

		return function( rootPath ) {
			var root = path.normalize( rootPath )

			/**
			 *
			 * Main functions
			 *
			 */
			var getPath = function( requestedPath ) {
				var normalize     = path.normalize,
					join          = path.join,
					requestedPath = normalize( requestedPath )

				if( !requestedPath ) throw "Bad requestPath"

				var dir = decodeURIComponent( requestedPath ),
					filePath  = path.resolve( root, normalize(
						( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
					))

				// null byte(s), bad request
				if ( ~filePath.indexOf('\0') )
					throw "Bad requestPath"
				else
					return filePath
			}

            return {
                getPath : getPath
            }
        }
    }
)
