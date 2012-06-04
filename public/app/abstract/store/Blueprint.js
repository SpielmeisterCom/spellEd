Ext.define('Spelled.abstract.store.Blueprint', {
    extend: 'Ext.data.Store',

    loadDataViaReader : function(data, append) {
        var me      = this,
            result  = me.proxy.reader.read(data),
            records = result.records;

        me.loadRecords(records, { addRecords: append })
        me.fireEvent('load', me, result.records, true)
    },

    getByBlueprintId: function( blueprintId ) {
        var index = this.findBy( function( record ) {
            return ( record.getFullName() === blueprintId )
        })

        if( index > -1 ) {
            return this.getAt( index )
        }
    }
});