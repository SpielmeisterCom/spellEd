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

        return function( rootPath ){

            var root = rootPath

			var entityParsing = function( entity ) {
				var entityResult = _.pick( entity, 'name' )

				if( _.has( entity, 'templateId' ) &&
					!!entity.templateId ) {

					entityResult.templateId = entity.templateId
				}

				entityResult.components = _.reduce(
					entity.getComponents,
					function( memo, component ) {
						if( !component.additional && ( !component.changed || _.size( component.config ) === 0 )) return memo

						return memo.concat( _.pick( component, 'templateId', 'config' ) )
					},
					[]
				)

				entityResult.children = _.reduce(
					entity.getChildren,
					function( memo, entityChildren ) {
						var result = entityParsing( entityChildren )

						if( !_.has( result , "components") && !_.has( result, "children" ) ) return memo

						return memo.concat( result )
					},
					[]
				)

				if( _.isEmpty(entityResult.components) ) delete entityResult.components
				if( _.isEmpty(entityResult.children) ) delete entityResult.children
				//delete templateId on anonymous entities
				if( _.isEmpty(entityResult.templateId) ) delete entityResult.templateId

				return entityResult
			}

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
                    filePath.indexOf( prefix ) + prefix.length + 1
                )
            }

			var namespaceToFilePath = function( namespace ) {
				var tmp = ( !_.isString( namespace ) ) ? namespace.toString() : namespace
				if( namespace === "root" ) return ""
				return tmp.replace( /\./g, ",")
			}

            /**
             *
             * Main functions
             *
             */
            var getPath = function( requestedPath, checkIfExists ) {
                var normalize = path.normalize,
                    join = path.join,
                    pathExistsSync = path.existsSync,
                    checkIfExists = ( checkIfExists !== undefined ) ? checkIfExists : true

                if( !requestedPath ) return false

                var dir = decodeURIComponent( requestedPath),
                    filePath  = normalize(
                        ( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
                    )

                // null byte(s), bad request
                if ( ~filePath.indexOf('\0') || 0 != filePath.indexOf(root) || ( checkIfExists && !pathExistsSync( filePath ) ) )
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
                var normalize = path.normalize


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
                var files = glob.sync( "{"+tmpPath + "/**/*.json," + tmpPath + "/**/*.js}" )

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
                        var filePath = normalize( file )

                        var fileInfo = {
                            text: file,
                            id: filePath

                        }

						if( withFileType === true && path.extname( filePath ) === ".json" ) {
							var fileContent = fs.readFileSync( filePath, 'utf8' )
							var object = JSON.parse(fileContent)

							fileInfo.cls  = object.type
							fileInfo.text = object.name

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

						} else {
							fileInfo.cls = "file"
						}

						fileInfo.leaf = true
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
                            var object = JSON.parse(fileContent)

                            object.id = filePath
                            result.push( object )
                        } else if( fileStat.isDirectory() ) {
                            result = result.concat( getDirFilesAsObjects( filePath ) )
                        }
                    }
                )

                return result;
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


            return {
				entityParsing: entityParsing,
                getPath   : getPath,
                extractNamespaceFromPath: extractNamespaceFromPath,
				convertNamespaceToFilePath: namespaceToFilePath,
                readFile  : readFile,
                writeFile : writeFile,
                getDirFilesAsObjects : getDirFilesAsObjects,
				jsonListing: jsonListing,
                fileListing : fileListing,
                deleteFile: deleteFile
            }
        }
    }
)
