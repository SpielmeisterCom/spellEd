Ext.define('Spelled.data.reader.Scene', {
    extend: 'Spelled.data.reader.Reader',
	alias: 'reader.scene',

	read: function( response ) {
		return this.convertResponse( response, Ext.amdModules.sceneConverter.toEditorFormat )
	}
});