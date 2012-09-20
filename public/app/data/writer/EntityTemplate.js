Ext.define('Spelled.data.writer.EntityTemplate', {
    extend: 'Ext.data.writer.Json',
	alias: 'writer.entityTemplate',

	write: function( request ) {
		var operation = request.operation,
			records   = operation.records || [],
			len       = records.length,
			i         = 0,
			data      = []

		for (; i < len; i++) {
			var record = this.getRecordData( records[i], operation ),
				entity = Ext.copyTo({}, record, 'name,namespace,type,config,children')

			data.push( { id: record.id, content: entity } )
		}

		return this.writeRecords( request, data )
	}
});