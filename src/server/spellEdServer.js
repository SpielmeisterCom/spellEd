require( { baseUrl: "src" } )

require(
    [
        'connect',
        'http',
        'connect-extdirect/extDirect',
        'server/createExtDirectApi'
    ],
    function(
        connect,
        http,
        extDirect,
        createExtDirectApi
    ) {
        "use strict"

        var app = connect()
            .use( connect.favicon() )
            .use( connect.logger('dev') )
            .use(
                extDirect(
                    'router/',
                    'Spelled',
                    createExtDirectApi()
                )
            )
            .use( connect.static('public') )
            .use( connect.static('data') )

        http.Server(app).listen(3000);
        console.log('Server started on port 3000');
    }
)

