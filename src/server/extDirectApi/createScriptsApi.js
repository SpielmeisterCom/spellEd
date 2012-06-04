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
                    folder     = ( payload.folder === "root" ) ? root + payload.projectName + scriptPathPart : payload.folder


                var baseName = scriptName +".js"


                var namespace = util.extractNamespaceFromPath( folder, scriptPathPart )

                var name = ( namespace.length > 0 ) ? namespace + "/" + baseName : baseName

                util.writeFile( baseName, "", false )

                return {
                    success: true,
                    data: {
                        name: name,
                        content : "",
                        path: baseName
                    }
                }
            }

            var read = function( req, res, payload ) {
                if( !! payload[0].id ) {
                    var id = payload[0].id
                    var response = amdHelper.loadModules( root + "/**/" + scriptPathPart )
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
                return false
            }

            var getTree = function( req, res, payload, next ) {
                var tmpPath = root + payload[1] + scriptPathPart

                return util.listing(tmpPath, true, req, res, payload, next)
            }

            var getAll = function( req, res, payload ) {
                //TODO: projectname muss noch rein
                var response = amdHelper.loadModules( root + "/**/" + scriptPathPart )

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
                },
                {
                    name: getAll,
                    len: 1,
                    func: getAll
                }
            ]
        }
    }
)
