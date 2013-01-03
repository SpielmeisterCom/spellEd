Ext.define('Spelled.model.assets.Sound', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_sound',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'sound'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'subtype', type: 'string', defaultValue: 'sound' },
		'file'
	]
})