define(
	'spellReferenceProject/system/aiControl',
	[
		'spell/shared/util/platform/underscore',

		'glmatrix/vec2'
	],
	function(
		_,

		vec2
	) {
		'use strict'


		/**
		 * private
		 */

		var aimingAccuracy = 0.025, // in radians
			tmp            = vec2.create()


		var init = function( globals ) { }

		var cleanUp = function( globals ) {}


		var isAIControlled = function( actor ) {
			return actor.id === 'aiControlled'
		}

		var getNextTargetId = function( aiPosition, playerPositions ) {
			return _.reduce(
				playerPositions,
				function( memo, playerPosition, entityId ) {
					vec2.subtract( aiPosition, playerPosition, tmp )
					var distanceSquared = vec2.dot( tmp, tmp )

					if( distanceSquared < memo.distanceSquared ) {
						memo.id = entityId
						memo.distanceSquared = distanceSquared
					}

					return memo
				},
				{
					id : undefined,
					distanceSquared : Number.POSITIVE_INFINITY
				}
			).id
		}

		var updateActor = function( aiActor, aiPosition, aiRotation, targetPosition ) {
			vec2.subtract( targetPosition, aiPosition, tmp )
			vec2.normalize( tmp )

			// TODO: find the bug that causes the ai spacecraft to occasionally steer in the wrong direction (rotates the bigger angle)
			var deltaAngle = Math.atan2( tmp[ 0 ], tmp[ 1 ] ) - aiRotation
			deltaAngle += ( deltaAngle > Math.PI ) ? -2 * Math.PI : ( deltaAngle < -Math.PI ) ? 2 * Math.PI : 0

			var actions = aiActor.actions
			actions.steerLeft.executing  = deltaAngle < -aimingAccuracy
			actions.steerRight.executing = deltaAngle > aimingAccuracy
			actions.accelerate.executing = Math.abs( deltaAngle ) < aimingAccuracy
		}

		var updateActors = function( globals, timeInMs, deltaTimeInMs ) {
			var actors    = this.actors,
				positions = this.positions,
				rotations = this.rotations

			// NOTE: Distinguishing between ai and player controlled actors should be done by using separate component types in order to save some cycles here.
			var aiControlledIds = [],
				playerControlledIds = []

			_.each(
				actors,
				function( actor, entityId ) {
					if( isAIControlled( actor ) ) {
						aiControlledIds.push( entityId )

					} else {
						playerControlledIds.push( entityId )
					}
				}
			)

			var targetPositions = _.pick( positions, playerControlledIds )

			_.each(
				aiControlledIds,
				function( aiControlledId ) {
					var targetId = getNextTargetId( positions[ aiControlledId ], targetPositions )

					if( targetId ) {
						updateActor( actors[ aiControlledId ], positions[ aiControlledId ], rotations[ aiControlledId ], targetPositions[ targetId ] )
					}
				}
			)
		}


		/**
		 * public
		 */

		var AIControl = function( globals, actors, positions, rotations ) {
			this.actors    = actors
			this.positions = positions
			this.rotations = rotations
		}

		AIControl.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : updateActors
		}

		return AIControl
	}
)
