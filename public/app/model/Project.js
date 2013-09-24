Ext.define('Spelled.model.Project', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.storageaction',
		'Spelled.data.reader.Project',
		'Spelled.data.writer.Project'
	],

	proxy: {
        type: 'storageaction',
		extraParams: {
			type: 'project'
		},
		reader: 'project',
		writer: 'project'
    },

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'project' },
        'name',
        'startScene',
		'apiVersion',
		{ name: 'config', type: 'object', defaultValue: {} },
		{ name: 'assetIds', type: 'array', defaultValue: [] }
	],

	hasMany: [
		{
			model: 'Spelled.model.Language',
			name : 'getSupportedLanguages',
			associationKey: 'supportedLanguages'
		},
		{
			model: 'Spelled.model.config.Scene',
			name : 'getScenes',
			associationKey: 'scenes'
		}
	],

	save: function() {
		var config = this.get( 'config' )

		if( !config.projectId ) config.projectId = this.get( 'name' )

		this.callParent( arguments )
	},

	getDefaultLanguageKey: function() {
		return this.get( 'config' ).defaultLanguage
	},

	unDirty:function() {
		this.dirty = false
		this.getScenes().each( function( scene ){ scene.unDirty() } )
	},

	checkForComponentChanges: function() {
		this.getScenes().each(
			function( scene ) {
				scene.checkForComponentChanges()
			}
		)
	},

	getStartScene: function() {
		return Ext.getStore( 'config.Scenes' ).findRecord( 'sceneId', this.get( 'startScene' ) )
	}
})
