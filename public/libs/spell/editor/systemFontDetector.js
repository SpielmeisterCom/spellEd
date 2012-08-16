define(
	'spell/editor/systemFontDetector',
	function() {
		"use strict"

		var loadSWF = function( swfObjectId, swfLocation ) {
			var flashvars = { onReady: "onFontDetectReady", swfObjectId: swfObjectId }
			var params = { allowScriptAccess: "always", menu: "false" }
			var attributes = { id: swfObjectId, name: swfObjectId }
			swfobject.embedSWF( swfLocation, swfObjectId, "1", "1", "9.0.0", false, flashvars, params, attributes)
		}

		var FontDetect = function( swfId, swfLocation ) {
			this._swfObjectId = swfId
			loadSWF(  swfId, swfLocation )
		}

		FontDetect.prototype = {
			getFonts: function() {
				var swfElement = document.getElementById( this._swfObjectId )
				return swfElement.fonts()
			}
		}

		return new FontDetect( "font-detect-swf", "libs/fontDetect/flash/FontList.swf" )
	}
)