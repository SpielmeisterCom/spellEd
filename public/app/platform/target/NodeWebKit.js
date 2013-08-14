Ext.define( 'Spelled.platform.target.NodeWebKit', {
	extend: 'Spelled.platform.target.Abstract',
	requires: [
		'Spelled.Remoting'
	],

	getFilePath: function( fileName ) {
		var pathUtil = require( 'pathUtil' ),
			fs       = require( 'fs' ),
			wrench   = require( 'wrench' ),
			path     = require( 'path' ),
			appName  = Spelled.Configuration.appName,
			filePath = pathUtil.createConfigFilePath( path.dirname( process.execPath ), appName, fileName )

		if( filePath ) return filePath

		var appDataPath = pathUtil.createOsPath().createAppDataPath( appName )

		if( !fs.existsSync( appDataPath ) ) wrench.mkdirSyncRecursive( appDataPath )

		return path.join( appDataPath, fileName )
	},

	getConfigFilePath: function() {
		return this.getFilePath( Spelled.Configuration.configFileName )
	},

	getLicenseFilePath: function() {
		return this.getFilePath( Spelled.Configuration.licenseFileName )
	},

	getConfig: function() {
		if( this.spellConfig ) return this.spellConfig

		var fs             = require( 'fs' ),
			configFilePath = this.getConfigFilePath()

		if( !fs.existsSync( configFilePath ) ) this.copyDefaultConfig()

		this.spellConfig = Ext.decode( fs.readFileSync( configFilePath, 'utf8' ) )

		return this.spellConfig
	},

	writeFile: function( filePath, content ) {
		var fs       = require( 'fs')

		fs.writeFileSync( filePath, content )
	},

	writeLicense: function( licenceData ) {
		this.writeFile( this.getLicenseFilePath(), licenceData )
	},

	copyDefaultConfig: function() {
		var fs             = require( 'fs' ),
			defaultConfig  = fs.readFileSync( this.getFilePath( Spelled.Configuration.defaultConfigFileName ) ),
			configFilePath = this.getConfigFilePath()

		fs.writeFileSync( configFilePath, defaultConfig )
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

		var execDir                = path.dirname( process.execPath ),
			spellCliPath           = path.join( execDir, Spelled.Configuration.getSpellCliPath() ),
			spellCliExecutablePath = spellCliPath + ( process.platform == 'win32' ? '.exe' : '' )

		if( !fs.existsSync( spellCliExecutablePath ) ) {
			Spelled.MessageBox.error( 'Error', 'Could not find spellcli executable in "' + spellCliExecutablePath + '".', true )

			return
		}

		var child = childProcess.spawn( spellCliExecutablePath, [ 'license', '-s', '-j' ] )

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
		this.writeFile( this.getConfigFilePath(), JSON.stringify( this.getConfig(), '', '\t' ) )
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
