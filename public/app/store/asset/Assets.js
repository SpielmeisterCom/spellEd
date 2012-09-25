Ext.define('Spelled.store.asset.Assets', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Asset',

	listeners: {
		load: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		}
	}
});