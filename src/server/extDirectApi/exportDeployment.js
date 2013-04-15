define(
	'server/extDirectApi/exportDeployment',
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
		 * @param projectName : relative project path in projects directory
		 * @param outputFileName : relative output file path in projects directory
		 * @param onComplete
		 * @return {*}
		 */
		return function( spellCorePath, workspacePath, spellCliPath, projectName, outputFileName, onComplete ) {
			var projectPath    = path.join( workspacePath, path.normalize( projectName ) ),
				outputFilePath = path.join( workspacePath, path.normalize( outputFileName ) )

			childProcess.execFile( spellCliPath + appendExtension, [ 'export','-d', projectPath, '-f', outputFilePath ], {}, onComplete )
		}
    }
)
