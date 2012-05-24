define(
    'server/extDirectApi/blueprints/createComponentApi',
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

            var util = createUtil( root )

            /**
             *  Component Blueprints Actions
             */

            var readComponentBlueprint = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updateComponentBlueprint = function( req, res, payload, next ) {
                var component = payload[ 0 ],
                    tmpPath   = component.id

                var result = _.pick( component, 'name', 'namespace', 'type')

                var attributes = []
                _.each(
                    component.getAttributes,
                    function( attribute ) {
                        attributes.push(
                            _.pick( attribute, 'name', 'type', 'default' )
                        )
                    }
                )

                result.attributes = attributes

                util.writeFile( tmpPath, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deleteComponentBlueprint = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id

                util.deleteFile( jsonFilePath )

                return true
            }

            var createComponentBlueprint = function( req, res, payload, next ) {
                var name        = payload.name,
                    extension   = ".json",
                    folder      = ( payload.namespace === "root" ) ? root + payload.projectName + blueprintPathPart : payload.namespace,
                    filePath    = folder + "/"+ name + extension,
                    type        = payload.type

                var namespace = util.extractNamespaceFromPath( folder, blueprintPathPart )

                var component = {
                    type : type,
                    namespace : namespace,
                    name : name,
                    attributes : [
                    ]
                }

                util.writeFile( filePath , JSON.stringify( component, null, "\t" ), false )

                return {
                    success: true,
                    data: component
                }
            }

            return [
                {
                    name: "read",
                    len: 1,
                    func: readComponentBlueprint
                },
                {
                    name: "create",
                    len: 1,
                    func: createComponentBlueprint
                },
                {
                    name: "update",
                    len: 1,
                    func: updateComponentBlueprint
                },
                {
                    name: "delete",
                    len: 1,
                    func: deleteComponentBlueprint
                }
            ]
        }
    }
)
