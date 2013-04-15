define(
	'server/extDirectApi/initDirectory',
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

		/*
		 * RPC call handler
		 *
		 * @param spellCorePath
		 * @param workspacePath
		 * @param spellCliPath
		 * @param isDevEnvironment
		 * @param projectName
		 * @param onComplete
		 * @return {*}
		 */
		return function( spellCorePath, workspacePath, spellCliPath, isDevEnvironment, projectName, onComplete ) {
			var projectPath = path.join( workspacePath , projectName )

			childProcess.execFile( spellCliPath + appendExtension, [ 'init','-d', projectPath ], {}, onComplete )
		}
    }
)
