Ext.define('Spelled.data.writer.Script', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.script',
	requires: ['Spelled.Remoting'],

	write: function( request ) {
		var records = request.operation.records || [],
			data    = this.convertRequest( request,  Ext.amdModules.scriptConverter.toEngineFormat )

		this.updateJSFiles( request, records )

		return this.writeRecords( request, data )
	}
});