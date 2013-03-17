Ext.define('Spelled.data.writer.Script', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.script',
	requires: ['Spelled.Remoting'],

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.scriptConverter.toEngineFormat )

		_.each(
			records,
			function( record ) {
				Spelled.StorageActions.update( { id: record.get('path'), content: record.get( 'content' ) } )
			}
		)

		return this.writeRecords( request, data )
	}
});