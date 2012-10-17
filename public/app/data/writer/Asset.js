Ext.define('Spelled.data.writer.Asset', {
    extend: 'Spelled.data.writer.Writer',
	alias: 'writer.asset',

	write: function( request ) {
		var data = this.convertRequest( request,  Ext.amdModules.assetConverter.toEngineFormat )

		return this.writeRecords( request, data )
	}
});