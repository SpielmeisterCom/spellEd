define(
	'server/extDirectApi/createUtil',
	[
		'path',
		'fs',
		'mime',
		'glob',

		'underscore'
	],
	function(
		path,
		fs,
		mime,
		glob,

		_
	) {
		'use strict'

		return function( rootPath ) {
			var root = path.normalize( rootPath )

            var getExtParams = function( payload ) {
                if( !payload ) {
                    return undefined
                }

                if( _.isArray(payload) ) {
                    return payload
                }

                return payload
            }

            var extractNamespaceFromPath = function( filePath, prefix ) {
               return filePath.substring(
                    filePath.indexOf( path.normalize(prefix) ) + prefix.length + 1
			   ).replace( /[\/\\]/g, "." )
            }

			var namespaceToFilePath = function( namespace ) {
				var tmp = ( !_.isString( namespace ) ) ? namespace.toString() : namespace
				if( namespace === "root" ) return ""
				return path.normalize( tmp.replace( /\./g, path.sep) )
			}

			//TODO: refactor filelisting for scripts
			var fileListing = function ( rootPath, withFileType, req, res, payload, next ) {
				var normalize = path.normalize,
					join = path.join


				var extParams = getExtParams( payload )

				var tmpPath = getPath(
					(
						!!extParams ?
							payload[0] === "root" ?
								rootPath :
								payload[0]
							: rootPath
						)
				)

				if ( !tmpPath ) return {}

				// check if we have a directory
				var stat = fs.statSync( tmpPath )

				if (!stat.isDirectory()) return {}

				// fetch files
				var files = fs.readdirSync(tmpPath)
				files.sort()

				var result = []

				_.each(
					files,
					function( file ) {
						var filePath = normalize(join( tmpPath, file))

						var fileStat = fs.statSync( filePath )

						var fileInfo = {
							text: file,
							id: filePath

						}

						if( fileStat.isDirectory() ) {
							fileInfo.cls = "folder"

						} else {
							if( withFileType === true && path.extname( filePath ) === ".json" ) {
								var fileContent = fs.readFileSync( filePath, 'utf8' )
								var object = JSON.parse(fileContent)

								fileInfo.cls  = object.type
								fileInfo.text = object.name

							} else if( withFileType === true ) {
								// We read only json files or directories
								return
							} else {
								fileInfo.cls = "file"
							}

							fileInfo.leaf = true
						}

						result.push( fileInfo )
					}
				)

				return result
			}

            var jsonListing = function ( rootPath, withFileType, req, res, payload, next ) {
                var relative  = path.relative,
					cwd       = process.cwd(),
					join      = path.join


                var extParams = getExtParams( payload )

                var tmpPath = getPath(
                    (
                        !!extParams ?
                            payload[0] === "root" ?
                                rootPath :
                                payload[0]
                            : rootPath
                        )
                )

                if ( !tmpPath ) return {}

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return {}

                // fetch files
                var globJsonPath = join( relative( cwd, tmpPath ),"/**/*.json").replace( /\\/g, "/"),
					globJsPath   = join( relative( cwd, tmpPath ),"/**/*.js").replace( /\\/g, "/")

				var files = glob.sync( "{" + globJsonPath + "," + globJsPath +"}" )

				var namespacesResults  = {}
				var result = {
					id: "templates",
					text: "Templates",
					cls: "folder",
					leaf: false,
					children: []
				}

                _.each(
                    files,
                    function( file ) {
                        var filePath = path.resolve( cwd, file )

                        var fileInfo = {
                            text: file,
                            id: filePath,
							leaf: true
                        }

						if( withFileType === true && path.extname( filePath ) === ".json" ) {
							var fileContent = fs.readFileSync( filePath, 'utf8' )
							try{
								var object = JSON.parse(fileContent)

								fileInfo.cls  = object.type
								fileInfo.text = object.name

								if( object.type === "entityTemplate" && _.has( object, 'children') ) {

									var parseChildren = function( node, entity ) {
										if(_.has( entity, 'children' ) ) {
											node.children = []
											_.each( entity.children, function( child ) {
												node.leaf = false
												var newNode = {
													id: node.id + child.name ,
													text: child.name,
													cls: "templateEntityComposite",
													iconCls: "tree-scene-entity-icon",
													leaf: true
												}

												newNode = parseChildren( newNode, child )
												node.children.push( newNode )
											})
										}

										node.iconCls = "tree-scene-entity-icon"

										return node
									}

									fileInfo = parseChildren( fileInfo, object )
								} else if( object.type === "entityTemplate" ) {
									fileInfo.iconCls = "tree-scene-entity-icon"
								} else if( object.type === "componentTemplate" ) {
									fileInfo.iconCls = "tree-component-icon"
								} else if( object.type === "systemTemplate" ) {
									fileInfo.iconCls = "tree-system-icon"
								} else if (object.type === "spriteSheet") {
									fileInfo.iconCls = "tree-asset-spritesheet-icon"
								} else if (object.type === "animation") {
									fileInfo.iconCls = "tree-asset-2danimation-icon"
								} else if (object.type === "appearance") {
									fileInfo.iconCls = "tree-asset-2dstaticappearance-icon"
								} else if(object.type === "font") {
									fileInfo.iconCls = "tree-asset-2dtextappearance-icon"
								} else if(object.type === "sound") {
									fileInfo.iconCls = "tree-asset-sound-icon"
								} else {
									console.error( "Error: Missing treeIcon for " + object.type )
								}

								if( !_.has( namespacesResults, object.namespace ) ){
									namespacesResults[ object.namespace ] = {
										id: object.namespace,
										text: _.last( object.namespace.split(".") ),
										cls: "folder",
										leaf: false,
										children: [ fileInfo ]
									}

								} else {
									namespacesResults[ object.namespace ].children.push( fileInfo )
								}
							} catch( e ) {
								createErrorMsg( "Error: JSON file: '" + file + "' could not been parsed" )
							}

						} else {
							fileInfo.cls = "file"
						}
                    }
                )

				var hasNode = function( node, id ) {
					return _.find( node.children, function( iter ) {
						return ( iter.id === id )
					} )
				}

				_.each(
					namespacesResults,
					function( node, key ) {

						var startingNode = result

						var namespaceParts = key.split( "." )
						var lastPart       = _.last( namespaceParts )
						_.each(
							namespaceParts,
							function( part ) {
								var id = namespaceParts.slice( 0, _.indexOf( namespaceParts, part ) + 1 ).join(".")
								var existingNode = hasNode( startingNode, id )

								if( !!existingNode ) {
									startingNode = existingNode

									if( key === id ) {
										startingNode.children = startingNode.children.concat( node.children )
									}
								} else {

									var newNode = {
										id:  id ,
										text: part,
										cls: "folder",
										leaf: false,
										children: [ ]
									}

									if( part === lastPart ) {

										if( part.length === 0 ){
											startingNode.children = startingNode.children.concat( node.children )
										} else {
											startingNode.children.push( node )
											startingNode = node
										}

									} else {

										startingNode.children.push( newNode )
										startingNode = newNode
									}
								}
							}
						)
					}
				)
				return result
            }

			var getDirFilesAsObjects = function( readPath ) {
				var normalize = path.normalize,
					join = path.join

				var files = fs.readdirSync( readPath )
				files.sort();

                var result = []

				_.each(
					files,
					function( file ) {
						var filePath = normalize(join( readPath, file ))

						var fileStat = fs.statSync( filePath )

						if( path.extname( filePath ) === ".json" ) {
							var fileContent = fs.readFileSync( filePath, 'utf8' )
							try{
								var object = JSON.parse(fileContent)
								object.id = filePath
								result.push( object )
							} catch( e ) {

								createErrorMsg( "Error: Template: '" + file + "' contains syntax errors and could not been loaded" )
							}
						} else if( fileStat.isDirectory() ) {
                            result = result.concat( getDirFilesAsObjects( filePath ) )
						}
					}
				)

                return result;
            }

			/**
			 *
			 * Main functions
			 *
			 */
			var getPath = function( requestedPath, checkIfExists ) {
				var normalize = path.normalize,
					join = path.join,
					pathExistsSync = fs.existsSync,
					checkIfExists = ( checkIfExists !== undefined ) ? checkIfExists : true,
					requestedPath = normalize( requestedPath )

				if( !requestedPath ) return false

				var dir = decodeURIComponent( requestedPath ),
					filePath  = path.resolve( root, normalize(
						( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
					))

				// null byte(s), bad request
				if ( ~filePath.indexOf('\0') || 0 != filePath.indexOf( root ) || ( checkIfExists && !pathExistsSync( filePath ) ) )
					return false
				else
					return filePath
			}

			var readFile = function( filePath ) {
				var filePath = getPath( filePath )

				if ( !filePath ) return {}

				var stat = fs.statSync( filePath )
				if ( stat.isDirectory() ) return {}

				var fileContent = fs.readFileSync( filePath, 'utf8' )

				var object = JSON.parse(fileContent)

				object.id = filePath

				return object
			}

            var writeFile = function ( path, data, checkIfExists ) {
                var tmpPath = getPath( path, checkIfExists )

                if( tmpPath ) {
                    try{
                        fs.writeFileSync(
                            tmpPath,
                            data
                        )
                    }catch (e) {
                        console.log( e )
                    }
                }
            }

            var deleteFile = function( filePath ) {
                var filePath = getPath( filePath )

                if ( !filePath ) return

                var stat = fs.statSync( filePath )
                if ( stat.isDirectory() ) return

                return fs.unlinkSync( filePath )
            }

			var createErrorMsg = function( text ) {
				throw text
			}

            return {
                getPath                    : getPath,
                extractNamespaceFromPath   : extractNamespaceFromPath,
				convertNamespaceToFilePath : namespaceToFilePath,
                readFile                   : readFile,
                writeFile                  : writeFile,
                getDirFilesAsObjects       : getDirFilesAsObjects,
				jsonListing                : jsonListing,
                fileListing                : fileListing,
                deleteFile                 : deleteFile
            }
        }
    }
)
