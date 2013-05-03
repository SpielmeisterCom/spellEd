define(
	'spell/editor/converter/script',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'


		/**
		 * Transforms the supplied script from the editor format to the spell engine format.
		 *
		 * @param {Object} script
		 * @return {*}
		 */
		var toEngineFormat = function( script ) {
			return _.pick( script, 'version','type', 'dependencies' )
		}

		return {
			toEngineFormat : toEngineFormat
		}
	}
)
