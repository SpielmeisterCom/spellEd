define(
    'server/extDirectApi/createAssetsApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
        'mime',

        'underscore'

    ],
    function(
        path,
        fs,
        createUtil,
        mime,

        _
    ) {
        'use strict'

        return function( root ) {
            var assetPathPart = "/library/assets"

            var util = createUtil( root )

            var createAsset = function( req, res, payload, next ) {

                var assetName   = payload.name,
                    projectName = payload.projectName,
                    files       = payload.files


                var Asset = _.first( files )

                var newFileNameWithoutExtension = root + projectName + assetPathPart + "/" + assetName,
                    filePath                    = newFileNameWithoutExtension +"." + mime.extension( Asset.file.type )


                fs.renameSync( Asset.file.path, filePath )


                var result = {
                    name: assetName,
                    type: Asset.file.type,
                    path: filePath
                }

                util.writeFile( newFileNameWithoutExtension + ".json", JSON.stringify( result, null, "\t" ), false )

                return {
                    success: true,
                    data: result
                }
            }

            var getAll = function( req, res, payload, next ) {

            }

            var readAsset = function( req, res, payload, next ) {
                var tmpPath = util.getPath( payload[0].id )
                return util.readFile( tmpPath )
            }

            var updateAsset = function( req, res, payload, next ) {
                var project = payload[ 0 ]

            }

            var deleteAsset = function( req, res, payload, next ) {
                return "errol"
            }

            var getTree = function( req, res, payload, next ) {

                var tmpPath = root + payload[1] +  assetPathPart


                var result = util.listing( tmpPath, true, req, res, payload, next )

                return result
            }

            return [
                {
                    name: "create",
                    len: 0,
                    func: createAsset,
                    form_handler: true
                },
                {
                    name: "read",
                    len: 1,
                    func: readAsset
                },
                {
                    name: "update",
                    len: 1,
                    func: updateAsset
                },
                {
                    name: "delete",
                    len: 1,
                    func: deleteAsset
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
