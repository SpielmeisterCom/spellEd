define(
	'server/extDirectApi/notSupported',
	[

	],
	function(

	) {
		'use strict'

		return function( req, res, payload ) {
			res.statusCode = 404

			return res.end( "Demo version does not support this." )
		}
    }
)
