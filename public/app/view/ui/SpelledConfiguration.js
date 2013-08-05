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
		var window         = this.up( 'spelledconfigure' ),
			form           = this.up( 'form' ),
			workspaceField = form.down( 'field[name="workspacePath"]' ),
			oldWorkspace   = form.down( 'displayfield[configName="workspacePath"]' ).getValue(),
			workspacePath  = workspaceField.getValue(),
			androidSdkPath = form.down( 'field[name="androidSdkPath"]' ).getValue(),
			jdkPath        = form.down( 'field[name="jdkPath"]' ).getValue(),
			fs             = require( 'fs' ),
			provider       = Ext.direct.Manager.getProvider( 'webkitProvider'),
			spellConfig    = window.spellConfig

		var exists   = fs.existsSync( workspacePath ),
			callback = function() {
				Spelled.app.platform.writeConfigFile()
				window.close()
			}

		if( androidSdkPath ) spellConfig.androidSdkPath = androidSdkPath
		if( jdkPath ) spellConfig.jdkPath = jdkPath

		if( exists ) {
			Spelled.Configuration.setWorkspacePath( workspacePath )

			provider.createWebKitExtDirectApi( function() {
				window.fireEvent( 'loadProjects' )
				Ext.callback( callback )
			} )

		} else if( workspacePath || !fs.existsSync( oldWorkspace ) ) {
			Spelled.MessageBox.alert( "Wrong workspace", "Your workspace doesn't exist!" )
			workspaceField.markInvalid( 'No such folder' )
			workspaceField.textValid = false
		} else {
			Ext.callback( callback )
		}
	}
});