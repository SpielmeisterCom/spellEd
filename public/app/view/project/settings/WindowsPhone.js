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
                                name: 'PhoneProductId',
                                fieldLabel: 'PhoneProductId',
                                anchor: '100%'
                            },
                            {
                                xtype: 'textfield',
                                name: 'PhonePublisherId',
                                fieldLabel: 'PhonePublisherId',
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