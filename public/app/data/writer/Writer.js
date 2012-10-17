Ext.define('Spelled.data.writer.Writer', {
    extend: 'Ext.data.writer.Json',

	convertRequest: function( request, converter ) {
		var operation = request.operation,
			records   = operation.records || [],
			self      = this

		var data = _.map(
			records,
			function( record ) {
				var content = converter( self.getRecordData( record, operation ) )

				return { id: record.getId(), content: content }
			}
		)

		return data
	}
})