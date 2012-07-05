define(
    'server/extDirectApi/createScriptsApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
        'amd-helper',

        'underscore'

    ],
    function(
        path,
        fs,
        createUtil,
        amdHelper,

        _
    ) {
        'use strict'

        return function( root ) {
            var scriptPathPart = "/library/scripts"

            var util = createUtil( root )

            var create = function( req, res, payload ) {
                var scriptName = payload.name,
                    folder     = ( payload.folder === "root" ) ? path.join( root , payload.projectName , scriptPathPart) : payload.folder,
                    filePath   = folder + "/" + scriptName + ".js"

                var namespace = util.extractNamespaceFromPath( folder, scriptPathPart )

                var name = ( namespace.length > 0 ) ? namespace + "/" + scriptName : scriptName
                var content = amdHelper.createModuleHeader( name )

                util.writeFile( filePath, content, false )

                return {
                    success: true,
                    data: {
                        id: namespace,
                        name: name,
                        content : content,
                        path: filePath
                    }
                }
            }

            var read = function( req, res, payload ) {
                if( !! payload[0].id ) {
                    var id 			= payload[0].id,
						projectName = payload[0].projectName

                    var response = amdHelper.loadModules( path.join( root , projectName , scriptPathPart ) )

                    //A Treelist sends the path to the JS file not the moduleId
                    if( path.extname( id ) === ".js" ) {

                        var keys = _.keys( response )

                        var result = {}
                        _.each(
                            keys,
                            function( key ) {
                                if( response[ key ].path === id ) {
                                    result.name    = key
                                    result.content = response[ key ].source
                                    result.path    = id
                                }
                            }
                        )

                        return result
                    }

                    if( !_.has( response, id ) ) return {}

                    return {
                        name: id,
                        content: response[ id ].source,
                        path: response[ id ].path
                    }

                } else {
                    return getAll( req, res, payload )
                }
            }

            var update = function( req, res, payload ) {
                _.each(
                    payload,
                    function( record ) {
                        if( _.has( record, 'path' ) && _.has( record, 'content') ) {
                            util.writeFile( record.path , record.content )
                        }
                    }
                )
            }

            var destroy = function( req, res, payload ) {
                var model = payload[0]

                if( _.has( model, 'path' ) && _.has( model, 'content') ) {
                    return util.deleteFile( model.path )
                }
            }

            var getTree = function( req, res, payload, next ) {
                var tmpPath = path.join( root , payload[1] , scriptPathPart )

                return util.fileListing(tmpPath, false, req, res, payload, next)
            }

            var getAll = function( req, res, payload ) {
				var projectName = payload[0].projectName
                var response = amdHelper.loadModules( path.join( root , projectName , scriptPathPart ) )

                var keys = _.keys( response )

                var result = []
                _.each(
                    keys,
                    function( key ) {
                        result.push({
                            name: key,
                            content: response[ key ].source,
                            path: response[ key ].path
                        })
                    }
                )

                return result
            }

            return [
                {
                    name: "create",
                    len: 0,
                    func: create,
                    form_handler: true
                },
                {
                    name: "read",
                    len: 1,
                    func: read
                },
                {
                    name: "update",
                    len: 1,
                    func: update
                },
                {
                    name: "destroy",
                    len: 1,
                    func: destroy
                },
                {
                    name: 'getTree',
                    len: 2,
                    func: getTree
                }
            ]
        }
    }
)
