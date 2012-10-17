Ext.define('Spelled.data.writer.Scene', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.scene',

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.sceneConverter.toEngineFormat )

		_.each(
			records,
			function( record ) {
				Spelled.StorageActions.update( { id: record.getAccordingJSFileName(), content: record.get( 'content' ) } )
			}
		)

		return this.writeRecords( request, data )
	}
});