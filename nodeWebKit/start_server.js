var requirejs = require( 'requirejs' ),
	path      = require( 'path' ),
	spellPath = path.resolve( process.cwd() , '..' )

requirejs.config( {
	baseUrl: spellPath + '/src',
	nodeRequire: require
} )

requirejs(
	[
		'child_process'
	],
	function(
		childProcess
		) {
		'use strict'

		childProcess.execFile( 'node', [ spellPath + '/src/server/webKit/spellEdServer.js' ] )
	}
)