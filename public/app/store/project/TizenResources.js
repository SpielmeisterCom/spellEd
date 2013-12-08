Ext.define(
	'Spelled.store.project.TizenResources',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'xtype', 'config' ],

		data : [
			{
				name: 'app-icon',
				xtype: 'projectresourceimage',
				config: {
					title:				'',
					description:		'This type of icon represents the application. It is recommend to have a circular shape ' +
										'for the icons of the Tizen platform, but it is not mandatory. For more information visit ' +
										'https://developer.tizen.org/documentation/ux-guide/visual-style/icons',
					width:				117,
					height:     117,
					path:       'resources/tizen/icon.png'
				}
			},
			{
				name: 'author-ca-file',
				xtype: 'projectresourcecertificate',
				config: {
					title:          'Author CA Certficate',
					description:    '',
					type:           'x509',
					path:           'resources/tizen/certificates/tizen-developer-ca.cer'
				}
			},
			{
				name: 'author-key-file',
				xtype: 'projectresourceprivatekeyfile',
				config: {
					title:          'Distribution 2 CA Private Key File',
					description:    '',
					type:           'p12',
					path:           'resources/tizen/certificates/tizen-developer-signer.p12'
				}
			},
			{
				name: 'dist1-ca-file',
				description: 'cer file',
				xtype: 'projectresourcecertificate',
				config: {
					title:          'Distribution 1 CA Certficiate',
					description:    '',
					type:           'x509',
					path:           'resources/tizen/certificates/tizen-distributor-1-ca.cer'
				}
			},
			{
				name: 'dist1-key-file',
				xtype: 'projectresourceprivatekeyfile',
				config: {
					title:          'Distribution 1 CA Private Key File',
					description:    '',
					type:           'p12',
					path:           'resources/tizen/certificates/tizen-distributor-1-signer.p12'
				}
			},
			{
				name: 'dist2-ca-file',
				xtype: 'projectresourcecertificate',
				config: {
					title:          'Distribution 2 CA Certficiate',
					description:    '',
					type:           'x509',
					path:           'resources/tizen/certificates/tizen-distributor-2-ca.cer'
				}
			},
			{
				name: 'dist2-key-file',
				xtype: 'projectresourceprivatekeyfile',
				config: {
					title:          'Distribution 2 CA Private Key File',
					description:    '',
					type:           'p12',
					path:           'resources/tizen/certificates/tizen-distributor-2-signer.p12'
				}
			}
		]
	}
);
