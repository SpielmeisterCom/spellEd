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
                    type        = payload.type,
					namespace   = util.extractNamespaceFromPath( folder, assetPathPart ),
				    newFileNameWithoutExtension = folder + "/" + assetName,
					Asset       = _.first( files )

                var result = _.pick( payload, 'name', 'type', 'config', 'assetId')
				result.namespace = namespace
				result.doc       = ""

				if( Asset.file.size > 0 ) {
					var extension = mime.extension( Asset.file.type),
						baseName  = assetName +"." + extension,
						filePath  = newFileNameWithoutExtension + "." + extension,
						assetId   = ( namespace.length > 0 ) ? namespace + "/" + baseName : baseName

					fs.renameSync( Asset.file.path, filePath )
					result.file = assetId
				}

				if( result.type === 'spriteSheet' ) {
					result.config = _.pick( payload, 'textureWidth', 'textureHeight', 'frameWidth', 'frameHeight')
				} else {

					if( result.type === 'animation' ) {
						result.config = _.pick( payload, 'duration', 'looped')
					}
				}

                util.writeFile( newFileNameWithoutExtension + ".json", JSON.stringify( result, null, "\t" ), false )
console.log( result )
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
					file         = payload[0].file,
					filePath     = path.dirname( jsonFilePath ) + "/" + path.basename( file )

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
