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
		var toEngineFormat = function( system, config ) {
			var attributes       = [ 'version', 'type' ],
				includeNamespace = config && !!config.includeNamespace

			if( includeNamespace ) attributes = _.union( attributes, [ 'name', 'namespace' ] )

			var result = _.pick( system, attributes )

			result.input = _.map(
				system.getInput,
				function( input ) {
					return _.pick( input, 'name','componentId')
				}
			)

			result.config = _.map(
				system.getConfig,
				function( input ) {
					return _.pick( input, 'name','type', 'default', 'doc' )
				}
			)

			return result
		}

		return {
			toEngineFormat : toEngineFormat
		}
	}
)
