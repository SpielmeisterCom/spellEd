define(
	'spell/editor/converter/project',
	[
		'spell/editor/converter/entity',

		'underscore'
	],
	function(
		entityConverter,

		_
	) {
		'use strict'


		/**
		 * This function creates a project in the spell engine format. It requires the project in the editor format as input.
		 *
		 * @param {Object} project
		 * @param {Object} config
		 */
		var toEngineFormat = function( project, config ) {
			var result = _.pick( project, 'config', 'name', 'startScene', 'scenes', 'assetIds', 'templateIds' )

			result.scenes = _.map(
				project.getScenes,
				function( sceneEditorFormat ) {
					var scene = _.pick( sceneEditorFormat, 'name', 'scriptId', 'systems' )

					scene.entities = _.map(
						sceneEditorFormat.getEntities,
						function( entityEditorFormat ) {
							return entityConverter.toEngineFormat( entityEditorFormat, config )
						}
					)

					return scene
				}
			)

			return result
		}

		/**
		 * This function creates a project in the editor format. It requires the project in the spell engine format as input.
		 *
		 * @param {Object} project
		 */
		var toEditorFormat = function( project ) {
			var result = _.pick( project, 'config', 'name', 'startScene', 'scenes', 'assetIds', 'templateIds', 'id' )

			result.scenes = _.map(
				project.scenes,
				function( sceneEngineFormat ) {
					var scene = _.pick( sceneEngineFormat, 'name', 'scriptId', 'systems' )

					scene.entities = _.map(
						sceneEngineFormat.entities,
						function( entity ) {
							return entityConverter.toEditorFormat( entity )
						}
					)

					return scene
				}
			)

			return result
		}

		return {
			toEngineFormat : toEngineFormat,
			toEditorFormat : toEditorFormat
		}
	}
)
