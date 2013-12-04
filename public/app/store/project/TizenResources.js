Ext.define(
	'Spelled.store.project.TizenResources',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'xtype', 'xdata' ],

		data : [
			{
				name: 'app-icon',
				xtype: 'image',
				xdata: {
					width:      117,
					height:     117,
					path:       'resources/tizen/icon.png'
				}
			},
			{
				name: 'author-ca-file',
				description: 'cer file',
				xtype: 'certificate',
				xdata: {
					path: 'resources/tizen/certs/tizen-developer-ca.cer'
				}
			},
			{
				name: 'author-key-file',
				description: 'p12 file',
				xtype: 'privatekey',
				xdata: {

				}
			},
			{
				name: 'dist1-ca-file',
				description: 'cer file',
				xtype: 'certificate',
				xdata: {
					path: 'resources/tizen/certs/tizen-distributor-ca.cer'

				}
			},
			{
				name: 'dist1-key-file',
				description: 'p12 file',
				xtype: 'privatekey',
				xdata: {

				}
			},
			{
				name: 'dist2-ca-file',
				description: 'cer file',
				xtype: 'certificate',
				xdata: {
					path: 'resources/tizen/certs/tizen-distributor-ca.cer'

				}
			},
			{
				name: 'dist2-key-file',
				description: 'p12 file',
				xtype: 'certificate',
				xdata: {

				}
			}
		]
	}
);
