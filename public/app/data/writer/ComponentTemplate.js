Ext.define('Spelled.data.writer.ComponentTemplate', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.componentTemplate',

	write: function( request ) {
		var data = this.convertRequest( request,  Ext.amdModules.componentConverter.toEngineFormat )

		return this.writeRecords( request, data )
	}
});