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

		var playingFieldSize    = [ 1024, 768 ],
			border              = 25,
			wrapOffset          = 75,
			rightBorder         = playingFieldSize[ 0 ] + border,
			leftBorder          = 0 - border,
			topBorder           = playingFieldSize[ 1 ] + border,
			bottomBorder        = 0 - border


		var init = function( globals ) { }

		var cleanUp = function( globals ) {}

		var updatePosition = function( position ) {
			if( position[ 0 ] > rightBorder ) {
				position[ 0 ] = leftBorder
				position[ 1 ] += wrapOffset

			} else if( position[ 0 ] < leftBorder ) {
				position[ 0 ] = rightBorder
				position[ 1 ] -= wrapOffset

			} else if( position[ 1 ] > topBorder ) {
				position[ 0 ] += wrapOffset
				position[ 1 ] = bottomBorder

			} else if( position[ 1 ] < bottomBorder ) {
				position[ 0 ] -= wrapOffset
				position[ 1 ] = topBorder
			}
		}

		var process = function( globals, timeInMs, deltaTimeInMs ) {
			_.each( this.positions, updatePosition )
		}


		/**
		 * public
		 */

		var EndlessPlayingField = function( globals, positions ) {
			this.positions = positions
		}

		EndlessPlayingField.prototype = {
			cleanUp : cleanUp,
			init : init,
			process : process
		}

		return EndlessPlayingField
	}
)
