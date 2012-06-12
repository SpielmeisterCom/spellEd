define(
	'spellReferenceProject/system/endlessPlayingField',
	[
		'spell/shared/util/platform/underscore'
	],
	function(
		_
	) {
		'use strict'


		/**
		 * private
		 */

		var positionComponentId = 'spell.component.core.position',
			playingFieldSize    = [ 1024, 768 ],
			border              = 10,
			wrapOffset          = 75,
			rightBorder         = playingFieldSize[ 0 ] + border,
			leftBorder          = 0 - border,
			topBorder           = playingFieldSize[ 1 ] + border,
			bottomBorder        = 0 - border


		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var updatePosition = function( entity ) {
			var positionComponent = entity[ positionComponentId ]

			if( positionComponent[ 0 ] > rightBorder ) {
				positionComponent[ 0 ] = leftBorder
				positionComponent[ 1 ] += wrapOffset

			} else if( positionComponent[ 0 ] < leftBorder ) {
				positionComponent[ 0 ] = rightBorder
				positionComponent[ 1 ] -= wrapOffset

			} else if( positionComponent[ 1 ] > topBorder ) {
				positionComponent[ 0 ] += wrapOffset
				positionComponent[ 1 ] = bottomBorder

			} else if( positionComponent[ 1 ] < bottomBorder ) {
				positionComponent[ 0 ] -= wrapOffset
				positionComponent[ 1 ] = topBorder
			}
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			_.each( this.spacecraftEntities, updatePosition )
		}


		/**
		 * public
		 */

		var EndlessPlayingField = function( globals, spacecraftEntities ) {
			this.spacecraftEntities = spacecraftEntities
		}

		EndlessPlayingField.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return EndlessPlayingField
	}
)
