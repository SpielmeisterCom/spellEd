Ext.define('Spelled.view.project.settings.Android' ,{
	extend: 'Ext.tab.Panel',
    alias: 'widget.projectandroidsettings',

    title : 'Android',

	initComponent: function() {

		Ext.applyIf( this, {
			items:[{
				title: 'General',
				items: [
					{
						xtype:'fieldset',
						title: 'Package settings',
						defaults: {
							labelWidth: 130
						},
						items: [
							{
								xtype: 'textfield',
								name: 'package',
								fieldLabel: 'Package identifier',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'title',
								fieldLabel: 'App Title',
								anchor: '100%'
							}
						]
					}
				]
			}, {
				title: 'Release Signing',
				items: [{
					xtype:'fieldset',
					title: 'Signing options (for release build)',
					defaults: {
						labelWidth: 130
					},
					items: [
						{
							xtype: 'textfield',
							name: 'signingKeyStore',
							fieldLabel: 'Keystore',
							anchor: '100%'
						},
						{
							xtype: 'textfield',
							name: 'signingKeyStorePass',
							fieldLabel: 'Keystore Password',
							anchor: '100%'
						},
						{
							xtype: 'textfield',
							name: 'signingKeyAlias',
							fieldLabel: 'Key Alias',
							anchor: '100%'
						},
						{
							xtype: 'textfield',
							name: 'signingKeyPass',
							fieldLabel: 'Key Password',
							anchor: '100%'
						}
					]
				}]
			},
			{
				xtype: 'projectresources',
				storeName: 'project.AndroidResources'
			}]
		})

		this.callParent( arguments )
	}
})