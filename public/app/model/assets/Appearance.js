Ext.define('Spelled.model.assets.Appearance', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_2d_static_appearance',

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'appearance'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'localized', type: 'boolean', defaultValue: false },
		{ name: 'subtype', type: 'string', defaultValue: 'appearance' },
		'file'
	]
})