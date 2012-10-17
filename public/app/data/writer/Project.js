Ext.define('Spelled.data.writer.Project', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.project',

	write: function( request ) {
		var data = this.convertRequest( request,  Ext.amdModules.projectConverter.toEngineFormat )

		return this.writeRecords( request, data )
	}
});