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

            var readEntityTemplate = function( req, res, payload, next ) {
                return util.readFile( payload[0].id )
            }

			var entityParsing = function( entity, includeEmptyComponents ) {
				includeEmptyComponents = !!includeEmptyComponents

				var result = _.pick( entity, 'name', 'namespace', 'type')

				result.components = _.reduce(
					entity.getComponents,
					function( memo, component ) {
						if( !includeEmptyComponents && _.size( component.config ) === 0 ) return memo

						var tmp = _.pick( component, 'templateId', 'config' )
						if( _.size( tmp.config ) === 0 ) delete tmp.config

						return memo.concat( tmp )
					},
					[]
				)

				result.children = _.reduce(
					entity.getChildren,
					function( memo, entityChildren ) {
						return memo.concat( entityParsing( entityChildren ) )
					},
					[]
				)

				return result
			}

            var updateEntityTemplate = function( req, res, payload, next ) {
                var entity = payload[ 0 ],
					result = entityParsing( entity, true )

                util.writeFile( entity.id, JSON.stringify( result, null, "\t" ) )

                return result
            }

            var deleteEntityTemplate = function( req, res, payload, next ) {
                var jsonFilePath = payload[0].id

                util.deleteFile( jsonFilePath )

                return true
            }

            var createEntityTemplate = function( req, res, payload, next ) {
                var name        = payload.name,
                    extension   = ".json",
                    folder      = path.join( root , payload.projectName , templatePathPart , util.convertNamespaceToFilePath( payload.namespace )),
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
                    func: readEntityTemplate
                },
                {
                    name: "create",
                    len: 1,
                    func: createEntityTemplate
                },
                {
                    name: "update",
                    len: 1,
                    func: updateEntityTemplate
                },
                {
                    name: "destroy",
                    len: 1,
                    func: deleteEntityTemplate
                }
            ]
        }
    }
)
