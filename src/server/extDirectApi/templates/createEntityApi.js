define(
    'server/extDirectApi/templates/createEntityApi',
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
            var templatePathPart = "/library/templates"

            var util      = createUtil( root )

            /**
             *  Entity Templates Actions
             */

            var readentityTemplate = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updateentityTemplate = function( req, res, payload, next ) {
                var entity = payload[ 0 ]

                var result = _.pick( entity, 'name', 'namespace', 'type')

                var components = []
                _.each(
                    entity.getComponents,
                    function( component ) {
                        components.push(
                            _.pick( component, 'templateId', 'config' )
                        )
                    }
                )

                result.components = components

                util.writeFile( entity.id, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deleteentityTemplate = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id

                util.deleteFile( jsonFilePath )

                return true
            }

            var createentityTemplate = function( req, res, payload, next ) {
                var name        = payload.name,
                    extension   = ".json",
                    folder      = ( payload.namespace === "root" ) ? path.join( root , payload.projectName , templatePathPart ) : payload.namespace,
                    filePath    = folder + "/"+ name + extension,
                    type        = payload.type

                var namespace = util.extractNamespaceFromPath( folder, templatePathPart )

                var entity = {
                    type : type,
                    namespace : namespace,
                    name : name,
                    components : [
                    ]
                }

                util.writeFile( filePath , JSON.stringify( entity, null, "\t" ), false )

                return {
                    success: true,
                    data: entity
                }
            }


            return [
                {
                    name: "read",
                    len: 1,
                    func: readentityTemplate
                },
                {
                    name: "create",
                    len: 1,
                    func: createentityTemplate
                },
                {
                    name: "update",
                    len: 1,
                    func: updateentityTemplate
                },
                {
                    name: "destroy",
                    len: 1,
                    func: deleteentityTemplate
                }
            ]
        }
    }
)
