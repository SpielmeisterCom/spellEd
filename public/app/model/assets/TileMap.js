Ext.define('Spelled.model.assets.TileMap', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_tile_map',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: '2dTileMap'
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
		{ name: 'subtype', type: 'string', defaultValue: '2dTileMap' },
		'file'
	]
})