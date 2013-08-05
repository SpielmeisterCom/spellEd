Ext.define('Spelled.model.assets.KeyMapping', {
    extend: 'Spelled.model.Asset',

	docString: '#!/guide/asset_type_key_to_action_map',

	iconCls: "tree-asset-inputmap-icon",

	proxy: {
		type: 'storageaction',
		extraParams: {
			type: 'asset',
			subtype: 'inputMap'
		},
		writer: 'asset',
		reader: 'asset'
	},

	fields: [
		{ name: 'subtype', type: 'string', defaultValue: 'inputMap' },
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
