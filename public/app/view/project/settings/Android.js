Ext.define('Spelled.view.project.settings.Android' ,{
	extend: 'Spelled.view.project.settings.TabPanel',
    alias: 'widget.projectandroidsettings',

    title : 'Android',

	initComponent: function() {

		Ext.applyIf( this, {
			items:[{
				title: 'General',
				xtype: 'projectsettingsform',

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
				title: 'Signing',
				configId: 'signing',
				xtype: 'projectsettingsform',

				items: [{
					xtype:'fieldset',
					title: 'Release builds',
					defaults: {
						labelWidth: 130
					},
					items: [
						{
							xtype: 'textfield',
							name: 'releaseKeyStorePassword',
							fieldLabel: 'Keystore Password',
							anchor: '100%'
						},
						{
							xtype: 'textfield',
							name: 'releaseKeyAlias',
							fieldLabel: 'Key Alias',
							anchor: '100%'
						},
						{
							xtype: 'textfield',
							name: 'releaseKeyPassword',
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