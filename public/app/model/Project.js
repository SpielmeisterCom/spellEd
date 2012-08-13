Ext.define('Spelled.model.Project', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'direct',
        api: {
            create:  Spelled.ProjectActions.create,
            read:    Spelled.ProjectActions.read,
            update:  Spelled.ProjectActions.update,
            destroy: Spelled.ProjectActions.destroy
        },
		reader: {
			read: function( response ) {
				var data

				response = Ext.amdModules.createProjectConverter.toEditorFormat(response )

				if (response) {
					data = response.responseText ? this.getResponseData(response) : this.readRecords(response);
				}

				return data || this.nullResultSet;
			}
		},
		writer: {
			write: function( request ) {
				var operation = request.operation,
					records   = operation.records || [],
					len       = records.length,
					i         = 0,
					data      = [];

				for (; i < len; i++) {
					data.push( Ext.amdModules.createProjectConverter.toEngineFormat( this.getRecordData(records[i], operation) ) );
				}
				return this.writeRecords(request, data);
			}
		}
    },

	save: function() {
		this.syncAssetIds()
		this.syncTemplateIds()

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

	syncAssetIds: function() {
		this.set( 'assetIds', this.getStoreIds( Ext.getStore( 'asset.Assets' ) ) )
	},

	syncTemplateIds: function() {
		var result = []

		this.set( 'templateIds', result.concat(
			this.getStoreIds( Ext.getStore( 'template.Components' ) ),
			this.getStoreIds( Ext.getStore( 'template.Entities' ) ),
			this.getStoreIds( Ext.getStore( 'template.Systems' ) )
		))
	},

    fields: [
        'name',
        'startScene',
		{ name: 'assetIds'   , type: 'array', defaultValue: [] },
		{ name: 'templateIds', type: 'array', defaultValue: [] }
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

		var checkEntity = function( entity ) {
			entity.getComponents().each(
				function( component ) {
					component.getConfigMergedWithTemplateConfig()
				}
			)

			entity.getChildren().each( checkEntity )
		}

		this.getScenes().each(
			function( scene ) {
				scene.getEntities().each( checkEntity )
			}
		)
	}
});
