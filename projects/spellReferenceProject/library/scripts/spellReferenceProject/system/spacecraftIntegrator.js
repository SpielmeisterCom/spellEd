define(
	'spellReferenceProject/system/spacecraftIntegrator',
	[
		'glmatrix/vec2',

		'spell/shared/util/platform/underscore'
	],
	function(
		vec2,

		_
	) {
		'use strict'


		/**
		 * private
		 */

		var positionComponentId   = 'spell.component.core.position',
			rotationComponentId   = 'spell.component.core.rotation',
			actorComponentId      = 'spell.component.core.actor',
			spacecraftComponentId = 'spellReferenceProject.component.spacecraft',
			rotationSpeed         = 1.75,
			tmp                   = vec2.create()



		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var updateSpacecraft = function( deltaTimeInMs ) {
			var spacecraftEntity    = this,
				deltaTimeInS        = deltaTimeInMs / 1000,
				positionComponent   = spacecraftEntity[ positionComponentId ],
				actions             = spacecraftEntity[ actorComponentId ].actions,
				spacecraftComponent = spacecraftEntity[ spacecraftComponentId ]


			var rotationDirection = ( actions.steerLeft.executing ?
				-1 :
				actions.steerRight.executing ?
					1 :
					0
			)

			if( rotationDirection ) {
				spacecraftEntity[ rotationComponentId ] += deltaTimeInMs / 1000 * rotationSpeed * rotationDirection
			}

			if( actions.accelerate.executing ) {
				var rotation = spacecraftEntity[ rotationComponentId ]

				// f, tmp := thrustVector
				vec2.set(
					[
						Math.sin( rotation ) * spacecraftComponent.thrusterForce,
						Math.cos( rotation ) * spacecraftComponent.thrusterForce
					],
					tmp
				)

				// da, tmp := deltaAcceleration
				vec2.multiplyScalar( tmp, 1 / spacecraftComponent.mass )

				// dv, tmp := deltaSpeed
				vec2.multiplyScalar( tmp, deltaTimeInS )
				vec2.add( spacecraftComponent.speed, tmp )
			}

			// ds, tmp := deltaPosition
			vec2.multiplyScalar( spacecraftComponent.speed, deltaTimeInS, tmp )

			vec2.add( positionComponent, tmp )
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			_.invoke( this.spacecraftEntities, updateSpacecraft, deltaTimeInMs )
		}


		/**
		 * public
		 */

		var SpacecraftIntegrator = function( globals, spacecraftEntities ) {
			this.spacecraftEntities = spacecraftEntities
		}

		SpacecraftIntegrator.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return SpacecraftIntegrator
	}
)
