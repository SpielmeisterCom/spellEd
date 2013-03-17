Ext.define('Spelled.data.writer.SystemTemplate', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.systemTemplate',
	requires: ['Spelled.Remoting'],

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.systemConverter.toEngineFormat )

		_.each(
			records,
			function( record ) {
				Spelled.StorageActions.update( { id: record.getAccordingJSFileName(), content: record.get( 'content' ) } )
			}
		)

		return this.writeRecords( request, data )
	}
});