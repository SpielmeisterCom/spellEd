define(
    'server/extDirectApi/ProjectApi',
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

            var getConfigFilePath = function ( projectsDir ) {
                return projectsDir + "/project.json"
            }

            var util = createUtil( root )

            var createProject = function( req, res, payload, next ) {
                var projectName = payload[0],
                    projectDir  = util.getPath( projectName, false )


                if( path.existsSync( projectDir ) === false ) {
                    fs.mkdirSync( projectDir, "0755" )

                    return projectDir
                } else {
                    return false
                }
            }

            var getAll = function( req, res, payload, next ) {

                var files = fs.readdirSync( root )
                files.sort()

                var result = []

                _.each(
                    files,
                    function( projectDir ) {
                        var projectFilePath = util.getPath( projectDir )

                        var fileStat = fs.statSync( projectFilePath )

                        if( fileStat.isDirectory() ) {

                            var fileContent = fs.readFileSync( getConfigFilePath( projectFilePath ) , 'utf8' )
                            var object = JSON.parse( fileContent )

                            object.name = projectDir
                            result.push( object )
                        }
                    }
                )

                return result
            }

            var readProject = function( req, res, payload, next ) {
                var tmpPath = util.getPath( payload[0].id )
                return util.readFile( getConfigFilePath(tmpPath) )
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
                },
                {
                    name: 'getAll',
                    len: 0,
                    func: getAll
                }
            ]
        }
    }
)
