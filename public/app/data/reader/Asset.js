Ext.define('Spelled.data.reader.Asset', {
	extend: 'Spelled.data.reader.Reader',
	alias: 'reader.asset',

	read: function( response ) {
		return this.convertResponse( response, Ext.amdModules.assetConverter.toEditorFormat )
	}
});