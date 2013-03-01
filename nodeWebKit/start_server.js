var requirejs = require( 'requirejs' ),
	path      = require( 'path' ),
	spellPath = process.cwd()

requirejs.config( {
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

		var child = childProcess.execFile( 'node', [ path.resolve( spellPath , 'src/server/webKit/spellEdServer.js' ) ], function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		} )

		process.on( 'exit', function () {
			child.kill()
		})
	}
)