define(
	'server/createExtDirectApi',
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

		var writeResponse = function( status, res, data ) {
			var data = data || ""

			res.writeHead( status, {
				'Content-type'  : 'application/json',
				'Content-Length': data.length
			} )

			res.write( data )
			res.end()
		}

		var createResponseData = function( method, payload, id ) {
			var post_data = {
				action : "ProjectActions",
				method : method,
				data   : payload,
				type   : "rpc",
				tid    : id
			}

			return JSON.stringify( post_data )
		}

		/*
		 * private
		 */
		var initDirectoryWrapper = function( spellCorePath, projectsPath, spellCliPath, isDevEnvironment, req, res, payload ) {
			var projectName = payload[ 0 ]

			var onComplete = function( error ) {

				if ( error !== null) {
					console.log( 'childProcess.execFile ' + error )
					writeResponse( 500, res )
				} else {
					writeResponse( 200, res, createResponseData( "initDirectory", payload, req.extDirectId ) )
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
					writeResponse( 500, res )
				} else {
					writeResponse( 200, res, createResponseData( "exportDeployment", payload, req.extDirectId ) )
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
