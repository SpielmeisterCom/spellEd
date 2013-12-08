Ext.define(
	'Spelled.store.project.AndroidResources',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'xtype', 'config' ],

		data : [
			{
				name: 'release-keystore',
				xtype: 'projectresourceprivatekeyfile',
				config: {
					title:          'KeyStore for release builds',
					description:    '',
					type:           'java-keystore',
					path:           'resources/android/certificates/release.keystore'
				}
			},
			{
				name: 'ldpi-icon',
				xtype: 'projectresourceimage',
				config: {
					title:      'ldpi icon',
					width:      36,
					height:     36,
					path:       'resources/android/drawable-ldpi/icon.png'
				}
			},
			{
				name: 'mdpi-icon',
				xtype: 'projectresourceimage',
				config: {
					title:      'mdpi icon',
					width:      48,
					height:     48,
					path:       'resources/android/drawable-mdpi/icon.png'
				}
			},
			{
				name: 'hdpi-icon',
				xtype: 'projectresourceimage',
				config: {
					title:      'hdpi icon',
					width:      72,
					height:     72,
					path:       'resources/android/drawable-hdpi/icon.png'
				}
			},
			{
				name: 'xhdpi-icon',
				xtype: 'projectresourceimage',
				config: {
					title:      'xhdpi icon',
					width:      96,
					height:     96,
					path:       'resources/android/drawable-xhdpi/icon.png'
				}
			}
		]
	}
);
