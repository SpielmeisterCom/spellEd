Ext.define('Spelled.data.writer.ComponentTemplate', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.componentTemplate',

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.componentConverter.toEngineFormat )

		this.updateJSFiles( request, records )

		return this.writeRecords( request, data )
	}
});