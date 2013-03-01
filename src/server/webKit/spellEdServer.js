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
			projectsPath  = path.resolve( spellPath , '../../../projects' ),
			spellCorePath = path.resolve( spellPath, 'spellCore' )

		var app = connect()
			.use(
			extDirect(
				'/router/',
				'Spelled',
				createExtDirectApi( projectsPath, spellCorePath )
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

