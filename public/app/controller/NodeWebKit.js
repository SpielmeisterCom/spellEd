Ext.define( 'Spelled.controller.NodeWebKit', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.ui.SpelledConfiguration'
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
				'spelledmenu [action="showSetWorkspace"]': {
					click: this.showSpellEdConfig
				},
				nwtoolbar: {
					showSetWorkspace: this.showSpellEdConfig,
					showUpdateDialog   : this.showUpdateDialog
				}
			},
			global: {
				checkForUpdate : this.checkForUpdate
			}
		})
	},

	showBuildResult: function( button ) {
		var project    = this.application.getActiveProject(),
			gui        = require('nw.gui'),
			path       = require( 'path' ),
			tmp        = button.buildType == this.application.getController( 'Projects' ).BUILD_DEBUG ? 'debug' : 'release',
			folderPath = path.join( project.get( 'name' ), 'build', tmp, button.target )

		gui.Shell.openItem( Spelled.Converter.toWorkspaceUrl( folderPath ) )
	},

	showSpellEdConfig: function() {
		Ext.state.Manager.clear( 'workspacePath' )
		Ext.create( 'Spelled.view.ui.SpelledConfiguration' ).show()
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

	checkWorkspaceSettings: function() {
		var workspacePath = Spelled.Configuration.getWorkspacePath(),
			fs            = require( 'fs'),
			path          = require( 'path' )

		if( !workspacePath || !fs.existsSync( workspacePath ) ) {
			Spelled.Configuration.setWorkspacePath( path.join( process.execPath, Spelled.Configuration.demoProjectsFolder ) )
		} else {
			var provider = Ext.direct.Manager.getProvider( 'webkitProvider')

			provider.createWebKitExtDirectApi( Ext.bind( function() { this.loadProjects() }, this.application ) )
		}
	}
})
