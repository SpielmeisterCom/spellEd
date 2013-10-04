define(
	'spell/editor/converter/project',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'

		var initConfig = function( project ) {
			if( !_.has( project, 'config' ) ) {
				project.config = {}
			}
		}

		/**
		 * This function creates a project in the spell engine format. It requires the project in the editor format as input.
		 *
		 * @param {Object} project
		 */
		var toEngineFormat = function( project ) {
			var result = _.pick( project, 'version', 'config', 'startScene', 'type', 'apiVersion' )

			result.scenes = _.map(
				project.getScenes,
				function( scene ) {
					return ( !scene.namespace ) ? scene.name : scene.namespace + "." + scene.name
				}
			)

			initConfig( result )

			result.config.supportedLanguages = _.map(
				project.getSupportedLanguages,
				function( language ) {
					return language.id
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
			var result = _.pick( project, 'config', 'name', 'startScene', 'id', 'type', 'scenes', 'apiVersion' )

			initConfig( result )

			result.supportedLanguages = project.config.supportedLanguages

			return result
		}

		return {
			toEngineFormat : toEngineFormat,
			toEditorFormat : toEditorFormat
		}
	}
)
