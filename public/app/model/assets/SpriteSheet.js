Ext.define('Spelled.model.assets.SpriteSheet', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_sprite_sheet',

	iconCls: "tree-asset-spritesheet-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'spriteSheet'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'subtype', type: 'string', defaultValue: 'spriteSheet' },

		'textureWidth',
		'textureHeight',
		'frameWidth',
		'frameHeight',
		'innerPadding',
		'file'
	]
})