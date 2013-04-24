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

	showItemInFolder: function( projectName, libraryId ) {
		var gui        = require('nw.gui'),
			path       = require( 'path' ),
			parts      = Ext.Array.erase( libraryId.split('.'), 0, 1),
			folderPath = path.join( projectName, 'library', parts.join( path.sep ) )

		gui.Shell.openItem( Spelled.Converter.toWorkspaceUrl( folderPath ) )
	},

	normalizeUrl: function( url ) {
		var path = require( 'path' )
		return path.normalize( url )
	}
})
