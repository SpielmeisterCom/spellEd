Ext.define('Spelled.data.writer.EntityTemplate', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.entityTemplate',

	write: function( request ) {
		var data = this.convertRequest( request,  Ext.amdModules.entityTemplateConverter.toEngineFormat )

		return this.writeRecords( request, data )
	}
});