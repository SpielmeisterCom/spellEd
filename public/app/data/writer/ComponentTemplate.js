Ext.define('Spelled.data.writer.ComponentTemplate', {
    extend: 'Ext.data.writer.Json',
	alias: 'writer.componentTemplate',

	write: function( request ) {
		var operation = request.operation,
			records   = operation.records || [],
			len       = records.length,
			i         = 0,
			data      = []

		for (; i < len; i++) {
			var record    = this.getRecordData( records[i], operation ),
				component = Ext.amdModules.componentConverter.toEngineFormat( record )

			data.push( { id: record.id, content: component } )
		}

		return this.writeRecords( request, data )
	}
});