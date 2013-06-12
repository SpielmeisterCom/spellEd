Ext.define('Spelled.model.assets.KeyMapping', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_key_to_action_map',

	iconCls: "tree-asset-keytoactionmap-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'keyToActionMap'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'subtype', type: 'string', defaultValue: 'keyToActionMap' },
		{ name: 'config', type: 'object' }
	],

	setKeyMappings: function( grid ) {
		var store  = grid.getStore(),
			config = {}

		store.each(
			function( item ) {
				config[ item.get( 'key' ) ] = item.get( 'action' )
			}
		)

		this.set( 'config', config )
	}
})