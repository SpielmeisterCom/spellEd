Ext.define( 'Spelled.platform.target.NodeWebKit', {
	requires: [
		'Spelled.Remoting'
	],

	copyToClipboard: function( text ) {
		var gui       = require('nw.gui'),
			clipboard = gui.Clipboard.get()

		clipboard.set( text, 'text')
	},

	createRemoteProvider: function() {
		return Spelled.Remoting.createNodeWebKitProvider()
	},

	getToolbarXType: function() {
		return 'nwtoolbar'
	},

	enterFullScreen: function( dom ) {
		var gui = require('nw.gui'),
			win = gui.Window.get()

		win.toggleFullscreen()

		return true
	},

	normalizeUrl: function( url ) {
		var path = require( 'path' )
		return path.normalize( url )
	}
})
