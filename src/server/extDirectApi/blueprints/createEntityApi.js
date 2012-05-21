define(
    'server/extDirectApi/blueprints/createEntityApi',
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
        return function( root, spellBlueprintsRootPath ) {

            //TODO: spellSDK only read access, merge with project blueprints etc.
            root = spellBlueprintsRootPath
            var util      = createUtil( root )

            /**
             *  Entity Blueprints Actions
             */

            var readEntityBlueprint = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updateEntityBlueprint = function( req, res, payload, next ) {
                var entity = payload[ 0 ]

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

                util.writeFile( entity.id, JSON.stringify( result, null, "\t" ) )

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
