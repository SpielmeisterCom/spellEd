define(
	'server/extDirectApi/initDirectory',
	[
		'child_process',
		'fs',
		'path',
		'wrench'
	],
	function(
		childProcess,
		fs,
		path,
		wrench
	) {
		'use strict'


		/*
		 * RPC call handler
		 *
		 * @param spellCorePath
		 * @param workspacePath
		 * @param spellCliExecutablePath
		 * @param isDevEnvironment
		 * @param onComplete
		 * @param projectName
		 * @param deleteFolder
		 * @return {*}
		 */
		return function( spellCorePath, workspacePath, spellCliExecutablePath, isDevEnvironment, onComplete, projectName, deleteFolder ) {
			var projectPath = path.join( workspacePath, projectName )

			if( deleteFolder ) {
				wrench.rmdirSyncRecursive( projectPath, true )
			}

			childProcess.execFile( spellCliExecutablePath, [ 'init', '-p', projectPath ], {}, onComplete )
		}
    }
)
