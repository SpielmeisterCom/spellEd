define(
	'server/extDirectApi/build/release',
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

		return function( spellCorePath, workspacePath, spellCliPath, isDevEnvironment, onComplete, projectName, target ) {
			var projectPath = path.join( workspacePath, path.normalize( projectName ) )

			childProcess.execFile( spellCliPath + appendExtension, [ 'build', target, '-p', projectPath, '--release' ], {}, onComplete )
		}
    }
)
