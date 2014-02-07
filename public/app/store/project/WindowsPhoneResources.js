Ext.define(
	'Spelled.store.project.WindowsPhoneResources',
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
					path: 'resources/winphone/ApplicationIcon.png'
				}
			},
			{
				name: 'smallLogo',
				xtype: 'projectresourceimage',
				config: {
					title: 'Logo',
					description: '',
					width: 150,
					height: 150,
					path: 'resources/winphone/FlipCycleTileSmall.png'
				}
			},
			{
				name: 'mediumLogo',
				xtype: 'projectresourceimage',
				config: {
					title: 'Logo',
					description: '',
					width: 150,
					height: 150,
					path: 'resources/winphone/FlipCycleTileMedium.png'
				}
			}
		]
	}
);
