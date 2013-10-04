Ext.define('Spelled.data.writer.Writer', {
    extend: 'Ext.data.writer.Json',

	updateJSFiles: function( request, records ) {
		if( request.action == 'destroy' ) return

		Ext.Array.each(
			records,
			function( record ) {
				Spelled.StorageActions.update( { id: record.getAccordingJSFileName(), content: record.get( 'content' ) } )
			}
		)
	},

	convertRequest: function( request, converter ) {
		var operation = request.operation,
			records   = operation.records || [],
			self      = this

		var data = Ext.Array.map(
			records,
			function( record ) {
				var content = converter( self.getRecordData( record, operation ) )

				return { id: record.getId(), content: content }
			}
		)

		return data
	}
})