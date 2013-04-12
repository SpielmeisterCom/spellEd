Ext.define('Spelled.data.writer.Scene', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.scene',
	requires: ['Spelled.Remoting'],

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.sceneConverter.toEngineFormat )

		Ext.Array.each(
			records,
			function( record ) {
				Spelled.StorageActions.update( { id: record.getAccordingJSFileName(), content: record.get( 'content' ) } )
			}
		)

		return this.writeRecords( request, data )
	}
});