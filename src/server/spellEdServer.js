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
				    bport                  = command.bport || 8080,
				    projectsPath           = path.resolve( cwd + ( command.projectsRoot ? '/' + command.projectsRoot : '/projects' ) ),
					spellEngineModulesPath = path.resolve( projectsPath, '../modules' )

				var buildServerOptions = {
					host   : 'localhost',
					port   : bport,
					path   : '/router/',
					method : 'POST'
				}


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
								createExtDirectApi( projectsPath, buildServerOptions )
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
						.use( connect.static( path.resolve( spellEngineModulesPath, 'requirejs' ) ) )
						.use( connect.static( path.resolve( spellEngineModulesPath, 'underscore' ) ) )

				    http.Server( app ).listen( port )

				    console.log( 'Server started on port ' + port + ' and will use project path ' + projectsPath + ' and connect to a build server at port ' + bport )
			    }
		    }


		    commander
			    .version( '0.0.1' )

		    commander
			    .command( 'start-server' )
			    .option( '-p, --port [port number]', 'the port the server runs on' )
			    .option( '-b, --bport [port number]', 'the port the build server is listening' )
			    .option( '-r, --projects-root [directory]', 'The path to the projects directory that contains the project directories. The default is the current working directory.' )
			    .description( 'start the spelled server' )
			    .action( startServerCommand )

		    commander.parse( argv )
	    }
    }
)

