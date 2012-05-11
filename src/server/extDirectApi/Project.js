define(
    'server/extDirectApi/Project',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',

        'underscore'

    ],
    function(
        path,
        fs,
        createUtil,

        _
    ) {
        'use strict'

        return function( root ) {

            var util = createUtil( root )

            var createProject = function( req, res, payload, next ) {
                var projectName = payload[0],
                    projectDir  = util.getPath( projectName, false )


                if( path.existsSync( projectDir ) === false ) {
                    fs.mkdirSync( projectDir, "0755" )

                    //TODO: remove after with spelljs-extdirect
                    var configFilePath = projectDir + "/config.json"
                    var project = {
                        "id": projectDir,
                        "name" : projectName,
                        "configFilePath" : projectDir + "/config.json",
                        "startZone": "Zone1",
                        "zones": [
                            {
                                "name": "Zone1",
                                "entities": []
                            }
                        ]
                    }

                    fs.writeFileSync(
                        configFilePath,
                        JSON.stringify( project, null, '\t' )
                    )
                    //
                    return projectDir
                } else {
                    return false
                }
            }

            var readProject = function( req, res, payload, next ) {
                var tmpPath = util.getPath( payload[0].id )

                return util.readFile( tmpPath )
            }

            var updateProject = function( req, res, payload, next ) {
                return "errol"
            }

            var deleteProject = function( req, res, payload, next ) {
                return "errol"
            }

            return [
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
    }
)
