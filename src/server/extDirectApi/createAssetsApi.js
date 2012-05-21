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
                    files       = payload.files,
                    type        = payload.type


                var Asset = _.first( files )

                var newFileNameWithoutExtension = root + projectName + assetPathPart + "/" + assetName,
                    filePath                    = newFileNameWithoutExtension +"." + mime.extension( Asset.file.type )


                fs.renameSync( Asset.file.path, filePath )


                var result = {
                    name: assetName,
                    mimeType: Asset.file.type,
                    path: filePath,
                    type: type
                }

                util.writeFile( newFileNameWithoutExtension + ".json", JSON.stringify( result, null, "\t" ), false )

                return {
                    success: true,
                    data: result
                }
            }

            var readAsset = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updateAsset = function( req, res, payload, next ) {

            }

            var deleteAsset = function( req, res, payload, next ) {
                return util.deleteFile( payload[0].id )
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
