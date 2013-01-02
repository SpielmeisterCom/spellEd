Ext.define('Spelled.model.assets.Animation', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_2d_animated_appearance',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'animation'
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