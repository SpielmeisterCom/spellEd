define(
	'server/extDirectApi/build/export',
	[
		'path',
		'child_process'
	],
	function(
		path,
		childProcess
	) {
		'use strict'


		return function( spellCorePath, workspacePath, spellCliExecutablePath, isDevEnvironment, onComplete, projectName, outputFileName, target ) {
			var projectPath    = path.join( workspacePath, path.normalize( projectName ) ),
				outputFilePath = path.join( workspacePath, path.normalize( outputFileName ) )

			childProcess.execFile( spellCliExecutablePath, [ 'export', target, '-p', projectPath, '-f', outputFilePath ], {}, onComplete )
		}
    }
)
