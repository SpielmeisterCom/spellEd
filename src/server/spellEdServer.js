define(
	'server/spellEdServer',
	[
		'connect',
		'http',
		'connect-extdirect/extDirect',
		'connect-urlRewriter/createUrlRewriter',
		'server/createExtDirectApi',
		'commander',
		'fs',
		'path'
	],
	function(
		connect,
		http,
		extDirect,
		createUrlRewriter,
		createExtDirectApi,
		commander,
		fs,
		path
	) {
		'use strict'


	    var printErrors = function( errors ) {
		    var tmp = []
		    tmp = tmp.concat( errors )

		    console.error( tmp.join( '\n' ) )
	    }


	    return function( argv, cwd, spellPath ) {
		    var executableName  = 'server'

		    var startServerCommand = function( command ) {
			    var errors                 = [],
				    port                   = command.port || 3000,
				    projectsPath           = path.resolve( path.join( cwd , command.projectsRoot ? '/' + command.projectsRoot : '/projects' ) ),
					spellCliPath           = path.resolve( command.spellCliPath ),
					spellEngineModulesPath = path.resolve( projectsPath, '../modules' ),
					nodeModulesPath        = path.resolve( spellPath, '../node_modules' ),
					spellCorePath          = path.resolve( spellPath, '../spellCore' )

			    if( !fs.existsSync( projectsPath ) ) {
				    errors.push( 'Error: No valid projects directory supplied. Unable to start spelled server. ' +
					    'See \'' + executableName + ' start-server --help\'.' )
			    }

			    if( errors.length > 0 ) {
				    printErrors( errors )

			    } else {
				    var app = connect()
						.use( connect.favicon() )
					    .use( connect.logger( 'dev' ) )
					    .use(
							extDirect(
								'/router/',
								'Spelled',
								createExtDirectApi( projectsPath, spellCorePath, spellCliPath )
							)
						)
						.use(
							createUrlRewriter( [
								{
									rewrite : '/libs/require.js',
									to      : '/require.js'
								},
								{
									rewrite : '/libs/underscore.js',
									to      : '/underscore.js'
								},
								{
									rewrite : '/libs/ace/',
									to      : '/lib/ace/'
								},
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

						// Because the modules ace, requirejs and underscore are located outside of the regular webserver root they have to be added manually.
						.use( connect.static( path.resolve( spellEngineModulesPath, 'ace' ) ) )
					    .use( connect.static( path.resolve( nodeModulesPath, 'requirejs' ) ) )
						.use( connect.static( path.resolve( nodeModulesPath, 'underscore' ) ) )

				    http.Server( app ).listen( port )

				    console.log( 'Server started on port ' + port + ' and will use project path ' + projectsPath  )
			    }
		    }


		    commander
			    .version( '0.0.1' )

		    commander
			    .command( 'start-server' )
			    .option( '-p, --port [port number]', 'the port the server runs on' )
			    .option( '-r, --projects-root [directory]', 'The path to the projects directory that contains the project directories. The default is the current working directory.' )
				.option( '-c, --spell-cli-path [file]', 'The path to the spellCli executable.' )
			    .description( 'start the spelled server' )
			    .action( startServerCommand )

		    commander.parse( argv )
	    }
    }
)

