Ext.define('Spelled.data.reader.EntityTemplate', {
    extend: 'Spelled.data.reader.Reader',
	alias: 'reader.entityTemplate',

	read: function( response ) {
		return this.convertResponse( response, Ext.amdModules.entityTemplateConverter.toEditorFormat )
	}
});