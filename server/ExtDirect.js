'use strict';

(function() {

    var root = '../data/'

    var getPath = function( requestedPath ) {
        var path = require('path')
        , pathExistsSync = path.existsSync
        , normalize = path.normalize
        , join = path.join

        var dir = decodeURIComponent( requestedPath )
            , path  = normalize(
            ( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
        )

        // null byte(s), bad request
        if (~path.indexOf('\0') || 0 != path.indexOf(root) || !pathExistsSync( path ))
            return false
        else
            return path
    }

    var listing = function ( rootPath, req, res, payload, next ) {

        var fs = require('fs')
        , path = require('path')
        , normalize = path.normalize
        , join = path.join

        var path = getPath( ( payload[0] === "root" ? rootPath : payload[0] ) )
        if ( !path ) return next()

        // check if we have a directory
        var stat = fs.statSync( path )

        if (!stat.isDirectory()) return next()

        // fetch files
        var files = fs.readdirSync(path)
        files.sort();

        var result = []

        for( var key in files) {
            var filePath = normalize(join( path, files[key]))

            var fileStat = fs.statSync( filePath )

            var fileInfo = {
                text: files[key],
                id: filePath

            }

            if( fileStat.isDirectory() ) {
                fileInfo.cls = "folder"

            }else {
                fileInfo.cls = "file"
                fileInfo.leaf = true
            }

            result.push( fileInfo )
        }

        return result;
    }

    var listComponentBlueprints = function( req, res, payload, next ) {
        var rootPath = "/blueprints/components/"
        return listing( rootPath, req, res, payload, next )
    }

    var getAllEntityBlueprints = function( req, res, payload, next ) {
        var fs = require('fs')

        var path = getPath( root + "blueprints/entities/" )
        if ( !path ) return next()

        // check if we have a directory
        var stat = fs.statSync( path )

        if (!stat.isDirectory()) return next()

        return getDirFilesAsObjects( path )
    }

    var getAllComponentBlueprints = function( req, res, payload, next ) {
        var fs = require('fs')

        var path = getPath( root + "blueprints/components/" )
        if ( !path ) return next()

        // check if we have a directory
        var stat = fs.statSync( path )

        if (!stat.isDirectory()) return next()

        return getDirFilesAsObjects( path )
    }

    var getDirFilesAsObjects = function( readPath ) {
        var fs = require('fs')
            , path = require('path')
            , normalize = path.normalize
            , join = path.join

        var files = fs.readdirSync( readPath )
        files.sort();

        var result = []

        for( var key in files) {
            var filePath = normalize(join( readPath, files[key]))

            var fileStat = fs.statSync( filePath )

            if( !fileStat.isDirectory() ) {
                var fileContent = fs.readFileSync( filePath, 'utf8' )
                var object = JSON.parse(fileContent)

                object.id = filePath
                result.push( object )
            } else {
                result = result.concat( getDirFilesAsObjects( filePath ) )
            }
        }

        return result;
    }

    var listEntityBlueprints = function( req, res, payload, next ) {
        var rootPath = "/blueprints/entities/"
        return listing( rootPath, req, res, payload, next )
    }

    var readComponentBlueprint = function( req, res, payload, next ) {
        var fs = require('fs')

        var path = getPath(  payload[0].id )

        if ( !path ) return {}

        var stat = fs.statSync( path )
        if ( stat.isDirectory() ) return {}

        var fileContent = fs.readFileSync( path, 'utf8' )

        return JSON.parse(fileContent)
    }

    var createProject = function( req, res, payload, next ) {
        var fs = require('fs')

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
        var fs = require('fs')

        var path = getPath(  root + payload[0].id + "/config.json" )

        if ( !path ) return {}

        var stat = fs.statSync( path )
        if ( stat.isDirectory() ) return {}

        var fileContent = fs.readFileSync( path, 'utf8' )

        return JSON.parse(fileContent)
    }

    var updateProject = function( req, res, payload, next ) {
        return "errol"
    }

    var deleteProject = function( req, res, payload, next ) {
        return "errol"
    }

    exports.API = {
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
                name: "getTree",
                len: 1,
                func: listComponentBlueprints
            },
            {
                name: "getAll",
                len: 1,
                func: getAllComponentBlueprints
            },
            {
                name: "read",
                len: 1,
                func: readComponentBlueprint
            },
//            {
//                name: "create",
//                len: 1,
//                func: createComponentBlueprint
//            },
//            {
//                name: "update",
//                len: 1,
//                func: updateComponentBlueprint
//            },
//            {
//                name: "delete",
//                len: 1,
//                func: deleteComponentBlueprint
//            }
        ],
        EntityBlueprintActions: [
            {
                name: "getTree",
                len: 1,
                func: listEntityBlueprints
            },
            {
                name: "getAll",
                len: 1,
                func: getAllEntityBlueprints
            }
//            ,
//            {
//                name: "create",
//                len: 1,
//                func: createEntityBlueprint
//            },
//            {
//                name: "read",
//                len: 1,
//                func: readEntityBlueprint
//            },
//            {
//                name: "update",
//                len: 1,
//                func: updateEntityBlueprint
//            },
//            {
//                name: "delete",
//                len: 1,
//                func: deleteEntityBlueprint
//            }
       ]
    }
})();
