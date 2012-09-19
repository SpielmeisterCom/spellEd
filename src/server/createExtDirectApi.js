define(
    'server/createExtDirectApi',
    [
        'path',
		'http',
        'fs',
        'server/extDirectApi/createUtil',
		'server/extDirectApi/createStorageApi',
        'server/extDirectApi/templates/createComponentApi',
        'server/extDirectApi/templates/createEntityApi',
        'server/extDirectApi/templates/createSystemApi',
		'server/extDirectApi/templates/entityTemplateFormatter',
        'server/extDirectApi/createAssetsApi',
        'server/extDirectApi/ProjectApi',

        'underscore'
    ],
    function(
        path,
		http,
        fs,
        createUtil,
		createStorageApi,
        createComponentApi,
        createEntityApi,
        createSystemApi,
		entityTemplateFormatter,
        createAssetsApi,
        createProjectApi,

        _
    ) {
        'use strict'


        return function( projectsRoot, buildServerOptions ) {

            var projectTemplateLibraryPath = "/library/templates/"
            var util = createUtil( projectsRoot )


            var listTemplates = function( req, res, payload, next ) {
                var requestedNode = ( payload[ 0 ] !== 'root' ) ? payload[ 0 ] :  projectsRoot + payload[1] + projectTemplateLibraryPath,
                	tmpPath       = util.getPath( requestedNode )

                if ( !tmpPath ) return {}

                return util.jsonListing( tmpPath, true, req, res, payload, next )
            }

            var getAllTemplates = function( projectName, type ) {
                var templatesPath =  projectsRoot + projectName + projectTemplateLibraryPath,
                    tmpPath = util.getPath( templatesPath )


                if ( !tmpPath ) return {}

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return {}

                return _.filter(
                    util.getDirFilesAsObjects( tmpPath ),
                    function( template ) {
                        return ( template.type === type )
                    }
                )
            }

            var getAllentityTemplates = function( req, res, payload, next ) {
                var projectName = payload[ 0 ]

                return _.map(
					getAllTemplates( projectName, 'entityTemplate' ),
					function( entityTemplate ) {
						return entityTemplateFormatter.toEditorFormat( entityTemplate )
					}
				)
            }

            var getAllcomponentTemplates = function( req, res, payload, next ) {
                var projectName = payload[0]
                return getAllTemplates( projectName, 'componentTemplate' )
            }

			var getAllSystemsTemplates = function( req, res, payload, next ) {
				var projectName = payload[0]
				return getAllTemplates( projectName, 'systemTemplate' )
			}

            var createTemplate = function( req, res, payload, next ) {
                var api = undefined

				switch( payload.type ) {
					case "componentTemplate":
						api = createComponentApi( projectsRoot )
						break
					case "entityTemplate":
						api = createEntityApi( projectsRoot )
						break
					case "systemTemplate":
						api = createSystemApi( projectsRoot )
						break
					default:
						return writeResponse( 500, res )
				}

                var apiFunction = _.find(
                    api,
                    function( item ) {
                        return ( item.name === 'create')
                    }
                )

                if( apiFunction ) {
                    return apiFunction.func( req, res, payload, next )
                }
            }

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
                ProjectActions           : createProjectApi( projectsRoot ) ,
                ComponentTemplateActions : createComponentApi( projectsRoot ),
                EntityTemplateActions    : createEntityApi( projectsRoot ),
                AssetsActions            : createAssetsApi( projectsRoot ),
                SystemTemplateActions    : createSystemApi( projectsRoot ),
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
				],
                TemplatesActions : [
                    {
                        name: "createTemplate",
                        len: 0,
                        func: createTemplate,
                        form_handler: true
                    },
                    {
                        name: "getTree",
                        len: 2,
                        func: listTemplates
                    },
                    {
                        name: "getAllEntitiesTemplates",
                        len: 1,
                        func: getAllentityTemplates
                    },
                    {
                        name: "getAllComponentsTemplates",
                        len: 1,
                        func: getAllcomponentTemplates
                    },
					{
						name: "getAllSystemsTemplates",
						len: 1,
						func: getAllSystemsTemplates
					}
                ]
            }
        }
    }
)
