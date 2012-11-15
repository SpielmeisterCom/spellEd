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
			var componentResult = _.pick( component , 'version','type','title','doc','icon' )

			componentResult.attributes = _.map(
				component.getAttributes,
				function( attribute ) {
					var content = _.pick( attribute, 'name','default', 'engineInternal' )

					if( ( _.has( attribute, 'values' ) && attribute.values.length > 0 ) ) {
						//TODO: is this the right place to do the split?
						var values = ( _.isString( attribute.values ) ) ? attribute.values.split(',') : attribute.values

						content.type = { name: attribute.type, values: values }
					} else {
						content.type = attribute.type
					}

					return content
				}
			)

			return componentResult
		}

		/**
		 * Transforms the supplied component template from the spell component format to the editor format.
		 *
		 * @param component
		 * @return {*}
		 */
		var toEditorFormat = function( component ) {
			var result = _.clone( component )

			result.attributes = _.reduce(
				component.attributes,
				function( memo, attributeConfig ) {
					var content = _.pick( attributeConfig, 'name', 'type', 'default', 'engineInternal' )

					if ( _.isObject( attributeConfig.type ) ) {
						content.type   = attributeConfig.type.name
						content.values = attributeConfig.type.values
					}

					return memo.concat( content )
				},
				[]
			)
			return result
		}

		return {
			toEngineFormat : toEngineFormat,
			toEditorFormat : toEditorFormat
		}
	}
)
