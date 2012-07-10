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

			var getAssetConfigFromPayload = function( payload ) {
				var result = _.pick( payload, 'name', 'type' ),
					folder      = getFolder( payload),
					namespace   = ( _.has( payload, 'namespace') ) ? payload.namespace : util.extractNamespaceFromPath( folder, assetPathPart ),
					configObject = ( _.has( payload, 'config' ) ) ? payload.config : payload

				result.namespace = namespace
				result.doc       = ""

				if( result.type === 'spriteSheet' ) {
					result.config = _.pick( configObject, 'textureWidth', 'textureHeight', 'frameWidth', 'frameHeight')
				} else {
					if(  result.type === 'animation' ) {
						result.config          = _.pick( configObject, 'duration' )
						result.config.looped   = !!configObject.looped
						result.config.type     = configObject.animationType
						result.config.frameIds = configObject.frameIds.split(",")
						result.assetId         = configObject.assetId
					}
				}

				return result
			}

			var getFolder = function( payload ) {
				return ( payload.folder === "root" ) ? path.join( root , payload.projectName , assetPathPart ) : payload.folder
			}

            var createAsset = function( req, res, payload, next ) {

                var assetName   = payload.name,
                    folder      = getFolder( payload ),
                    files       = payload.files,
					namespace   = util.extractNamespaceFromPath( folder, assetPathPart ),
				    newFileNameWithoutExtension = folder + "/" + assetName,
					Asset       = _.first( files )

                var result = getAssetConfigFromPayload( payload )

				if( Asset.file.size > 0 ) {
					var extension = mime.extension( Asset.file.type),
						baseName  = assetName +"." + extension,
						filePath  = newFileNameWithoutExtension + "." + extension,
						assetId   = ( namespace.length > 0 ) ? namespace + "/" + baseName : baseName

					fs.renameSync( Asset.file.path, filePath )
					result.file = assetId
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
				var asset     = payload[ 0 ]

				var result = getAssetConfigFromPayload( asset )

				if( !!asset.file )
					result.file = asset.file

				util.writeFile( asset.id, JSON.stringify( result, null, "\t" ) )

				return asset
            }

            var deleteAsset = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id,
					file         = payload[0].file,
					filePath     = path.dirname( jsonFilePath ) + "/" + path.basename( file )

				util.deleteFile( jsonFilePath )

				if( !!file )
                	util.deleteFile( filePath )

                return true
            }

            var getTree = function( req, res, payload, next ) {

                var tmpPath = path.join( root , payload[1] , assetPathPart)


                var result = util.jsonListing( tmpPath, true, req, res, payload, next )

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
