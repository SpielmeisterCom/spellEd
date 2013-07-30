define(
	'server/extDirectApi/build/debug',
	[
		'path',
		'child_process'
	],
	function(
		path,
		childProcess
	) {
		'use strict'


		return function( spellCorePath, workspacePath, spellCliExecutablePath, isDevEnvironment, onComplete, projectName, target ) {
			var projectPath = path.join( workspacePath, path.normalize( projectName ) )

			childProcess.execFile( spellCliExecutablePath, [ 'build', target, '-p', projectPath, '--debug'], {}, onComplete )
		}
    }
)
