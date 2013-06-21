define(
	'server/extDirectApi/initDirectory',
	[
		'fs',
		'path',
		'child_process'
	],
	function(
		fs,
		path,
		childProcess
	) {
		'use strict'

		var appendExtension = process.platform == 'win32' ? '.exe' : ''

		var deleteFolderRecursive = function(path) {
			var files = [];
			if( fs.existsSync(path) ) {
				files = fs.readdirSync(path);
				files.forEach(function(file,index){
					var curPath = path + "/" + file;
					if(fs.statSync(curPath).isDirectory()) { // recurse
						deleteFolderRecursive(curPath);
					} else { // delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		}

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
		return function( spellCorePath, workspacePath, spellCliPath, isDevEnvironment, onComplete, projectName ) {
			var projectPath = path.join( workspacePath, projectName )

			deleteFolderRecursive( projectPath)

			childProcess.execFile( spellCliPath + appendExtension, [ 'init', '-p', projectPath ], {}, onComplete )
		}
    }
)
