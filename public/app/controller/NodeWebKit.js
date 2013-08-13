Ext.define( 'Spelled.controller.NodeWebKit', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.ui.SpelledConfiguration'
	],

	refs: [
		{
			ref : 'ToolBar',
			selector: 'nwtoolbar'
		}
	],

	init: function() {
		if( Spelled.platform.Adapter.isNodeWebKit() ) {
			var me = this

			var task = new Ext.util.DelayedTask(function(){
				me.checkForUpdate( true )
			})

			task.delay( 60000 )
		}

		this.listen({
			component: {
				'button[action="showBuildResult"]': {
					click: this.showBuildResult
				},
				'spelledmenu [action="showSettings"]': {
					click: this.showSpellEdConfig
				},
				'spelledconfigure' : {
					setspelledconfig: this.setSpelledConfig,
					close: this.setToolBarVisible
				},
				nwtoolbar: {
					showSettings: this.showSpellEdConfig,
					showUpdateDialog   : this.showUpdateDialog
				}
			},
			controller:{
				'*': {
					initwebkitversion: this.initWebkitVersion
				}
			},
			global: {
				checkForUpdate : this.checkForUpdate
			}
		})
	},

	setToolBarVisible: function() {
		var toolbar = this.getToolBar()

		if( toolbar && !toolbar.generated ) toolbar.generateMenu()
	},

	initWebkitVersion: function() {
		this.checkWorkspaceSettings()
	},

	showBuildResult: function( button ) {
		var project    = this.application.getActiveProject(),
			gui        = require('nw.gui'),
			path       = require( 'path' ),
			tmp        = button.buildType == this.application.getController( 'Projects' ).BUILD_DEBUG ? 'debug' : 'release',
			folderPath = path.join( project.get( 'name' ), 'build', tmp, button.target )

		gui.Shell.openItem( Spelled.Converter.toWorkspaceUrl( folderPath ) )
	},

	showSpellEdConfig: function( closeable ) {
		var fs            = require( 'fs' ),
			path          = require( 'path' ),
			pathUtil      = require( 'pathUtil' ),
			config        = Spelled.app.platform.getConfig()

		//Overwrite this with the home dir
		if( !closeable && !fs.existsSync( config.workspacePath ) ) {
			config.workspacePath = path.join( pathUtil.createOsPath().getHomePath() , Spelled.Configuration.defaultWorkspaceName )
		}

		Ext.create( 'Spelled.view.ui.SpelledConfiguration', { closable: closeable, spellConfig: config } ).show()
	},

	redirectToDownloadServer: function( url ) {
		var gui = require('nw.gui')

		gui.Shell.openExternal( url )
	},

	checkVersion: function( response, request, silent ) {
		var me          = this,
			result      = Ext.decode( response.responseText, true ),
			version     = (result.version || "0").split( '.' ),
			yourVersion = Spelled.Configuration.version.split( '.' ),
			url         = result.url,
			newer       = false

		for( var i = 0; i < version.length; i++ ) {
			if( yourVersion[ i ] ) {
				var partFromServer = parseInt( version[ i ], 10),
					yourPart       = parseInt( yourVersion[ i ], 10)

				if( partFromServer > yourPart ) {
					newer = true
					break
				} else if( partFromServer < yourPart ) {
					break
				}
			}
		}

		if( newer ) {
			Ext.Msg.confirm( 'A new version is available', "There is a newer version (" + version + ") of this software available.\nDo you want to download it now?",
				function( button ) {
					if( button == 'yes' ) {
						me.redirectToDownloadServer( url )
					}
				}
			)
		} else if( !silent ) {
			Spelled.MessageBox.info( 'Info', "No update available." )
		}
	},

	checkForUpdate: function( silent ) {
		var me = this

		Ext.Ajax.request({
			url: Spelled.Configuration.updateServerUrl,
			method: 'GET',
			success: Ext.bind( me.checkVersion, me, [ silent ], true ),
			failure: function( response, opts ) {
				if( !silent ) Spelled.MessageBox.alert( 'Error', 'Update server not reachable. Please try again later.' )
			}
		})
	},

	showUpdateDialog: function() {
		Ext.Msg.wait( 'Connecting to update server...' )

		this.checkForUpdate()
	},

	copyDemoProjects: function( workspace ) {
		var fs               = require( 'fs'),
			path             = require( 'path' ),
			wrench           = require( 'wrench' ),
			execPathDir      = path.dirname( process.execPath ),
			demoProjectsPath = fs.existsSync( path.join( execPathDir, Spelled.Configuration.demoProjectsFolder ) )
				? path.join( execPathDir, Spelled.Configuration.demoProjectsFolder )
				: path.join( execPathDir, '..', Spelled.Configuration.demoProjectsFolder )

		if( fs.existsSync( demoProjectsPath ) ) {
			wrench.copyDirSyncRecursive( demoProjectsPath , workspace )
		} else {
			Spelled.MessageBox.alert( "Missing demo_projects", "Your demo_project folder is missing at: " + demoProjectsPath )
		}
	},

	setSpelledConfig: function( window ) {
		var	me             = this,
			form           = window.down( 'form' ),
			workspaceField = form.down( 'field[name="workspacePath"]' ),
			oldWorkspace   = form.down( 'displayfield[configName="workspacePath"]' ).getValue(),
			workspacePath  = workspaceField.getValue(),
			androidSdkPath = form.down( 'field[name="androidSdkPath"]' ).getValue(),
			jdkPath        = form.down( 'field[name="jdkPath"]' ).getValue(),
			copyDemos      = form.down( 'checkbox[name="copyDemoProjects"]' ).getValue(),
			fs             = require( 'fs' ),
			path           = require( 'path' ),
			provider       = Ext.direct.Manager.getProvider( 'webkitProvider'),
			spellConfig    = window.spellConfig

		var exists             = fs.existsSync( workspacePath ),
			existsOldWorkspace = fs.existsSync( oldWorkspace ),
			setWorkspace       = function( newWorkspace ) {
				Spelled.Configuration.setWorkspacePath( newWorkspace )

				if( copyDemos ) me.copyDemoProjects( newWorkspace )

				provider.createWebKitExtDirectApi( function() {
					window.fireEvent( 'loadProjects' )
					Ext.callback( callback )
				} )
			},
			callback = function() {
				Spelled.app.platform.writeConfigFile()
				window.close()
			}

		if( androidSdkPath ) spellConfig.androidSdkPath = androidSdkPath
		if( jdkPath ) spellConfig.jdkPath = jdkPath

		if( exists ) {
			setWorkspace( workspacePath )

		} else if( existsOldWorkspace && copyDemos ) {
			setWorkspace( oldWorkspace )

		} else if( !existsOldWorkspace && fs.existsSync( path.dirname( oldWorkspace ) ) ) {
			setWorkspace( oldWorkspace )

		} else if( workspacePath || !fs.existsSync( oldWorkspace ) ) {
			Spelled.MessageBox.alert( "Wrong workspace", "Your workspace doesn't exist!" )
			workspaceField.markInvalid( 'No such folder' )
			workspaceField.textValid = false
		} else {
			Ext.callback( callback )
		}
	},

	checkWorkspaceSettings: function() {
		var app           = this.application,
			workspacePath = Spelled.Configuration.getWorkspacePath(),
			fs            = require( 'fs'),
			path          = require( 'path' ),
			updateAPI     = function() {
				var provider = Ext.direct.Manager.getProvider( 'webkitProvider' )
				provider.createWebKitExtDirectApi( Ext.bind( function() { this.loadProjects() }, app ) )
			}

		if( !workspacePath || !fs.existsSync( workspacePath ) ) {
			this.showSpellEdConfig( false )

		} else {
			this.setToolBarVisible()
			Ext.callback( updateAPI )
		}
	}
})
