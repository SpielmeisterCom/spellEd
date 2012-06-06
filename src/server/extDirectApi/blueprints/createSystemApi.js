define(
    'server/extDirectApi/blueprints/createSystemApi',
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
             *  System Blueprints Actions
             */

            var readBlueprint = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updateBlueprint = function( req, res, payload, next ) {
                var entity = payload[ 0 ]

                var result = _.pick( entity, 'name', 'namespace', 'type', 'scriptId')

                var inputDefinitions = []
                _.each(
                    entity.getInput,
                    function( input ) {
                        inputDefinitions.push(
                            _.pick( input, 'name', 'components' )
                        )
                    }
                )

                result.input = inputDefinitions

                util.writeFile( entity.id, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deleteBlueprint = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id

                util.deleteFile( jsonFilePath )

                return true
            }

            var createBlueprint = function( req, res, payload, next ) {
                var name        = payload.name,
                    extension   = ".json",
                    folder      = ( payload.namespace === "root" ) ? path.join( root , payload.projectName , blueprintPathPart ) : payload.namespace,
                    filePath    = folder + "/"+ name + extension,
                    type        = payload.type,
                    scriptId    = payload.scriptId

                var namespace = util.extractNamespaceFromPath( folder, blueprintPathPart )

                var system = {
                    type : type,
                    namespace : namespace,
                    name : name,
                    input : [
                    ],
                    scriptId : scriptId
                }

                util.writeFile( filePath , JSON.stringify( system, null, "\t" ), false )

                return {
                    success: true,
                    data: system
                }
            }


            return [
                {
                    name: "read",
                    len: 1,
                    func: readBlueprint
                },
                {
                    name: "create",
                    len: 1,
                    func: createBlueprint
                },
                {
                    name: "update",
                    len: 1,
                    func: updateBlueprint
                },
                {
                    name: "destroy",
                    len: 1,
                    func: deleteBlueprint
                }
            ]
        }
    }
)
