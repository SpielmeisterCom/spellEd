Ext.define('Spelled.data.writer.SystemTemplate', {
    extend: 'Ext.data.writer.Json',
	alias: 'writer.systemTemplate',

	write: function( request ) {
		var operation = request.operation,
			records   = operation.records || [],
			self      = this

		var data = _.map(
			records,
			function( record ) {
				var content = Ext.amdModules.systemConverter.toEngineFormat(
					self.getRecordData( record, operation )
				)

				Spelled.StorageActions.update( { id: record.getAccordingJSFileName(), content: record.get( 'content' ) } )

				return { id: record.getId(), content: content }
			}
		)

		return this.writeRecords( request, data )
	}
});