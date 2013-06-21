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

		var appendExtension = process.platform == 'win32' ? '.exe' : ''

		return function( spellCorePath, workspacePath, spellCliPath, isDevEnvironment, onComplete, projectName, outputFileName, target ) {
			var projectPath    = path.join( workspacePath, path.normalize( projectName ) ),
				outputFilePath = path.join( workspacePath, path.normalize( outputFileName ) )

			childProcess.execFile( spellCliPath + appendExtension, [ 'export', target, '-p', projectPath, '-f', outputFilePath ], {}, onComplete )
		}
    }
)
