define(
	'spell/editor/converter/component',
	[
		'underscore'
	],
	function(
		_
	) {
		'use strict'


		/**
		 * Transforms the supplied component template from the editor format to the spell engine format.
		 *
		 * @param {Object} component
		 * @return {*}
		 */
		var toEngineFormat = function( component ) {
			var componentResult = _.pick( component , 'name','namespace','type','title','doc','icon','subtype' )

			componentResult.attributes = _.map(
				component.getAttributes,
				function( attribute ) {
					return _.pick( attribute, 'name','type','default')
				}
			)

			return componentResult
		}

		return {
			toEngineFormat : toEngineFormat
		}
	}
)
