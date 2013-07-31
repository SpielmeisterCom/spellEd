Ext.define( 'Spelled.platform.target.NodeWebKit', {
	extend: 'Spelled.platform.target.Abstract',
	requires: [
		'Spelled.Remoting'
	],

	getFilePath: function( fileName ) {
		var pathUtil = require( 'pathUtil'),
			path     = require( 'path' )

		return pathUtil.createConfigFilePath( path.dirname( process.execPath ), 'spell', fileName )
	},

	getConfigFilePath: function() {
		return this.getFilePath( Spelled.Configuration.configFileName )
	},

	getLicenseFilePath: function() {
		return this.getFilePath( Spelled.Configuration.licenseFileName ) || Spelled.Configuration.licenseFileName
	},

	getConfig: function() {
		if( this.spellConfig ) return this.spellConfig

		var fs             = require( 'fs' ),
			configFilePath = this.getConfigFilePath()

		this.spellConfig = Ext.decode( fs.readFileSync( configFilePath, 'utf8' ) )

		return this.spellConfig
	},

	writeLicense: function( licenceData ) {
		var fs = require( 'fs' )

		fs.writeFileSync( this.getLicenseFilePath(), licenceData )
	},

	readLicense: function() {
		var fs = require( 'fs')

		try {
			return fs.readFileSync( this.getLicenseFilePath(),  'utf8' )
		} catch ( e ) {
			return null
		}
	},

	getLicenseInformation: function( licenseData, callback ) {
		var result          = '',
			fs              = require( 'fs' ),
			path            = require( 'path'),
			childProcess    = require( 'child_process'),
			onFinish        = function() {
				Spelled.app.fireEvent( 'licensecallback', licenseData, result, callback )
			},
			onData      = function( data ) {
				result += data.toString()
			}

		var execDir      = path.dirname( process.execPath ),
			spellCliPath = path.join( execDir, Spelled.Configuration.getSpellCliPath() ),
			extension    = process.platform == 'win32' ? '.exe' : ''

		var child = childProcess.spawn( spellCliPath + extension, [ 'license', '-s', '-j' ] )

		child.stdout.on('data', onData)
		child.stderr.on('data', onData)
		child.on('close', onFinish)
		child.stdin.write( licenseData, 'utf8', function() { child.stdin.end( ) } )
	},

	copyToClipboard: function( text ) {
		var gui       = require('nw.gui'),
			clipboard = gui.Clipboard.get()

		clipboard.set( text, 'text')
	},

	writeConfigFile: function() {
		var configFilePath = this.getConfigFilePath(),
			fs             = require( 'fs' )

		fs.writeFileSync( configFilePath, JSON.stringify( this.getConfig(), '', '\t' ) )
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
