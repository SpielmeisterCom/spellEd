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


		var parseEntities = function( entites ) {
			var dependencies    = [],
				alreadyExisting = {},
				components      = []

			_.each(
				entites,
				function( entity ) {
					var templateId = entity.entityTemplateId

					if( templateId && !alreadyExisting[ templateId ] ) {
						dependencies.push( createDependencyNode( templateId, 'entity' ) )
						alreadyExisting[ templateId ] = true
					}

					_.each(
						entity.config,
						function( value, key ) {
							components.push( key )
							//TODO: parse cmp config overload for example on assetId
						}
					)

				}
			)

			if( components.length > 0 ) {
				var anonymous = createDependencyNode( 'Anonymous', 'entity' )
				anonymous.children = _.map(
					_.uniq( components ),
					function( componentId ) {
						//TODO: same cmp with different config should be detected and maybe create some children also
						return createDependencyNode( componentId, 'component' )
					}
				)

				dependencies.push( anonymous )
			}

			return _.uniq( dependencies )
		}

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

			return _.uniq( dependencies.concat( parseEntities( scene.entities ) ) )
		}
	}
)
