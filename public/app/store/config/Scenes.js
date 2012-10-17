Ext.define('Spelled.store.config.Scenes', {
    extend: 'Ext.data.Store',
	requires: ['Spelled.model.config.Scene'],

	model: 'Spelled.model.config.Scene',
	listeners: {
		load: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		}
	}
});
