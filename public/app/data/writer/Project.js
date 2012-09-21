Ext.define('Spelled.data.writer.Project', {
    extend: 'Ext.data.writer.Json',
	alias: 'writer.project',

	write: function( request ) {
		var operation = request.operation,
			records   = operation.records || [],
			self      = this

		var data = _.map(
			records,
			function( record ) {
				var content = Ext.amdModules.projectConverter.toEngineFormat(
					self.getRecordData( record, operation )
				)

				return { id: record.getId(), content: content }
			}
		)

		return this.writeRecords( request, data )
	}
});