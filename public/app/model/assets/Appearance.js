Ext.define('Spelled.model.assets.Appearance', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_2d_static_appearance',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'appearance'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: {
			type: 'asset'
		}
	},

	fields: [
		'file'
	]
})