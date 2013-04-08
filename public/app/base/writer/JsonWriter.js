Ext.define('Spelled.base.writer.JsonWriter', {
  
	requires: ['Spelled.Configuration'],

	override: 'Ext.data.writer.Json',

	getRecordData: function( record ) {
		Ext.apply( record.data, record.getAssociatedData() )
		record.data.version = Spelled.Configuration.storageVersion
		return record.data
    }
});
