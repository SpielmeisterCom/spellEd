Ext.define('Spelled.data.writer.ComponentTemplate', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.componentTemplate',

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.componentConverter.toEngineFormat )

		Ext.Array.each(
			records,
			function( record ) {
				Spelled.StorageActions.update( { id: record.getAccordingJSFileName(), content: record.get( 'content' ) } )
			}
		)
		return this.writeRecords( request, data )
	}
});