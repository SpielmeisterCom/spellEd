define(
	'spell/editor/converter/system',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'


		/**
		 * Transforms the supplied system template from the editor format to the spell engine format.
		 *
		 * @param {Object} system
		 * @return {*}
		 */
		var toEngineFormat = function( system ) {
			var result = _.pick( system , 'version','type' )

			result.input = _.map(
				system.getInput,
				function( input ) {
					return _.pick( input, 'name','templateId')
				}
			)

			return result
		}

		return {
			toEngineFormat : toEngineFormat
		}
	}
)
