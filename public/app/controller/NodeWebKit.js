Ext.define( 'Spelled.controller.NodeWebKit', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.ui.SpelledConfiguration'
	],

	init: function() {
		this.listen({
			component: {
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
			Ext.Msg.confirm( 'New version is available', "Do you want to download the new version?",
				function( button ) {
					if( button == 'yes' ) {
						me.redirectToDownloadServer( url )
					}
				}
			)
		} else if( !silent ) {
			Ext.Msg.alert( 'Info', "No update available." )
		}
	},

	checkForUpdate: function( silent ) {
		var me = this

		Ext.Ajax.request({
			url: 'http://localhost:3000/spellEdVersion.json',
			method: 'GET',
			success: Ext.bind( me.checkVersion, me, [ silent ], true ),
			failure: function( response, opts ) {
				if( !silent ) Ext.Msg.alert( 'Error', 'Update server not reachable. Please try again later.' )
			}
		})
	},

	showUpdateDialog: function() {
		var msg = Ext.MessageBox.wait( 'Connecting to update server...' )

		this.checkForUpdate()
	},

	checkWorkspaceSettings: function() {
		var workspacePath = Spelled.Configuration.getWorkspacePath(),
			fs            = require( 'fs' )

		if( !workspacePath || !fs.existsSync( workspacePath ) )
			this.showSpellEdConfig()

		else {
			var provider = Ext.direct.Manager.getProvider( 'webkitProvider')

			provider.createWebKitExtDirectApi( Ext.bind( function() { this.loadProjects() }, this.application ) )
		}
	}
})
