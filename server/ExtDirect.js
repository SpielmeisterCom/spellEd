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

    var listing = function ( req, res, payload, next ) {

        var fs = require('fs')
        , path = require('path')
        , normalize = path.normalize
        , join = path.join

        var path = getPath( payload[0].node )
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

    var getZone = function( req, res, payload, next ) {
        var fs = require('fs')

        var path = getPath( payload[0].id )
        if ( !path ) return {}

        var stat = fs.statSync( path )
        if ( stat.isDirectory() ) return {}

        var fileContent = fs.readFileSync( path, 'utf8' )

        var file = {
            name: path,
            path: path,
            content: JSON.parse( fileContent )
        }

        return file
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
//        ZonesActions: [
//            {
//                name: "getListing",
//                len: 1,
//                func: listing
//            },
//            {
//                name: "read",
//                len: 1,
//                func: getZone
//            }
//        ],
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
        ]
    }
})();
