Ext.define( 'Spelled.StoreHelper', {
	singleton: true,

	getAssetStoreByType: function( type ) {
		var info = Ext.getStore( 'asset.Types').findRecord( 'type', type )

		return ( info ) ? Ext.getStore( info.get( 'storeId' ) ) : null
	}
})
