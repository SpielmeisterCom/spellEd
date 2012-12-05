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

    fields: [
		{ name: 'type', type: 'string', defaultValue: 'project' },
        'name',
        'startScene',
		{ name: 'config', type: 'object', defaultValue: {} },
		{ name: 'assetIds', type: 'array', defaultValue: [] }
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
				scene.checkForComponentChanges()
			}
		)
	}
});
