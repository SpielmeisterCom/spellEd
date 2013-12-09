Ext.define('Spelled.view.project.settings.Windows' ,{
	extend: 'Spelled.view.project.settings.TabPanel',
    alias: 'widget.projectwindowssettings',

    title : 'Windows',

	requires: [
		'Spelled.store.project.WindowsResources'
	],

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
								name: 'publisher',
								fieldLabel: 'Publisher',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'publisherDisplayName',
								fieldLabel: 'Publisher display name',
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
					title: 'Signing options',
					defaults: {
						labelWidth: 130
					},
					items: [
						{
							xtype: 'textfield',
							name: 'certificatePassword',
							fieldLabel: 'Password',
							anchor: '100%'
						}
					]
				}]
			},
			{
				xtype: 'projectresources',
				storeName: 'project.WindowsResources'
			}]
		})

		this.callParent( arguments )
	}
})