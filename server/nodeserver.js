var connect   = require('connect'),
    http      = require('http'),
    ExtDirect = require('./ExtDirect')

var app = connect()
    .use( connect.favicon() )
    .use( connect.logger('dev') )
    .use( extDirect )
    .use( connect.static('../') )

function processPayload( req, res, next ) {
    var payload = [];

    if( req.readable === true ) {
        req.on('data', function(data) {
            payload.push(data);
        });

        req.on('end', function() {

            if( payload.length === 0 ) return next()

            var extDirectManager = ExtDirect.createExtDirect( payload )

            extDirectManager.route()
        });

    } else {
        next()
    }
}

function extDirect( req, res, next ) {
    if( req.url === '/router' ) {
        processPayload( req, res, next )

    } else if( req.url === '/api' ) {
        var api = ExtDirect.getApi()
        res.setHeader('Content-Type', 'text/javascript');
        res.end(api);

    } else {
        next()
    }
}


function listing( req, res, next, payload ) {

    var fs = require('fs')
        , parse = require('url').parse
        , utils = require('util')
        , path = require('path')
        , normalize = path.normalize
        , join = path.join;

    var root = 'data'

    // root required
    if (!root) throw new Error('directory() root path required');
    var root = normalize(root);

    var url = parse(req.url)
        , dir = decodeURIComponent(url.pathname)
        , path = normalize(join(root, dir))

    // null byte(s), bad request
    if (~path.indexOf('\0')) return next(utils.error(400));

    // malicious path, forbidden
    if (0 != path.indexOf(root)) return next(utils.error(403));

    // check if we have a directory
    fs.stat(path, function( err, stat ){
        if (err) return 'ENOENT' == err.code
            ? next()
            : next(err);

        if (!stat.isDirectory()) return next();

        // fetch files
        fs.readdir(path, function(err, files){
            if (err) return next(err);
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

            // content-negotiation
            for (var key in exports) {
                exports[key](req, res, result, payload);
                return;
            }

            // not acceptable
            next(utils.error(406));
        });
    })
}

var exports = {
    json: function( req, res, files, payload ){

        var result = {}

        if( !!payload ) {
            result = JSON.parse( payload )
            result.result = files
            result = JSON.stringify( result )

        } else {
            result = JSON.stringify( files )
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', result.length);
        res.end(result);
    }
};

http.Server(app).listen(3000);
console.log('Server started on port 3000');