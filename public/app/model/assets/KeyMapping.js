Ext.define('Spelled.model.assets.KeyMapping', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_key_to_action_map',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'keyToActionMap'
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