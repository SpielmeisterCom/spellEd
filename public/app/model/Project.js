Ext.define('Spelled.model.Project', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.ProjectActions.create,
            read:    Spelled.ProjectActions.read,
            update:  Spelled.ProjectActions.update,
            destroy: Spelled.ProjectActions.destroy
        }
    },

    fields: [
        'name',
        'startScene'
    ],

    idProperty: 'name',

    hasMany: {
        model: 'Spelled.model.config.Scene',
        name : 'getScenes',
        associationKey: 'scenes'
    },

    getConfigName: function() {
        return 'project.json'
    },

	checkForComponentChanges: function() {
		this.getScenes().each(
			function( scene ) {
				scene.getEntities().each(
					function( entity ) {
						entity.getComponents().each(
							function( component ) {
								component.markChanges()
							}
						)
					}
				)
			}
		)
	}
});
