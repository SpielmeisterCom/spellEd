Ext.define('Spelled.store.script.Scripts', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Script',

	listeners: {
		load: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		}
	}
});