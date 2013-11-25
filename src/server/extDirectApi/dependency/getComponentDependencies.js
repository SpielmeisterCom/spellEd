define(
	'server/extDirectApi/dependency/getComponentDependencies',
	[
		'server/extDirectApi/dependency/createDependencyNode',

		'underscore'
	],
	function(
		createDependencyNode,

		_
	) {
		'use strict'

		return function( component ) {
			var dependencies = []

			_.each(
				component.attributes,
				function( attribute ) {
					//TODO: parse template correctly and check vor assetIds etc.
					if( attribute.type === 'assetId' ){
						dependencies.push( createDependencyNode( attribute.default, 'asset' ) )
					}
				}
			)

			return dependencies
		}
	}
)
