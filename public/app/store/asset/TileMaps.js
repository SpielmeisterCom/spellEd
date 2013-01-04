Ext.define('Spelled.store.asset.TileMaps', {
	extend: 'Ext.data.Store',

	mixins: [ 'Spelled.store.asset.Assets' ],

	requires: [
		'Spelled.model.assets.TileMap'
	],

	model: 'Spelled.model.assets.TileMap'
});