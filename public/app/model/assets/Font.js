Ext.define('Spelled.model.assets.Font', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_text_appearance',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'font'
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
		{ name: 'subtype', type: 'string', defaultValue: 'font' },
		'charset',
		'baseline',
		'fontSize',
		'hSpacing',
		'vSpacing',
		'color',
		'outlineColor',
		'outline',
		'firstChar',
		'lastChar',
		'fontFamily',
		'fontStyle',
		'file'
	],

	setFontMapInfo: function( fontMap ) {
		this.set( 'charset', fontMap.charset )
		this.set( 'baseline', fontMap( result.baseline, 10 ) )
		this.set( 'file', this.get( 'name' ) + ".png" )
	}
})