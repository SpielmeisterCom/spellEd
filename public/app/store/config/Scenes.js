Ext.define('Spelled.store.config.Scenes', {
    extend: 'Ext.data.Store',
	requires: ['Spelled.model.config.Scene'],

	model: 'Spelled.model.config.Scene',
	listeners: {
		add: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		},
		load: function( me, records, successful ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		}
	}
});
