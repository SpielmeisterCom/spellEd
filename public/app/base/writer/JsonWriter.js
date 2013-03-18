Ext.define('Spelled.base.writer.JsonWriter', {
    override: 'Ext.data.writer.Json',

    getRecordData: function( record ) {
		Ext.apply( record.data, record.getAssociatedData() )
		record.data.version = Ext.app.CONFIGURATION.storageVersion
        return record.data
    }
});