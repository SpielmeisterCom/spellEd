Ext.define('Spelled.view.project.settings.Tizen' ,{
    extend: 'Spelled.view.project.settings.TabPanel',
    alias: 'widget.projecttizensettings',

    title : 'Tizen',

	initComponent: function() {

		Ext.applyIf( this, {
			items: [
			{
				title: 'General',
				xtype: 'projectsettingsform',

				items: [
					{
						xtype:'fieldset',
						title: 'General',
						defaults: {
							labelWidth: 130
						},
						items: [
							{
								xtype: 'textfield',
								name: 'identifier',
								fieldLabel: 'Identifier',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'name',
								fieldLabel: 'App Name',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'appId',
								fieldLabel: 'App ID',
								anchor: '100%'
							}
						]
					}
				]
			},
			{
				title: 'Signing',
				configId: 'signing',
				xtype: 'projectsettingsform',

				items: [
				{
					xtype:'fieldset',
					title: 'Signing options (for release build)',
					defaults: {
						labelWidth: 180
					},
					items: [
						{
							xtype: 'textfield',
							name: 'developerKeyfilePassword',
							fieldLabel: 'Author Keyfile Password',
							anchor: '100%'
						},
						{
							xtype: 'textfield',
							name: 'distributor1KeyfilePassword',
							fieldLabel: 'Distribution 1 Keyfile Password',
							anchor: '100%'
						},
						{
							xtype: 'textfield',
							name: 'distributor2KeyfilePassword',
							fieldLabel: 'Distribution 2 Keyfile Password',
							anchor: '100%'
						}
					]
				}
				]
			},
			{
				xtype: 'projectresources',
				storeName: 'project.TizenResources'
			}
		]

		})

		this.callParent( arguments )
	}
})