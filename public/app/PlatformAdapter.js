Ext.define( 'Spelled.PlatformAdapter', {
	singleton: true,

	requires: [
		'Spelled.Remoting'
	],

	isNodeWebKit: function() {
		return ( typeof process == 'object' )
	},

	isMacOs: function() {
		return ( typeof process == 'object' && process.platform == 'darwin' )
	},

	createRemoteProvider: function() {
		return Spelled.PlatformAdapter.isNodeWebKit() ? Spelled.Remoting.createNodeWebKitProvider() : Spelled.Remoting.createSpellEdCloudProvider()
	},

	getToolbarXType: function() {
		return Spelled.PlatformAdapter.isNodeWebKit() ? 'nwtoolbar' : 'toolbar'
	},

	enterWebkitFullScreen: function() {
		var gui = require('nw.gui'),
			win = gui.Window.get()

		win.toggleFullscreen()

		return true
	},

	enterBrowserFullScreen: function( dom ) {
		var success  = false,
			prefixes = ["moz", "webkit", "ms", "o", ""]

		Ext.each( prefixes, function( prefix ) {
			var fnName = ( prefix.length > 0 ) ? "RequestFullScreen" : "requestFullScreen"

			if (dom[prefix + fnName] !== undefined) {
				dom.contentWindow.focus()

				//we need to call this function directly here, because Firefox does
				//not accept calling this function from another context
				dom[prefix + fnName]()

				success = true
			}
		})

		return success
	},

	enterFullScreen: function( dom ) {
		if( Spelled.PlatformAdapter.isNodeWebKit() ) {
			return this.enterWebkitFullScreen()
		} else {
			return this.enterBrowserFullScreen( dom )
		}
	},

	normalizeUrl: function( url ) {
		if( Spelled.PlatformAdapter.isNodeWebKit() ) {
			var path = require( 'path' )
			return path.normalize( url )
		} else {
			return url
		}
	}
})
