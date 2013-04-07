var requirejs   = require( 'requirejs' ),
	path        = require( 'path' ),
	spellPath   = path.resolve( process.execPath + '/..'),
	tmpAppPath  = path.resolve( process.mainModule.filename + '/..'),
	nodeBin     = 'node'

if( process.platform == 'windows' ) {
	nodeBin += '.exe'
}


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

		var child = childProcess.execFile(
			spellPath + '/' + nodeBin,
			[ tmpAppPath + '/src/server/webKit/spellEdServer.js' ],

			function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			}
		)

		process.on( 'exit', function () {
			child.kill()
		})
	}
)
