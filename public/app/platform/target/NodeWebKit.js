Ext.define( 'Spelled.platform.target.NodeWebKit', {
	extend: 'Spelled.platform.target.Abstract',
	requires: [
		'Spelled.Remoting'
	],

	writeLicense: function( licenceData ) {
		var fs = require( 'fs' )

		fs.writeFileSync( Spelled.Configuration.licenseFileName, licenceData )
	},

	readLicense: function() {
		var fs = require( 'fs')

		try {
			var content = fs.readFileSync( Spelled.Configuration.licenseFileName )

			return content.toString()
		} catch ( e ) {
			return null
		}
	},

	getLicenseInformation: function( licenseData, callback ) {
		var fs              = require( 'fs' ),
			path            = require( 'path'),
			childProcess    = require( 'child_process'),
			onComplete      = function( error, result ) {
				Spelled.app.fireEvent( 'licensecallback', licenseData, result, callback )
			}

		var appendExtension = process.platform == 'win32' ? '.exe' : '',
			base64Value     = new Buffer( licenseData ).toString( 'base64' )

		childProcess.execFile( 'spellcli' + appendExtension, [ 'license', base64Value, '-j' ], { cwd: path.normalize("c:/Users/Ioannis/Desktop/win-ia32/") }, onComplete )
	},

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

	toggleDevTools: function( id ) {
		var gui = require('nw.gui'),
			win = gui.Window.get()

		win.showDevTools( id )
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
