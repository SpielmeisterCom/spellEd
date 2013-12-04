Ext.define(
	'Spelled.store.project.TizenResources',
	{
		extend: 'Ext.data.Store',

		fields: [ 'name', 'xtype', 'xdata' ],

		data : [
			{
				name: 'icon',
				xtype: 'image',
				xdata: {
					width:      117,
					height:     117,
					path:       'resources/tizen/icon.png'
				}
			}
		]
	}
);
