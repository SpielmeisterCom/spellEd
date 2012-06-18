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

		var spacecraftRotationSpeed = 1.75,
			tmp = vec2.create()


		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var updateInertialObject = function( deltaTimeInS, inertialObject, position ) {
			// ds, tmp := deltaPosition
			vec2.scale( inertialObject.velocity, deltaTimeInS, tmp )
			vec2.add( tmp, position )
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			var deltaTimeInS    = deltaTimeInMs / 1000,
				actors          = this.actors,
				positions       = this.positions,
				rotations       = this.rotations,
				spacecrafts     = this.spacecrafts,
				inertialObjects = this.inertialObjects

			_.each(
				_.keys( this.spacecrafts ),
				function( id ) {
					var actions        = actors[ id ].actions,
						inertialObject = inertialObjects[ id ]

					var rotationDirection = ( actions.steerLeft.executing ?
						-1 :
						actions.steerRight.executing ?
							1 :
							0
					)

					if( rotationDirection ) {
						rotations[ id ] += deltaTimeInS * spacecraftRotationSpeed * rotationDirection
					}

					if( actions.accelerate.executing ) {
						var rotation      = rotations[ id ],
							thrusterForce = spacecrafts[ id ].thrusterForce

						// f
						vec2.set(
							[
								Math.sin( rotation ) * thrusterForce,
								Math.cos( rotation ) * thrusterForce
							],
							tmp
						)

						// v = v + dv; dv = da * dt; da = f / m
						vec2.add(
							vec2.scale( tmp, deltaTimeInS / inertialObject.mass ),
							inertialObject.velocity
						)
					}
				}
			)

			_.each(
				this.inertialObjects,
				function( inertialObject, id ) {
					updateInertialObject( deltaTimeInS, inertialObject, positions[ id ] )
				}
			)
		}


		/**
		 * public
		 */

		var SpacecraftIntegrator = function( globals, actors, positions, rotations, spacecrafts, inertialObjects ) {
			this.actors          = actors
			this.positions       = positions
			this.rotations       = rotations
			this.spacecrafts     = spacecrafts
			this.inertialObjects = inertialObjects
		}

		SpacecraftIntegrator.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return SpacecraftIntegrator
	}
)
