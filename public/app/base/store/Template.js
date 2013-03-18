Ext.define('Spelled.base.store.Template', {
    extend: 'Ext.data.Store',

    loadDataViaReader : function(data, append) {
        var me      = this,
            result  = me.proxy.reader.read(data),
            records = result.records;

        me.loadRecords(records, { addRecords: append })
        me.fireEvent('load', me, result.records, true)
    },

    getByTemplateId: function( templateId ) {
        var index = this.findBy( function( record ) {
            return ( record.getFullName() === templateId )
        })

        if( index > -1 ) {
            return this.getAt( index )
        }
	},

	listeners: {
		load: function( store, records ) {
			Ext.getStore( 'Library' ).generateNodesFromRecords( records )
		}
	}
});
