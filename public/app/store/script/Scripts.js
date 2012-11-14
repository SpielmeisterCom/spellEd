Ext.define('Spelled.store.script.Scripts', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Script',

	listeners: {
        add: function( me, records, successful ) {
            Ext.getStore( 'Library' ).generateNodesFromRecords( records )
        },
		load: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		}
	}
});