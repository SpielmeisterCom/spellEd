define(
	'spellReferenceProject/system/collisionDetector',
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

		var positionComponentId        = 'spell.component.core.position',
			spacecraftComponentId      = 'spellReferenceProject.component.spacecraft',
			collisionSphereComponentId = 'spellReferenceProject.component.collisionSphere',
			distance                   = vec2.create(),
			distanceSquared            = 0,
			minDistanceSquared         = 0


		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var isColliding = function( entityA, entityB ) {
			vec2.subtract( entityA[ positionComponentId ], entityB[ positionComponentId ], distance )
			distanceSquared = vec2.dot( distance, distance )

			minDistanceSquared = entityA[ collisionSphereComponentId ].radius + entityB[ collisionSphereComponentId ].radius
			minDistanceSquared *= minDistanceSquared

			return distanceSquared <= minDistanceSquared
		}

		var createCollisionPairs = function( entities ) {
			var entityIds    = _.keys( entities ),
				numEntityIds = entityIds.length,
				result       = []

			for( var i = 0; i < numEntityIds; i++ ) {
				var entityA = entities[ i ]

				for( var j = i + 1; j < numEntityIds; j++ ) {
					var entityB = entities[ j ]

					if( isColliding( entityA, entityB ) ) {
						result.push( [ entityA, entityB ] )
					}
				}
			}

			return result
		}

		var resolveCollision = function( collisionPair ) {
			var entityA     = collisionPair[ 0 ],
				entityB     = collisionPair[ 1 ],
				positionA   = entityA[ positionComponentId ],
				positionB   = entityB[ positionComponentId ],
				spacecraftA = entityA[ spacecraftComponentId ],
				spacecraftB = entityB[ spacecraftComponentId ],
				tmpV        = vec2.create()

			var dn = vec2.create()
			vec2.subtract( positionA, positionB, dn )

			// distance between objects
			var delta = vec2.length( dn )

			if( delta === 0 ) {
				positionB[ 0 ] += 0.01
			}

			// normal of the collision plane
			vec2.normalize( dn )

			// tangential of the collision plane
			var dt = vec2.create( [ dn[ 1 ], dn[ 0 ] * -1 ] )

			// masses
			var m1 = spacecraftA.mass,
				m2 = spacecraftB.mass,
				M  = m1 + m2

			// minimum translation distance required to separate objects
			var mt = vec2.create()
			vec2.multiplyScalar(
				dn,
				entityA[ collisionSphereComponentId ].radius + entityB[ collisionSphereComponentId ].radius - delta,
				mt
			)

			// pushing the objects apart relative to their mass
			vec2.multiplyScalar( mt, m2 / M, tmpV )
			vec2.add( positionA, tmpV )

			vec2.multiplyScalar( mt, m1 / M, tmpV )
			vec2.subtract( positionB, tmpV )

			// current velocities
			var v1 = spacecraftA.velocity,
				v2 = spacecraftB.velocity

			// splitting the velocity of the object into normal and tangential component relative to the collision plane
			var v1n = vec2.create(),
				v1t = vec2.create()

			vec2.multiplyScalar( dn, vec2.dot( v1, dn ), v1n )
			vec2.multiplyScalar( dt, vec2.dot( v1, dt ), v1t )

			var v2n = vec2.create(),
				v2t = vec2.create()

			vec2.multiplyScalar( dn, vec2.dot( v2, dn ), v2n )
			vec2.multiplyScalar( dt, vec2.dot( v2, dt ), v2t )

			// calculate new velocity, the tangential component stays the same, the normal component changes analog to the 1-dimensional case
			var v1nlen = vec2.length( v1n ),
				v2nlen = vec2.length( v2n )

			vec2.multiplyScalar(
				dn,
				( m1 - m2 ) / M * v1nlen + 2 * m2 / M * v2nlen,
				tmpV
			)
			vec2.add( v1t, tmpV, spacecraftA.velocity )

			vec2.multiplyScalar(
				dn,
				( m2 - m1 ) / M * v2nlen + 2 * m1 / M * v1nlen,
				tmpV
			)
			vec2.add( v2t, tmpV, spacecraftB.velocity )
		}

		var resolveCollisions = function( collisionPairs ) {
			_.each( collisionPairs, resolveCollision )
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			resolveCollisions(
				createCollisionPairs( this.spacecraftEntities )
			)
		}


		/**
		 * public
		 */

		var CollisionDetector = function( globals, spacecraftEntities ) {
			this.spacecraftEntities = spacecraftEntities
		}

		CollisionDetector.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return CollisionDetector
	}
)
