define(
	'server/extDirectApi/dependency/getSceneDependencies',
	[
		'server/extDirectApi/dependency/createDependencyNode',

		'underscore'
	],
	function(
		createDependencyNode,

		_
	) {
		'use strict'

		return function( scene ) {
			var dependencies = []

			_.each(
				scene.systems,
				function( value ) {
					_.each(
						value,
						function( system ) {
							dependencies.push( createDependencyNode( system.id, 'system' ) )
						}
					)
				}
			)

			_.each(
				scene.entities,
				function( element ) {

				}
			)

			return dependencies
		}
	}
)
