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
								xtype: 'textfield',
								name: 'projectsPath',
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
		var window       = this.up( 'spelledconfigure' ),
			field        = this.up( 'form' ).down( 'textfield[name="projectsPath"]' ),
			projectsPath = field.getValue()

		Ext.Ajax.request({
			url: 'setSpelledConfig',
			params: {
				projectsPath: projectsPath
			},
			success: function(){
				window.fireEvent( 'loadProjects' )
				window.close()
			},
			failure: function() {
				field.markInvalid( 'No such folder' )
				field.textValid = false
			}
		})
	}
});