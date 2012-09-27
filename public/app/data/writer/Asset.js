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
				var asset = Ext.copyTo({}, self.getRecordData( record, operation ), 'type,subtype,doc')

				if( record.get( 'file' ) ) asset.file = record.get( 'file' )
				if( record.get( 'config' ) ) asset.config = record.get( 'config' )

				return { id: record.getId(), content: asset }
			}
		)

		return this.writeRecords( request, data )
	}
});