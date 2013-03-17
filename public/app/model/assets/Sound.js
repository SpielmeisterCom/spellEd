Ext.define('Spelled.model.assets.Sound', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_sound',

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'sound'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'subtype', type: 'string', defaultValue: 'sound' },
		'file'
	]
})