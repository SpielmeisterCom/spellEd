'use strict';

(function() {

    var listing = function ( req, res, payload, next ) {

        var fs = require('fs')
            , utils = require('util')
            , path = require('path')
            , normalize = path.normalize
            , join = path.join;

        var requestedPath = payload[0].node

        var root = '../'
        var root = normalize(root);

        var dir   = decodeURIComponent( requestedPath )
        , path  = normalize(
            ( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
        )


        // null byte(s), bad request
        if (~path.indexOf('\0')) return next(utils.error(400));

        // malicious path, forbidden
        if (0 != path.indexOf(root)) return next(utils.error(403));

        // check if we have a directory
        var stat = fs.statSync( path )

        if (!stat.isDirectory()) return next();

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
            , utils = require('util')
            , path = require('path')
            , pathExistsSync = path.existsSync
            , normalize = path.normalize
            , join = path.join;

        var requestedPath = payload[0].id

        var root = '../'
        var root = normalize(root);

        var dir   = decodeURIComponent( requestedPath )
        , path  = normalize(
            ( 0 != requestedPath.indexOf(root) ? join(root, dir) : dir )
        )


        // null byte(s), bad request
        if (~path.indexOf('\0')) return next(utils.error(400));

        // malicious path, forbidden
        if (0 != path.indexOf(root)) return next(utils.error(403));

        if( !pathExistsSync( path ) ) return {}
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

    exports.API = {
        ZonesActions: [
            {
                name: "getListing",
                len: 1,
                func: listing
            },
            {
                name: "read",
                len: 1,
                func: getZone
            }
        ]
    }
})();
