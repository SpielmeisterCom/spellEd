Ext.define('Spelled.store.asset.Tilemaps', {
	extend: 'Spelled.store.asset.Assets',

	filters: [
		function( item ) {
			return item.get('subtype') === '2dTileMap'
		}
	]
});