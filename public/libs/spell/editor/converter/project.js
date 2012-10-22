define(
	'spell/editor/converter/project',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'


		/**
		 * This function creates a project in the spell engine format. It requires the project in the editor format as input.
		 *
		 * @param {Object} project
		 */
		var toEngineFormat = function( project ) {
			var result = _.pick( project, 'version', 'config', 'startScene', 'libraryIds', 'type' )

			result.scenes = _.map(
				project.getScenes,
				function( scene ) {
					return ( !scene.namespace ) ? scene.name : scene.namespace + "." + scene.name
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
			return _.pick( project, 'config', 'name', 'startScene', 'libraryIds', 'id', 'type', 'scenes')
		}

		return {
			toEngineFormat : toEngineFormat,
			toEditorFormat : toEditorFormat
		}
	}
)
