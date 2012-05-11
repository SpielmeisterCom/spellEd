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

        var util = undefined

        /**
         *  Project Actions
         */

        var createProject = function( req, res, payload, next ) {
            var projectName = payload[0].name,
                projectDir  = '/projects/' + projectName

            fs.mkdirSync( projectDir, 777 )

            var project = {
                name: projectName,
                root: projectDir
            }

            return project
        }

        var readProject = function( req, res, payload, next ) {
            var tmpPath = util.getPath( payload[0].id + "/config.json" )

            return util.readFile( tmpPath )
        }

        var updateProject = function( req, res, payload, next ) {
            return "errol"
        }

        var deleteProject = function( req, res, payload, next ) {
            return "errol"
        }


        return function( root ) {

            util = createUtil( root )

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
