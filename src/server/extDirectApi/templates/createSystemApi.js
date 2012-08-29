define(
    'server/extDirectApi/templates/createSystemApi',
    [
        'path',
        'fs',
        'server/extDirectApi/createUtil',
		'amd-helper',

        'underscore'

    ],
    function(
        path,
        fs,
        createUtil,
		amdHelper,

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

                var result = _.pick( system, 'name', 'namespace', 'type' )

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

                return system
            }

            var deleteTemplate = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id,
					jsFilePath     = path.dirname( jsonFilePath ) + "/" + payload[0].name + ".js"

                util.deleteFile( jsonFilePath )
				util.deleteFile( jsFilePath )


                return true
            }

            var createTemplate = function( req, res, payload, next ) {
                var name        = payload.name,
                    templatePath= path.join( root , payload.projectName , templatePathPart ),
					folder	    = ( payload.namespace === "root" ) ? templatePath : path.join( templatePath, util.convertNamespaceToFilePath( payload.namespace )),
                    filePath    = folder + "/"+ name,
                    type        = payload.type,
					namespace   = util.extractNamespaceFromPath( folder, templatePathPart ),
                    id          = ( namespace.length > 0 ) ? namespace + "." + name : name

                var system = {
                    type : type,
                    namespace : namespace,
                    name : name,
                    input : [
                    ]
                }

                util.writeFile( filePath + ".json" , JSON.stringify( system, null, "\t" ), false )
				util.writeFile( filePath + ".js" , amdHelper.createModuleHeader( util.convertNamespaceToFilePath(id) ), false )

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
