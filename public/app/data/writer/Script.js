Ext.define('Spelled.data.writer.Script', {
    extend: 'Ext.data.writer.Json',
	alias: 'writer.script',

	write: function( request ) {
		var operation = request.operation,
			records   = operation.records || [],
			len       = records.length,
			i         = 0,
			data      = []

		for (; i < len; i++) {
			var record = this.getRecordData( records[i], operation ),
				script = Ext.copyTo({}, record, 'name,namespace,type')

			data.push( { id: record.id, content: script } )

			Spelled.StorageActions.update( { id: record.path, content: record.content } )
		}

		return this.writeRecords( request, data )
	}
});