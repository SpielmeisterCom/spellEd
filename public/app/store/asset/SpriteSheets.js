Ext.define('Spelled.store.asset.SpriteSheets', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.SpriteSheet'
	],

	model: 'Spelled.model.assets.SpriteSheet'
})