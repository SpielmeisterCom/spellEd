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

        var projectsRoot        = 'projects/',
			buildServerOptions  = {
				host: 'localhost',
				port: '8080',
				path: '/router/',
				method: 'POST'
			}

        var app = connect()
            .use( connect.favicon() )
            .use( connect.logger('dev') )
            .use(
                extDirect(
                    'router/',
                    'Spelled',
                    createExtDirectApi( projectsRoot, buildServerOptions )
                )
            )
            .use( connect.static('public'))
            //TODO: remove this line
            .use( connect.static( projectsRoot ) )

        http.Server(app).listen(3000);
        console.log('Server started on port 3000');
    }
)

