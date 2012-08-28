define(
	'server/extDirectApi/templates/createEntityApi',
	[
		'path',
		'fs',
		'server/extDirectApi/createUtil',
		'server/extDirectApi/templates/entityTemplateFormatter',

		'underscore'

	],
	function(
		path,
		fs,
		createUtil,
		entityTemplateFormatter,

		_
	) {
		'use strict'


		return function( root ) {
			var templatePathPart = "/library/templates",
				util = createUtil( root )

			var readEntityTemplate = function( req, res, payload, next ) {
				return entityTemplateFormatter.toEditorFormat(
					util.readFile( payload[ 0 ].id )
				)
			}

			var updateEntityTemplate = function( req, res, payload, next ) {
				var entity = payload[ 0 ],
					result = entityTemplateFormatter.toEngineFormat( entity, true )

				util.writeFile( entity.id, JSON.stringify( result, null, "\t" ) )

				return entity
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
                    type        = payload.type,
					namespace = payload.namespace

                var entity = {
                    type      : type,
                    namespace : namespace,
                    name      : name,
                    config    : {},
					children  : []
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
