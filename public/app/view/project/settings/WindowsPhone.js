Ext.define('Spelled.view.project.settings.WindowsPhone' ,{
	extend: 'Spelled.view.project.settings.TabPanel',
    alias: 'widget.projectwindowsphonesettings',

    title : 'Windows Phone',

	requires: [
		'Spelled.store.project.WindowsPhoneResources'
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
								name: 'displayName',
								fieldLabel: 'Display name',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'publisher',
								fieldLabel: 'Publisher',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'author',
								fieldLabel: 'Author',
								anchor: '100%'
							},
							{
								xtype: 'textfield',
								name: 'description',
								fieldLabel: 'Description',
								anchor: '100%'
							}
						]
					}
				]
			},
			{
				xtype: 'projectresources',
				storeName: 'project.WindowsPhoneResources'
			}]
		})

		this.callParent( arguments )
	}
})