Ext.define('Spelled.data.reader.Project', {
    extend: 'Spelled.data.reader.Reader',
	alias: 'reader.project',

	read: function( response ) {
		var result = this.convertResponse( response, Ext.amdModules.projectConverter.toEditorFormat )

		if( !Ext.isArray(response) ) this.convertProjectAssociations( result )

		return result
	},

	convertProjectAssociations: function( result ) {

		Ext.Array.each(
			result.records,
			function( record ) {
				record.getScenes().removeAll()
				record.getScenes().add( this.makeAssoc( record.raw.scenes,  'config.Scenes', 'sceneId' ) )

				record.getSupportedLanguages().removeAll()
				record.getSupportedLanguages().add( this.makeAssoc( record.raw.supportedLanguages,  'Languages', 'id' ) )
			},
			this
		)
	},

	makeAssoc: function( items, storeId, idField ) {
		var results = []

		Ext.Array.each(
			items,
			function( id ) {
				var record = Ext.getStore( storeId ).findRecord( idField, id )
				if( record ) results.push( record )
			}
		)

		return results
	}
});