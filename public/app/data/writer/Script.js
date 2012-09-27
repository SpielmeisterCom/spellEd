Ext.define('Spelled.data.writer.Script', {
    extend: 'Ext.data.writer.Json',
	alias: 'writer.script',

	write: function( request ) {
		var operation = request.operation,
			records   = operation.records || [],
			self      = this

		var data = _.map(
			records,
			function( record ) {
				var script = Ext.copyTo({}, self.getRecordData( record, operation ), 'type')

				Spelled.StorageActions.update( { id: record.get('path'), content: record.get( 'content' ) } )

				return { id: record.getId(), content: script }
			}
		)

		return this.writeRecords( request, data )
	}
});