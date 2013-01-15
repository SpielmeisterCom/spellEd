Ext.define('Spelled.model.assets.Translation', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_translation',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'translation'
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
		{ name: 'subtype', type: 'string', defaultValue: 'translation' }
	]
})