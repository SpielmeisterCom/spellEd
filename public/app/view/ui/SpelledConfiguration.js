Ext.define('Spelled.view.ui.SpelledConfiguration' ,{
    extend: 'Ext.Window',
    title : 'Configure SpellEd',

    alias: 'widget.spelledconfigure',

	layout: 'fit',

    modal : true,
    closable: true,

	setValues: function() {
		var fields = Ext.ComponentQuery.query( 'displayfield'),
			config = this.spellConfig

		Ext.each(
			fields,
			function( field ) {
				field.setValue( config[ field.configName ] )
			}
		)
	},

	onChangeHandler: function( field, newValue ) {
		var field = this.up( 'window' ).down( 'displayfield[configName="'+ this.name +'"]' )
		field.setValue( newValue )
	},

	initComponent: function() {
		Ext.applyIf(
			this,{
				listeners: {
					afterrender: this.setValues
				},
				items: [
					{
						bodyPadding: 10,
						xtype: 'form',
						items: [
							{
								xtype: 'fieldset',
								title: 'Path to your workspace',
								items: [
									{
										xtype: 'displayfield',
										configName: 'workspacePath',
										fieldLabel: 'Current configuration'
									},
									{
										listeners: {
											change: this.onChangeHandler
										},
										xtype: 'field',
										inputType: 'file',
										inputAttrTpl: 'nwdirectory',
										name: 'workspacePath',
										labelWidth: 150,
										allowBlank: false,
										fieldLabel: 'Select a new location'
									},
									{
										xtype: 'checkbox',
										name: 'copyDemoProjects',
										checked: !this.closable,
										labelWidth: 250,
										fieldLabel: 'Copy demo projects into workspace'
									}
								]
							},
							{
								xtype: 'fieldset',
								title: 'Path to the JDK folder (optional)',
								items: [
									{
										xtype: 'displayfield',
										configName: 'jdkPath',
										fieldLabel: 'Current configuration'
									},
									{
										listeners: {
											change: this.onChangeHandler
										},
										xtype: 'field',
										inputType: 'file',
										inputAttrTpl: 'nwdirectory',
										name: 'jdkPath',
										labelWidth: 150,
										allowBlank: true,
										fieldLabel: 'Select a new location'
									}
								]
							},
							{
								xtype: 'fieldset',
								title: 'Path to the Android SDK folder (optional)',
								items: [
									{
										xtype: 'displayfield',
										configName: 'androidSdkPath',
										fieldLabel: 'Current configuration'
									},
									{
										listeners: {
											change: this.onChangeHandler
										},
										xtype: 'field',
										inputType: 'file',
										inputAttrTpl: 'nwdirectory',
										name: 'androidSdkPath',
										labelWidth: 150,
										allowBlank: true,
										fieldLabel: 'Select a new location'
									}
								]
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
		var	window = this.up( 'spelledconfigure' )

		window.fireEvent( 'setspelledconfig', window )
	}
});