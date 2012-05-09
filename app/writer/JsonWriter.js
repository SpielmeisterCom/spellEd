Ext.define('Spelled.writer.JsonWriter', {
    override: 'Ext.data.writer.Json',

    getRecordData: function( record ) {
        Ext.apply( record.data, record.getAssociatedData() )
        return record.data
    }
});