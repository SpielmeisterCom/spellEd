Ext.define(
	'Spelled.store.project.AndroidResources',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'xtype', 'config' ],

		data : [
			{
				name: 'ldpi-icon',
				xtype: 'projectresourceimage',
				config: {
					width:      36,
					height:     36,
					path:       'resources/android/drawable-ldpi/icon.png'
				}
			},
			{
				name: 'mdpi-icon',
				xtype: 'projectresourceimage',
				config: {
					width:      48,
					height:     48,
					path:       'resources/android/drawable-mdpi/icon.png'
				}
			},
			{
				name: 'hdpi-icon',
				xtype: 'projectresourceimage',
				config: {
					width:      72,
					height:     72,
					path:       'resources/android/drawable-hdpi/icon.png'
				}
			},
			{
				name: 'xhdpi-icon',
				xtype: 'projectresourceimage',
				config: {
					width:      96,
					height:     96,
					path:       'resources/android/drawable-xhdpi/icon.png'
				}
			}
		]
	}
);
