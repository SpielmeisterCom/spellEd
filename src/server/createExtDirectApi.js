define(
    'server/createExtDirectApi',
    [
        'path',
		'http',
        'fs',
        'server/extDirectApi/createUtil',
		'server/extDirectApi/createStorageApi',

        'underscore'
    ],
    function(
        path,
		http,
        fs,
        createUtil,
		createStorageApi,

        _
    ) {
        'use strict'


        return function( projectsRoot, buildServerOptions ) {

			var exportDeployment = function( req, res, payload, next ) {
				spellBuildServerWrapper( "exportDeployment", payload, req, res )
			}

			var initDirectory = function( req, res, payload, next ) {
				spellBuildServerWrapper( "initDirectory", payload, req, res )
			}

			var spellBuildServerWrapper = function( method, payload, req, res ) {
				var post_data = {
						action : "ProjectActions",
						method : method,
						data   : payload,
						type   : "rpc",
						tid    : req.extDirectId
					},
					dataAsString = JSON.stringify( post_data )

				buildServerOptions.headers = {
					'Content-Type': 'application/json',
					'Content-Length': dataAsString.length
				}

				var post_req = http.request(
					buildServerOptions,
					function( response ) {
						response.setEncoding( 'utf8' )

						var data = ''

						response.on( 'data', function ( chunk ) {
							data += chunk
						} )

						response.on( 'end', function () {
							var responseData = _.clone( post_data )
							responseData.result = [ data ]
							writeResponse( 200, res, JSON.stringify( responseData ) )
						} )
					}
				)

				post_req.on( 'error', function() {
					writeResponse( 503, res )
				} )

				// post the data
				post_req.write( dataAsString )
			}

			var writeResponse = function( status, res, data ) {
				var data = data || ""

				res.writeHead( status, {
					'Content-type'  : 'application/json',
					'Content-Length': data.length
				} )

				res.write( data )
				res.end()
			}

            return {
				StorageActions           : createStorageApi( projectsRoot ),
				SpellBuildActions : [
					{
						name: "initDirectory",
						len: 2,
						func: initDirectory
					},
					{
						name: "exportDeployment",
						len: 2,
						func: exportDeployment
					}
				]
            }
        }
    }
)
