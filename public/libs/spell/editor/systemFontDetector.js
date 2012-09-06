define(
	'spell/editor/systemFontDetector',
	function() {
		'use strict'


		var minFlashVersion = '9.0.0'

		var loadSWF = function( swfObjectId, swfLocation ) {
			var flashvars = { onReady: 'onFontDetectReady', swfObjectId: swfObjectId }
			var params = { allowScriptAccess: 'always', menu: 'false' }
			var attributes = { id: swfObjectId, name: swfObjectId }

			swfobject.embedSWF( swfLocation, swfObjectId, '1', '1', minFlashVersion, false, flashvars, params, attributes)
		}

		var FontDetect = function( swfId, swfLocation ) {
			this._swfObjectId = swfId
			this.hasFlash     = swfobject ? swfobject.hasFlashPlayerVersion( minFlashVersion ) : false

			if( this.hasFlash ) {
				loadSWF( swfId, swfLocation )
			}
		}

		FontDetect.prototype = {
			getFonts: function() {
				if( !this.hasFlash ) return []

				var swfElement = document.getElementById( this._swfObjectId )

				return swfElement.fonts()
			}
		}

		return new FontDetect( 'font-detect-swf', 'libs/fontDetect/flash/FontList.swf' )
	}
)
