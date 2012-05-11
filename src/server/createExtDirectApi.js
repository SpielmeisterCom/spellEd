define(
    'server/createExtDirectApi',
    [
        'path',
        'fs',

        'underscore'

    ],
    function(
        path,
        fs,

        _
    ) {
        'use strict'

        var root = 'data/'
        var blueprintsPath = 'data/blueprints/'

        /**
         *
         * Main functions
         *
         */

        var getPath = function( requestedPath ) {
            var normalize = path.normalize,
                join = path.join,
                pathExistsSync = path.existsSync

            var dir = decodeURIComponent( requestedPath),
                filePath  = normalize(
                    ( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
                )

            // null byte(s), bad request
            if (~filePath.indexOf('\0') || 0 != filePath.indexOf(root) || !pathExistsSync( filePath ))
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

            var tmpPath = getPath( ( payload[0] === "root" ? rootPath : payload[0] ) )
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

                    }else {
                        if( withFileType === true ) {
                            var fileContent = fs.readFileSync( filePath, 'utf8' )
                            var object = JSON.parse(fileContent)

                            fileInfo.cls  = object.type
                            fileInfo.text = object.name

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

                    if( !fileStat.isDirectory() ) {
                        var fileContent = fs.readFileSync( filePath, 'utf8' )
                        var object = JSON.parse(fileContent)

                        object.id = filePath
                        result.push( object )
                    } else {
                        result = result.concat( getDirFilesAsObjects( filePath ) )
                    }
                })

            return result;
        }

        var writeFile = function ( path, data ) {
            var tmpPath = getPath( path )

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

        /**
         *
         * ExtDirectFunctions
         *
         */

        var listBlueprints = function( req, res, payload, next ) {
            var rootPath = blueprintsPath
            return listing( rootPath, true, req, res, payload, next )
        }

        var getAllEntityBlueprints = function( req, res, payload, next ) {
            var tmpPath = getPath( root + "blueprints/spell/entity/" )
            if ( !tmpPath ) return next()

            // check if we have a directory
            var stat = fs.statSync( tmpPath )

            if (!stat.isDirectory()) return next()

            return getDirFilesAsObjects( tmpPath )
        }

        var getAllComponentBlueprints = function( req, res, payload, next ) {
            var tmpPath = getPath( root + "blueprints/spell/component/" )
            if ( !path ) return next()

            // check if we have a directory
            var stat = fs.statSync( tmpPath )

            if (!stat.isDirectory()) return next()

            return getDirFilesAsObjects( tmpPath )
        }

        /**
         *  Component Blueprints Actions
         */

        var readComponentBlueprint = function( req, res, payload, next ) {
            var tmpPath = getPath(  payload[0].id )

            return readFile( tmpPath )
        }

        var updateComponentBlueprint = function( req, res, payload, next ) {
            var component = payload[ 0 ],
                tmpPath      = component.id

            var result = _.pick( component, 'name', 'namespace', 'type')

            var attributes = []
            _.each(
                component.getAttributes,
                function( attribute ) {
                    attributes.push(
                        _.pick( attribute, 'name', 'type', 'default' )
                    )
                }
            )

            result.attributes = attributes

            writeFile( tmpPath, JSON.stringify( result, null, "\t" ) )

            return result
        }

        var deleteComponentBlueprint = function( req, res, payload, next ) {
            return "errol"
        }

        var createComponentBlueprint = function( req, res, payload, next ) {
            return "errol"
        }

        /**
         *  Entity Blueprints Actions
         */

        var readEntityBlueprint = function( req, res, payload, next ) {
            var tmpPath = getPath(  payload[0].id )

            return readFile( tmpPath )
        }

        var updateEntityBlueprint = function( req, res, payload, next ) {
            var entity = payload[ 0 ],
                tmpPath      = entity.id

            var result = _.pick( entity, 'name', 'namespace', 'type')

            var components = []
            _.each(
                entity.getComponents,
                function( component ) {
                    components.push(
                        _.pick( component, 'blueprintId', 'config' )
                    )
                }
            )

            result.components = components

            writeFile( path, JSON.stringify( result, null, "\t" ) )

            return result
        }

        var deleteEntityBlueprint = function( req, res, payload, next ) {
            return "errol"
        }

        var createEntityBlueprint = function( req, res, payload, next ) {
            return "errol"
        }

        /**
         *  Project Actions
         */

        var createProject = function( req, res, payload, next ) {
            var projectName = payload[0].name,
                projectDir  = root + '/projects/' + projectName

            fs.mkdirSync( projectDir, 777 )

            var project = {
                name: projectName,
                root: projectDir
            }

            return project
        }

        var readProject = function( req, res, payload, next ) {
            var tmpPath = getPath(  root + payload[0].id + "/config.json" )

            return readFile( tmpPath )
        }

        var updateProject = function( req, res, payload, next ) {
            return "errol"
        }

        var deleteProject = function( req, res, payload, next ) {
            return "errol"
        }

        return function(){
            return {
                ProjectActions: [
                    {
                        name: "create",
                        len: 1,
                        func: createProject
                    },
                    {
                        name: "read",
                        len: 1,
                        func: readProject
                    },
                    {
                        name: "update",
                        len: 1,
                        func: updateProject
                    },
                    {
                        name: "delete",
                        len: 1,
                        func: deleteProject
                    }
                ],
                ComponentBlueprintActions: [
                    {
                        name: "getAll",
                        len: 0,
                        func: getAllComponentBlueprints
                    },
                    {
                        name: "read",
                        len: 1,
                        func: readComponentBlueprint
                    },
                    {
                        name: "create",
                        len: 1,
                        func: createComponentBlueprint
                    },
                    {
                        name: "update",
                        len: 1,
                        func: updateComponentBlueprint
                    },
                    {
                        name: "delete",
                        len: 1,
                        func: deleteComponentBlueprint
                    }
                ],
                BlueprintsActions: [
                    {
                        name: "getTree",
                        len: 1,
                        func: listBlueprints
                    }
                ],
                EntityBlueprintActions: [
                    {
                        name: "getAll",
                        len: 0,
                        func: getAllEntityBlueprints
                    },
                    {
                        name: "read",
                        len: 1,
                        func: readEntityBlueprint
                    },
                    {
                        name: "create",
                        len: 1,
                        func: createEntityBlueprint
                    },
                    {
                        name: "update",
                        len: 1,
                        func: updateEntityBlueprint
                    },
                    {
                        name: "delete",
                        len: 1,
                        func: deleteEntityBlueprint
                    }
                ]
            }
        }
    }
)
