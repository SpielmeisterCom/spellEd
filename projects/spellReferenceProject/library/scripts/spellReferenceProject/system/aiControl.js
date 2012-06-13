define(
	'spellReferenceProject/system/aiControl',
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

		var positionComponentId = 'spell.component.core.position',
			rotationComponentId = 'spell.component.core.rotation',
			actorComponentId    = 'spell.component.core.actor',
			aimingAccuracy      = 0.025, // in radians
			tmp                 = vec2.create()


		var init = function( globals ) { }

		var cleanUp = function( globals ) {}


		var isAIControlled = function( entity ) {
			return entity[ actorComponentId ].id === 'aiControlled'
		}

		var toRotation = function( s ) {
			return s > 0 ? s : 2 * Math.PI + s
		}

		var getNextTarget = function( aiSpacecraft, playerSpacecrafts ) {
			var position = aiSpacecraft[ positionComponentId ]

			return _.reduce(
				playerSpacecrafts,
				function( memo, playerSpacecraft ) {
					vec2.subtract( position, playerSpacecraft[ positionComponentId ], tmp )
					var distanceSquared = vec2.dot( tmp, tmp )

					if( distanceSquared < memo.distanceSquared ) {
						memo.entity = playerSpacecraft
						memo.distanceSquared = distanceSquared
					}

					return memo
				},
				{
					entity : undefined,
					distanceSquared : Number.POSITIVE_INFINITY
				}
			).entity
		}

		var updateRotation = function( aiSpacecraft, targetSpacecraft ) {
			vec2.subtract( targetSpacecraft[ positionComponentId ], aiSpacecraft[ positionComponentId ], tmp )
			vec2.normalize( tmp )

			// TODO: find the bug that causes the ai spacecraft to occasionally steer in the wrong direction (rotates the bigger angle)
			var deltaAngle = Math.atan2( tmp[ 0 ], tmp[ 1 ] ) - aiSpacecraft[ rotationComponentId ]
			deltaAngle += ( deltaAngle > Math.PI ) ? -2 * Math.PI : ( deltaAngle < -Math.PI ) ? 2 * Math.PI : 0

			var actions = aiSpacecraft[ actorComponentId ].actions
			actions.steerLeft.executing  = deltaAngle < -aimingAccuracy
			actions.steerRight.executing = deltaAngle > aimingAccuracy
			actions.accelerate.executing = Math.abs( deltaAngle ) < aimingAccuracy
		}

		var updateRotations = function( aiSpacecrafts, playerSpacecrafts ) {
			_.each(
				aiSpacecrafts,
				function( aiSpacecraft ) {
					var targetSpacecraft = getNextTarget( aiSpacecraft, playerSpacecrafts )

					if( targetSpacecraft ) {
						updateRotation( aiSpacecraft, targetSpacecraft )
					}
				}
			)
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			updateRotations(
				_.filter( this.spacecraftEntities, isAIControlled ),
				_.reject( this.spacecraftEntities, isAIControlled )
			)
		}


		/**
		 * public
		 */

		var AIControl = function( globals, spacecraftEntities ) {
			this.spacecraftEntities = spacecraftEntities
		}

		AIControl.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return AIControl
	}
)
