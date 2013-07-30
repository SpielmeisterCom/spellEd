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


		return function( spellCorePath, workspacePath, spellCliExecutablePath, isDevEnvironment, onComplete, projectName ) {
			var projectPath = path.join( workspacePath, path.normalize( projectName ) )

			childProcess.execFile( spellCliExecutablePath, [ 'clean', '-p', projectPath ], {}, onComplete )
		}
    }
)
