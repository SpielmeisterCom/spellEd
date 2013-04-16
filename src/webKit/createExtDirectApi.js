define(
	'webKit/createExtDirectApi',
	[
		'server/extDirectApi/createStorageApi',
		'server/extDirectApi/exportDeployment',
		'server/extDirectApi/initDirectory',

		'underscore'
	],
	function(
		createStorageApi,
		exportDeployment,
		initDirectory,

		_
	) {
	'use strict'
		/*
		 * private
		 */
		var initDirectoryWrapper = function( spellCorePath, projectsPath, spellCliPath, isDevEnvironment, req, res, payload ) {
			var projectName = payload[ 0 ]

			var onComplete = function( error ) {

				if ( error !== null) {
					console.log( 'childProcess.execFile ' + error )
				}
			}

			initDirectory( spellCorePath, projectsPath, spellCliPath, isDevEnvironment, projectName, onComplete )
		}

		var exportDeploymentWrapper = function( spellCorePath, projectsPath, spellCliPath, req, res, payload  ) {
			var projectName    = payload[ 0 ],
				outputFileName = payload[ 1 ]

			var onComplete = function( error ) {

				if ( error !== null) {
					console.log( 'childProcess.execFile ' + error )
				}
			}

			exportDeployment( spellCorePath, projectsPath, spellCliPath, projectName, outputFileName, onComplete )
		}

        return function( projectsRoot, spellCorePath, spellCliPath ) {
            return {
				StorageActions    : createStorageApi( projectsRoot ),
				SpellBuildActions : [
					{
						name: "initDirectory",
						len: 2,
						func: _.bind(
							initDirectoryWrapper,
							null,
							spellCorePath,
							projectsRoot,
							spellCliPath,
							true
						)
					},
					{
						name: "exportDeployment",
						len: 2,
						func: _.bind(
							exportDeploymentWrapper,
							null,
							spellCorePath,
							projectsRoot,
							spellCliPath
						)
					}
				]
			}
		}
	}
)
