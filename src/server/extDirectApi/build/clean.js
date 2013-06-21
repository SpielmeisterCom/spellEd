define(
	'server/extDirectApi/build/clean',
	[
		'path',
		'child_process'
	],
	function(
		path,
		childProcess
	) {
		'use strict'

		var appendExtension = process.platform == 'win32' ? '.exe' : ''

		return function( spellCorePath, workspacePath, spellCliPath, isDevEnvironment, onComplete, projectName ) {
			var projectPath = path.join( workspacePath, path.normalize( projectName ) )

			childProcess.execFile( spellCliPath + appendExtension, [ 'clean', '-p', projectPath ], {}, onComplete )
		}
    }
)
