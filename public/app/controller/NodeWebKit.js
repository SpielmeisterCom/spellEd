Ext.define( 'Spelled.controller.NodeWebKit', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.ui.SpelledConfiguration'
	],

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
