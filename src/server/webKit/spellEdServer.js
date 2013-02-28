var requirejs = require( 'requirejs' ),
	path      = require( 'path' ),
	spellPath = path.resolve( process.cwd() , '..' )

requirejs.config( {
	baseUrl: spellPath + '/src',
	nodeRequire: require
} )

requirejs(
	[
		'connect',
		'http',
		'connect-extdirect/extDirect',
		'connect-urlRewriter/createUrlRewriter',
		'server/createExtDirectApi',
		'fs',
		'path'
	],
	function(
		connect,
		http,
		extDirect,
		createUrlRewriter,
		createExtDirectApi,
		fs,
		path
		) {
		'use strict'

		var port                   = 3000,
			bport                  = 8080,
			projectsPath           = path.resolve( spellPath , '../../projects' )

		var buildServerOptions = {
			host   : 'localhost',
			port   : bport,
			path   : '/router/',
			method : 'POST'
		}

		var app = connect()
			.use(
			function( req, res, next ) {
				var url = req.url
				console.log( url )
				next()
			}
		)
			.use(
			extDirect(
				'/router/',
				'Spelled',
				createExtDirectApi( projectsPath, buildServerOptions )
			)
		)
			.use(
			createUrlRewriter( [
				{
					rewrite : /public\/library/,
					to      : 'library'
				}
			] )
		)
			// the user's projects directory
			.use( connect.static( projectsPath ) )

			// SpellEd public directory
			.use( connect.static( 'public' ) )

		http.Server( app ).listen( port )
	}
)

