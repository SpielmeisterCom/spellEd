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
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'assetId', type: 'string' },
		{ name: 'duration', type: 'float' },
		{ name: 'frameIds', type: 'array'},
		{ name: 'rotation', type: 'float' },
		{ name: 'transformation', type: 'array' },
		{ name: 'scale', type: 'array' }
	]
})