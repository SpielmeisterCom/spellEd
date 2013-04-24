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
					showSetWorkspace: this.showSpellEdConfig
				}
			}
		})
	},

	showSpellEdConfig: function() {
		Ext.state.Manager.clear( 'workspacePath' )
		Ext.create( 'Spelled.view.ui.SpelledConfiguration' ).show()
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
