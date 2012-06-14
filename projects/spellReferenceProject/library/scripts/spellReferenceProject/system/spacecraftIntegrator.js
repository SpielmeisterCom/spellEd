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

		var positionComponentId       = 'spell.component.core.position',
			rotationComponentId       = 'spell.component.core.rotation',
			actorComponentId          = 'spell.component.core.actor',
			spacecraftComponentId     = 'spellReferenceProject.component.spacecraft',
			inertialObjectComponentId = 'spellReferenceProject.component.inertialObject',
			rotationSpeed             = 1.75,
			tmp                       = vec2.create()



		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var updateSpacecraft = function( deltaTimeInS ) {
			var spacecraftEntity        = this,
				actions                 = spacecraftEntity[ actorComponentId ].actions,
				spacecraftComponent     = spacecraftEntity[ spacecraftComponentId ],
				inertialObjectComponent = spacecraftEntity[ inertialObjectComponentId ]


			var rotationDirection = ( actions.steerLeft.executing ?
				-1 :
				actions.steerRight.executing ?
					1 :
					0
			)

			if( rotationDirection ) {
				spacecraftEntity[ rotationComponentId ] += deltaTimeInS * rotationSpeed * rotationDirection
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
				vec2.multiplyScalar( tmp, 1 / inertialObjectComponent.mass )

				// dv, tmp := deltaSpeed
				vec2.multiplyScalar( tmp, deltaTimeInS )
				vec2.add( inertialObjectComponent.velocity, tmp )
			}
		}

		var updateInertialObjects = function( deltaTimeInS ) {
			var inertialObjectEntity    = this,
				inertialObjectComponent = inertialObjectEntity[ inertialObjectComponentId ],
				positionComponent       = inertialObjectEntity[ positionComponentId ]

			// ds, tmp := deltaPosition
			vec2.multiplyScalar( inertialObjectComponent.velocity, deltaTimeInS, tmp )

			vec2.add( positionComponent, tmp )
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			var deltaTimeInS = deltaTimeInMs / 1000

			_.invoke( this.spacecraftEntities, updateSpacecraft, deltaTimeInS )
			_.invoke( this.inertialObjectEntities, updateInertialObjects, deltaTimeInS )
		}


		/**
		 * public
		 */

		var SpacecraftIntegrator = function( globals, spacecraftEntities, inertialObjectEntities ) {
			this.spacecraftEntities = spacecraftEntities
			this.inertialObjectEntities = inertialObjectEntities
		}

		SpacecraftIntegrator.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return SpacecraftIntegrator
	}
)
