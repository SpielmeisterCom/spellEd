Ext.define('Spelled.data.writer.SystemTemplate', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.systemTemplate',
	requires: ['Spelled.Remoting'],

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.systemConverter.toEngineFormat )

		this.updateJSFiles( request, records )

		return this.writeRecords( request, data )
	}
});