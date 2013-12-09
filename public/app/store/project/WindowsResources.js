Ext.define(
	'Spelled.store.project.WindowsResources',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'xtype', 'config' ],

		data : [
			{
				name: 'logo',
				xtype: 'projectresourceimage',
				config: {
					title: 'Logo',
					description: '',
					width: 150,
					height: 150,
					path: 'resources/windows/logo.png'
				}
			},
			{
				name: 'small-logo',
				xtype: 'projectresourceimage',
				config: {
					title: 'Small Logo',
					description: '',
					width: 30,
					height: 30,
					path: 'resources/windows/smallLogo.png'
				}
			},
			{
				name: 'store-logo',
				xtype: 'projectresourceimage',
				config: {
					title: 'Store Logo',
					description: '',
					width: 50,
					height: 50,
					path: 'resources/windows/storeLogo.png'
				}
			},
			{
				name: 'splash-screen',
				xtype: 'projectresourceimage',
				config: {
					title: 'Splash Screen',
					description: '',
					width: 620,
					height: 300,
					path: 'resources/windows/splash.png'
				}
			},
			{
				name: 'author-pfx-file',
				xtype: 'projectresourcecertificate',
				config: {
					title:          'Personal information exchange',
					description:    '',
					type:           'pfx',
					path:           'resources/windows/certificates/windows-store.pfx'
				}
			}
		]
	}
);
