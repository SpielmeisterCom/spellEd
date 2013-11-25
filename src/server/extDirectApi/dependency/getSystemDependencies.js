define(
	'server/extDirectApi/dependency/getSystemDependencies',
	[
		'server/extDirectApi/dependency/createDependencyNode',

		'underscore'
	],
	function(
		createDependencyNode,

		_
	) {
		'use strict'

		return function( system ) {
			var dependencies = []

			_.each(
				system.input,
				function( input ) {
					dependencies.push( createDependencyNode( input.componentId, 'component' ) )
				}
			)

			return dependencies
		}
	}
)
