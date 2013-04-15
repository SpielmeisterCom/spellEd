Ext.define('Spelled.view.ui.SpelledConfiguration' ,{
    extend: 'Ext.Window',
    title : 'Configure SpellEd',

    alias: 'widget.spelledconfigure',

	layout: 'fit',

    modal : true,
    closable: false,

	initComponent: function() {

		Ext.applyIf(
			this,{
				items: [
					{
						bodyPadding: 10,
						xtype: 'form',
						items: [
							{
								xtype: 'field',
								inputType: 'file',
								inputAttrTpl: 'nwdirectory',
								name: 'workspacePath',
								labelWidth: 150,
								fieldLabel: 'Path to the projects folder',
								allowBlank: false
							}
						],
						buttons: [
							{
								text: 'Set SpellEd configuration',
								action: "setSpellEdConfig",
								handler: this.setConfigHandler
							}
						]
					}
				]
			}
		)

		this.callParent( arguments )
	},

	setConfigHandler: function() {
		var window        = this.up( 'spelledconfigure' ),
			field         = this.up( 'form' ).down( 'field[name="workspacePath"]' ),
			workspacePath = field.getValue(),
			fs            = require( 'fs' ),
			provider      = Ext.direct.Manager.getProvider( 'webkitProvider' )

		var exists = fs.existsSync( workspacePath )

		if( exists ) {
			Spelled.Configuration.setWorkspacePath( workspacePath )

			provider.createWebKitExtDirectApi( function() {
				window.fireEvent( 'loadProjects' )
				window.close()
			} )

		} else {
			field.markInvalid( 'No such folder' )
			field.textValid = false
		}
	}
});