Ext.define('Spelled.model.Project', {
    extend: 'Ext.data.Model',
	requires: [
		'proxy.direct',
		'Spelled.data.reader.Project',
		'Spelled.data.writer.Project'
	],

	proxy: {
        type: 'direct',
		extraParams: {
			type: 'project'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		reader: 'project',
		writer: 'project'
    },

	save: function() {
		this.syncLibraryIds()

		this.callParent( arguments )
	},

	getStoreIds: function( store ) {
		var array = []
		store.each(
			function( asset ) {
				array.push( asset.getFullName() )
			},
			this
		)

		return array
	},

	syncLibraryIds: function() {
		var result = []

		this.set( 'libraryIds', result.concat(
			this.getStoreIds( Ext.getStore( 'template.Components' ) ),
			this.getStoreIds( Ext.getStore( 'template.Entities' ) ),
			this.getStoreIds( Ext.getStore( 'template.Systems' ) ),
			this.getStoreIds( Ext.getStore( 'asset.Assets' ) ),
			this.getStoreIds( Ext.getStore( 'config.Scenes' ) )
		))
	},

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'project' },
        'name',
        'startScene',
		{ name: 'config', type: 'object', defaultValue: {} },
		{ name: 'assetIds', type: 'array', defaultValue: [] },
		{ name: 'libraryIds', type: 'array', defaultValue: [] }
	],

    hasMany: {
        model: 'Spelled.model.config.Scene',
        name : 'getScenes',
        associationKey: 'scenes'
    },

	unDirty:function() {
		this.dirty = false
		this.getScenes().each( function( scene ){ scene.unDirty() } )
	},

	checkForComponentChanges: function() {
		this.getScenes().each(
			function( scene ) {
				scene.getEntities().each(
					function( entity ) {
						entity.checkForComponentChanges()
					}
				)
			}
		)
	}
});
