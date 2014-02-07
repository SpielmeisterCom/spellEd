define(
	'server/spellEdServer',
	[
		'pathUtil',
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
		pathUtil,
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

		var parseConfigFile = function( configFilePath ) {
			var config = fs.readFileSync( configFilePath, 'utf8' )

			if( config ) return JSON.parse( config )
		}


		return function( argv, cwd, spellPath ) {
			var configFilePath = pathUtil.createConfigFilePath( cwd, 'spell', 'spellConfig.json' ),
				executableName = 'server'

			if( !fs.existsSync( configFilePath ) ) return console.error( "Error: Missing spellConfig file" )

			var config = parseConfigFile( configFilePath )

			var startServerCommand = function( command ) {
				var errors          = [],
					demo            = command.demo || false,
					port            = command.port || 3000,
					projectsPath    = path.resolve( command.projectsRoot ),
					nodeModulesPath = path.resolve( spellPath, 'node_modules' ),
					spellCorePath   = path.resolve( spellPath, config.spellCorePath ),
					spellCliPath    = path.resolve( command.spellCliPath || path.join( spellPath, config.spellCliPath, 'spellcli' ) )

				if( !fs.existsSync( nodeModulesPath ) ) {
					nodeModulesPath = path.resolve( spellPath, '../../node_modules' )
				}

				if( !fs.existsSync( projectsPath ) ) {
					errors.push( 'Error: "' + projectsPath + '" is not a valid projects directory. Unable to start server. ' +
						'See \'' + executableName + ' start-server --help\'.' )
				}

				if( !fs.existsSync( spellCliPath ) ) {
					errors.push( 'Error: "' + spellCliPath + '" is not a valid spellcli path. Unable to start server.' )
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
								createExtDirectApi( projectsPath, spellCorePath, spellCliPath, demo )
							)
						)
						.use(
							createUrlRewriter( [
								{
									rewrite : '/lib/require.js',
									to      : '/require.js'
								},
								{
									rewrite : '/lib/underscore.js',
									to      : '/underscore.js'
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
						.use( connect.static( path.join( spellPath, 'public' ) ) )

						// Because the modules ace, requirejs and underscore are located outside of the regular webserver root they have to be added manually.
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
				.option( '-d, --demo', 'The editor is running as a demo version.' )
			    .description( 'start the spelled server' )
			    .action( startServerCommand )

		    commander.parse( argv )
	    }
    }
)

