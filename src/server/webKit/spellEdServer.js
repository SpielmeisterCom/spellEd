var requirejs = require( 'requirejs' ),
	path      = require( 'path' ),
	fs		  = require( 'fs' ),
	spellPath = process.cwd(),
	define    = requirejs.define

requirejs.config( {
	baseUrl: spellPath + '/src',
	nodeRequire: require
} )

//load needed spell util scripts
eval( fs.readFileSync( path.resolve( spellPath, 'spellCore/build/spell.util.js' ), 'utf8' ) )

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

		var port          = 3000,
			spellCorePath = path.resolve( spellPath, 'spellCore' )

		var app = connect()
			.use(
			createUrlRewriter( [
				{
					rewrite : /public\/library/,
					to      : 'library'
				}
			] )
		)
			// SpellEd public directory
			.use( connect.static( 'public' ) )

			.use( connect.urlencoded() )
			.use( function( req, res, next ){
				if ( 'POST' != req.method || req.url != '/setSpelledConfig' ) return next()
				if( req.body.peek ) return res.end()

				if( !req.body.projectsPath || req.body.projectsPath.length < 1 ) throw "No such folder"

				var projectsPath = path.resolve( spellPath , path.normalize( req.body.projectsPath ) ),
					folderStat   = fs.statSync( projectsPath )

				if( folderStat.isDirectory() ) {
					app.use(
						extDirect(
							'/router/',
							'Spelled',
							createExtDirectApi( projectsPath, spellCorePath )
						)
					)
					app.use( connect.static( projectsPath ) )
				} else {
					throw "No such folder"
				}

				return res.end()
			} )

		http.Server( app ).listen( port )
	}
)

