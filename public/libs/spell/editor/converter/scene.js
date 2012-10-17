define(
	'spell/editor/converter/scene',
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
		 * This function creates a scene in the spell engine format. It requires the scene in the editor format as input.
		 *
		 * @param {Object} scene
		 * @param {Object} config
		 */
		var toEngineFormat = function( scene, config ) {
			var result = _.pick( scene, 'version', 'type', 'systems' )

			result.entities = _.map(
				scene.getEntities,
				function( entityEditorFormat ) {
					return entityConverter.toEngineFormat( entityEditorFormat, config )
				}
			)

			return result
		}

		/**
		 * This function creates a scene in the editor format. It requires the scene in the spell engine format as input.
		 *
		 * @param {Object} scene
		 */
		var toEditorFormat = function( scene ) {
			var result = _.clone( scene )

			result.entities = _.map(
				scene.entities,
				function( entity ) {
					return entityConverter.toEditorFormat( entity )
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
