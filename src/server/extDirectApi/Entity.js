define(
    'server/extDirectApi/Entity',
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

            var getAllEntityBlueprints = function( req, res, payload, next ) {
                var tmpPath = util.getPath( "blueprints/spell/entity/" )
                if ( !tmpPath ) return next()

                // check if we have a directory
                var stat = fs.statSync( tmpPath )

                if (!stat.isDirectory()) return next()

                return util.getDirFilesAsObjects( tmpPath )
            }

            /**
             *  Entity Blueprints Actions
             */

            var readEntityBlueprint = function( req, res, payload, next ) {
                var tmpPath = util.getPath(  payload[0].id )

                return util.readFile( tmpPath )
            }

            var updateEntityBlueprint = function( req, res, payload, next ) {
                var entity = payload[ 0 ],
                    tmpPath      = entity.id

                var result = _.pick( entity, 'name', 'namespace', 'type')

                var components = []
                _.each(
                    entity.getComponents,
                    function( component ) {
                        components.push(
                            _.pick( component, 'blueprintId', 'config' )
                        )
                    }
                )

                result.components = components

                util.writeFile( path, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deleteEntityBlueprint = function( req, res, payload, next ) {
                return "errol"
            }

            var createEntityBlueprint = function( req, res, payload, next ) {
                return "errol"
            }


            return [
                {
                    name: "getAll",
                    len: 0,
                    func: getAllEntityBlueprints
                },
                {
                    name: "read",
                    len: 1,
                    func: readEntityBlueprint
                },
                {
                    name: "create",
                    len: 1,
                    func: createEntityBlueprint
                },
                {
                    name: "update",
                    len: 1,
                    func: updateEntityBlueprint
                },
                {
                    name: "delete",
                    len: 1,
                    func: deleteEntityBlueprint
                }
            ]
        }
    }
)
