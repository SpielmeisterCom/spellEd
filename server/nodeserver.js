var connect   = require('connect'),
    http      = require('http'),
    ExtDirect = require('../lib/extdirect')

var app = connect()
    .use( connect.favicon() )
    .use( connect.logger('dev') )
    .use( extDirect )
    .use( connect.static('../') )

function extDirect( req, res, next ) {
    if( req.url === '/router/' ) {
        ExtDirect.router( req, res, next )

    } else if( req.url === '/api' ) {
        ExtDirect.get_api( req, res )

    } else {
        next()
    }
}

http.Server(app).listen(3000);
console.log('Server started on port 3000');