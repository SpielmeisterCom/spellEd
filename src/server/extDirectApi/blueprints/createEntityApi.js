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
        return function( root ) {
            var blueprintPathPart = "/library/blueprints"

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
                var jsonFilePath = payload[0].id

                util.deleteFile( jsonFilePath )

                return true
            }

            var createEntityBlueprint = function( req, res, payload, next ) {
                var name        = payload.name,
                    extension   = ".json",
                    folder      = ( payload.namespace === "root" ) ? root + payload.projectName + blueprintPathPart : payload.namespace,
                    filePath    = folder + "/"+ name + extension,
                    type        = payload.type

                var namespace = util.extractNamespaceFromPath( folder, blueprintPathPart )

                var entity = {
                    type : type,
                    namespace : namespace,
                    name : name,
                    components : [
                    ]
                }

                util.writeFile( filePath , JSON.stringify( component, null, "\t" ), false )

                return {
                    success: true,
                    data: entity
                }
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
