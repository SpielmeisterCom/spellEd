Ext.define('Spelled.model.assets.SpriteSheet', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_sprite_sheet',

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'asset',
			subtype: 'spriteSheet'
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
		{ name: 'subtype', type: 'string', defaultValue: 'spriteSheet' },
		'file'
	]
})