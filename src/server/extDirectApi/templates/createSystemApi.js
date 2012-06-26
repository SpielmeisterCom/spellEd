define(
    'server/extDirectApi/templates/createSystemApi',
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
             *  System Templates Actions
             */

            var readTemplate = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

            var updateTemplate = function( req, res, payload, next ) {
                var system = payload[ 0 ]

                var result = _.pick( system, 'name', 'namespace', 'type', 'scriptId')

                var inputDefinitions = []
                _.each(
					system.getInput,
                    function( input ) {
                        inputDefinitions.push(
                            _.pick( input, 'name', 'templateId' )
                        )
                    }
                )

                result.input = inputDefinitions

                util.writeFile( system.id, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deleteTemplate = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id

                util.deleteFile( jsonFilePath )

                return true
            }

            var createTemplate = function( req, res, payload, next ) {
                var name        = payload.name,
                    extension   = ".json",
                    folder      = ( payload.namespace === "root" ) ? path.join( root , payload.projectName , templatePathPart ) : payload.namespace,
                    filePath    = folder + "/"+ name + extension,
                    type        = payload.type,
                    scriptId    = payload.scriptId

                var namespace = util.extractNamespaceFromPath( folder, templatePathPart )

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
                    func: readTemplate
                },
                {
                    name: "create",
                    len: 1,
                    func: createTemplate
                },
                {
                    name: "update",
                    len: 1,
                    func: updateTemplate
                },
                {
                    name: "destroy",
                    len: 1,
                    func: deleteTemplate
                }
            ]
        }
    }
)
