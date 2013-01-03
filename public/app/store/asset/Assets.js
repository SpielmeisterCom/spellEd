Ext.define( 'Spelled.store.asset.Assets', {
	listeners: {
		load: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		},
		add: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		}
	}
});