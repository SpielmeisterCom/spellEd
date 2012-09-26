define(
	'connect-urlRewriter/createUrlRewriter',
	[
		'fs',

		'underscore'
	],
	function(
		fs,

		_
	) {
		'use strict'


		return function( rewriteRules ) {
			return function( req, res, next ) {
				var url = req.url,
					rewrittenUrl

				for( var i = 0, numRules = rewriteRules.length; i < numRules; i++ ) {
					var rewriteRule = rewriteRules[ i ],
						pattern     = rewriteRule.rewrite,
						replacement = rewriteRule.to

					if( _.isString( pattern ) ) {
						if( url === pattern ) {
							rewrittenUrl = replacement

						} else if( url.indexOf( pattern ) === 0 ) {
							rewrittenUrl = replacement + '/' + url.substr( pattern.length )
						}

					} else if( _.isRegExp( pattern ) ) {
						rewrittenUrl = req.url.replace( pattern, replacement )
					}

					if( rewrittenUrl ) {
						req.url = rewrittenUrl
						break
					}
				}

				next()
			}
		}
	}
)
