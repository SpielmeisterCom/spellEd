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
                        content : ""
                    }
                }
            }

            var read = function( req, res, payload ) {

                if( !! payload[0].id ) {
                    return util.readFile( payload[0].id )
                } else {
                    return getAll()
                }
            }

            var update = function(  ) {

            }

            var destroy = function( req, res, payload ) {
                var filePath = payload[0].id

                util.deleteFile( filePath )

                return true
            }

            var getTree = function( req, res, payload, next ) {

                var tmpPath = root + payload[1] +  scriptPathPart


                return util.listing(tmpPath, true, req, res, payload, next)
            }

            var getAll = function( ) {
                var result = amdHelper.loadModules( root + scriptPathPart )

console.log( result )
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
