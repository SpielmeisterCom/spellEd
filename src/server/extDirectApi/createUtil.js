define(
    'server/extDirectApi/createUtil',
    [
        'path',
        'fs',
        'mime',

        'underscore'
    ],
    function(
        path,
        fs,
        mime,

        _
    ) {
        'use strict'

        return function( rootPath ){

            var root = rootPath

            var getExtParams = function( payload ) {
                if( !payload ) {
                    return undefined
                }

                if( _.isArray(payload) ) {
                    return payload
                }

                return payload
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

                if( !requestedPath) return false

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

            var listing = function ( rootPath, withFileType, req, res, payload, next ) {
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

                if ( !tmpPath ) return next()

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return next()

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
                getPath   : getPath,
                readFile  : readFile,
                writeFile : writeFile,
                getDirFilesAsObjects : getDirFilesAsObjects,
                listing : listing,
                deleteFile: deleteFile
            }
        }
    }
)
