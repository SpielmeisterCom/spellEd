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
                    folder      = ( payload.folder === "root" ) ? path.join( root , payload.projectName , assetPathPart ) : payload.folder,
                    files       = payload.files,
                    type        = payload.type


                var Asset     = _.first( files )
                var extension = mime.extension( Asset.file.type )

                var newFileNameWithoutExtension = folder + "/" + assetName,
                    baseName                    = assetName +"." + extension,
                    filePath                    = newFileNameWithoutExtension + "." + extension


                fs.renameSync( Asset.file.path, filePath )

                var namespace = util.extractNamespaceFromPath( folder, assetPathPart )

                var assetId = ( namespace.length > 0 ) ? namespace + "/" + baseName : baseName

                var result = {
                    assetId: assetId,
                    name: assetName,
                    namespace: namespace,
                    extension: extension,
                    type: type
                }

                util.writeFile( newFileNameWithoutExtension + ".json", JSON.stringify( result, null, "\t" ), false )

                return {
                    success: true,
                    data: result
                }
            }

            var readAsset = function( req, res, payload, next ) {
                if( !! payload[0].id ) {
                    return util.readFile( payload[0].id )
                } else {
                    return getAll( req, res, payload )
                }
            }

            var updateAsset = function( req, res, payload, next ) {

            }

            var deleteAsset = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id,
                    extension    = path.extname( jsonFilePath ),
                    tmpFilePath  = path.dirname( jsonFilePath ) + "/" + path.basename(
                        jsonFilePath , extension
                    ),
                    filePath = tmpFilePath + "." + payload[0].extension

                util.deleteFile( jsonFilePath )
                util.deleteFile( filePath )

                return true
            }

            var getTree = function( req, res, payload, next ) {

                var tmpPath = path.join( root , payload[1] , assetPathPart)


                var result = util.listing( tmpPath, true, req, res, payload, next )

                return result
            }

            var getAll = function( req, res, payload ) {
				var projectName = payload[0].projectName

                return util.getDirFilesAsObjects( path.join( root , projectName , assetPathPart ) )
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
                    name: "destroy",
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
