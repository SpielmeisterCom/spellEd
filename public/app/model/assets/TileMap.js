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
		'assetId',
		'width',
		'height',
		{ name: 'tileLayerData', type: 'array' }
	],

	calculateTileLayerData: function() {
		var data   = Ext.isArray( this.get( 'tileLayerData' ) ) ? this.get( 'tileLayerData' ) : [],
			height = this.get( 'height' ),
			width  = this.get( 'width' )

		for( var y = 0; y < height; y++ ) {
			data[y] = data[ y ] || []
			for( var x = 0; x < width; x++ ) {
				data[y][x] = data[ y ] [ x ] || null
			}
		}

		this.set( 'tileLayerData', data )
	}
})