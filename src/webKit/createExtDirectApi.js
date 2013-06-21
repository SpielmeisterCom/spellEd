define(
	'webKit/createExtDirectApi',
	[
		'path',
		'server/extDirectApi/createStorageApi',
		'server/extDirectApi/build/clean',
		'server/extDirectApi/build/debug',
		'server/extDirectApi/build/export',
		'server/extDirectApi/build/release',
		'server/extDirectApi/initDirectory'
	],
	function(
		path,
		createStorageApi,
		buildClean,
		buildDebug,
		buildExport,
		buildRelease,
		initDirectory
	) {
	'use strict'
		/*
		 * private
		 */

		var createWrapper = function( spellCorePath, projectsPath, spellCliPath, isDevEnvironment, actionName, actionHandler ) {
			return function( req, res, payload ) {
				var onComplete = function( error ) {
					if ( error !== null) {
						console.log( 'childProcess.execFile ' + error )
					}
				}

				actionHandler.apply( null, [ spellCorePath, projectsPath, spellCliPath, isDevEnvironment, onComplete ].concat( payload ) )
			}
		}

        return function( projectsRoot, spellCorePath, spellCliPath ) {
			var isDevEnvironment = true
			var execDir = path.dirname( process.execPath )

			spellCorePath = path.join( execDir, spellCorePath )
			spellCliPath  = path.join( execDir, spellCliPath )

            return {
				StorageActions    : createStorageApi( projectsRoot ),
				SpellBuildActions : [
					{
						name: "initDirectory",
						len: 2,
						func: createWrapper( spellCorePath, projectsRoot, spellCliPath, isDevEnvironment, 'initDirectory', initDirectory )
					},
					{
						name: "buildExport",
						len: 3,
						func: createWrapper( spellCorePath, projectsRoot, spellCliPath, isDevEnvironment, 'buildExport', buildExport )
					},
					{
						name: "buildClean",
						len: 1,
						func: createWrapper( spellCorePath, projectsRoot, spellCliPath, isDevEnvironment, 'buildClean', buildClean )
					},
					{
						name: "buildDebug",
						len: 2,
						func: createWrapper( spellCorePath, projectsRoot, spellCliPath, isDevEnvironment, 'buildDebug', buildDebug )
					},
					{
						name: "buildRelease",
						len: 2,
						func: createWrapper( spellCorePath, projectsRoot, spellCliPath, isDevEnvironment, 'buildRelease', buildRelease )
					}
				]
			}
		}
	}
)
