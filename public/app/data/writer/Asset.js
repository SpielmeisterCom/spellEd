Ext.define('Spelled.data.writer.Asset', {
    extend: 'Ext.data.writer.Json',
	alias: 'writer.asset',

	write: function( request ) {
		var operation = request.operation,
			records   = operation.records || [],
			self      = this

		var data = _.map(
			records,
			function( record ) {
				var data  = self.getRecordData( record, operation ),
					asset = Ext.amdModules.assetConverter.toEngineFormat( data )

				return { id: record.getId(), content: asset }
			}
		)

		return this.writeRecords( request, data )
	}
});