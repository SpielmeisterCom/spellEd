Ext.define('Spelled.model.assets.Font', {
    extend: 'Spelled.model.Asset',
	docString: '#!/guide/asset_type_text_appearance',

	iconCls: "tree-asset-2dtextappearance-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'font'
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
		this.set( 'baseline', parseInt( fontMap.baseline, 10 ) )
		this.set( 'file', this.get( 'name' ) + ".png" )
	}
})