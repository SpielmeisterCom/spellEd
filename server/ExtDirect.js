'use strict';

exports.listing = function ( req, res, payload, next ) {

    var fs = require('fs')
        , parse = require('url').parse
        , utils = require('util')
        , path = require('path')
        , normalize = path.normalize
        , join = path.join;

    var root = '../'
    var requestedPath = payload.pop().node

    // root required
    if (!root) throw new Error('directory() root path required');
    var root = normalize(root);

    var url = parse(req.url)
    , dir   = decodeURIComponent( requestedPath )
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