define(
	'server/createExtDirectApi',
	[
		'server/extDirectApi/build/clean',
		'server/extDirectApi/build/debug',
		'server/extDirectApi/build/export',
		'server/extDirectApi/build/release',
		'server/extDirectApi/createStorageApi',
		'server/extDirectApi/getStaticDependencies',
		'server/extDirectApi/initDirectory',
		'server/extDirectApi/notSupported'
	],
	function(
		buildClean,
		buildDebug,
		buildExport,
		buildRelease,
		createStorageApi,
		getStaticDependencies,
		initDirectory,
		notSupported
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

		var createResponseData = function( method, payload, id, result ) {
			var post_data = {
				action : "ProjectActions",
				method : method,
				data   : payload,
				type   : "rpc",
				tid    : id,
				output : result
			}

			return JSON.stringify( post_data )
		}

		/*
		 * private
		 */
		var createWrapper = function( spellCorePath, projectsPath, spellCliPath, isDevEnvironment, actionName, actionHandler ) {
			return function( req, res, payload ) {
				var onComplete = function( error, result ) {

					if( error !== null ) {
						console.log( 'childProcess.execFile ' + error )
						writeResponse( 500, res, error.toString() )

					} else {
						writeResponse( 200, res, createResponseData( actionName, payload, req.extDirectId, result ) )
					}
				}
				//Mark request as async
				req.async = true

				actionHandler.apply( null, [ spellCorePath, projectsPath, spellCliPath, isDevEnvironment, onComplete ].concat( payload ) )
			}
		}

		return function( projectsRoot, spellCorePath, spellCliPath, demonstrationMode ) {
			// TODO: detect if its the devEnvironment
			var isDevEnvironment = true

			var createAction = function( actionHandler ) {
				return !demonstrationMode ?	actionHandler : notSupported
			}

			var spellCliExecutablePath = spellCliPath + ( process.platform == 'win32' ? '.exe' : '' )

			return {
				DependencyActions : [
					{
						name: "getStaticDependencies",
						len: 1,
						func: function( req, res, payload ) {
							var params    = payload[ 0 ],
								libraryId = params.libraryId ? params.libraryId.split( '###' )[0] : null
							//TODO: remove hack for detecting the node id. somehow ext can't be configurated to submit other keys as ids
							return getStaticDependencies( projectsRoot, params.projectName, libraryId )
						}
					}
				],
				StorageActions : createStorageApi( projectsRoot, demonstrationMode ),
				SpellBuildActions : [
					{
						name: "initDirectory",
						len: 2,
						func: createAction( createWrapper( spellCorePath, projectsRoot, spellCliExecutablePath, isDevEnvironment, 'initDirectory', initDirectory ) )
					},
					{
						name: "buildExport",
						len: 3,
						func: createAction( createWrapper( spellCorePath, projectsRoot, spellCliExecutablePath, isDevEnvironment, 'buildExport', buildExport ) )
					},
					{
						name: "buildClean",
						len: 1,
						func: createAction( createWrapper( spellCorePath, projectsRoot, spellCliExecutablePath, isDevEnvironment, 'buildClean', buildClean ) )
					},
					{
						name: "buildDebug",
						len: 2,
						func: createAction( createWrapper( spellCorePath, projectsRoot, spellCliExecutablePath, isDevEnvironment, 'buildDebug', buildDebug ) )
					},
					{
						name: "buildRelease",
						len: 2,
						func: createAction( createWrapper( spellCorePath, projectsRoot, spellCliExecutablePath, isDevEnvironment, 'buildRelease', buildRelease ) )
					}
				]
			}
		}
	}
)
