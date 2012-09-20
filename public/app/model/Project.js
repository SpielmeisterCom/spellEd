Ext.define('Spelled.model.Project', {
    extend: 'Ext.data.Model',
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
		reader: {
			read: function( response ) {
				var data

				if( Ext.isArray( response ) ) {
					var tmpResponse = []
					Ext.Array.each(
						response,
						function( item ) {
							tmpResponse.push( Ext.amdModules.projectConverter.toEditorFormat( item, true ) )
						},
						this
					)

					data = this.readRecords( tmpResponse)

				} else {
					response = Ext.amdModules.projectConverter.toEditorFormat( response )

					if (response) {
						data = response.responseText ? this.getResponseData(response) : this.readRecords(response);
					}
				}

				return data || this.nullResultSet;
			}
		},
		writer: {
			write: function( request ) {
				var operation = request.operation,
					records   = operation.records || [],
					self      = this

				var data = _.map(
					records,
					function( record ) {
						return Ext.amdModules.projectConverter.toEngineFormat(
							self.getRecordData( record, operation )
						)
					}
				)

				return this.writeRecords( request, data )
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
		{ name: 'config', type: 'object', defaultValue: {} },
		{ name: 'assetIds'   , type: 'array', defaultValue: [] },
		{ name: 'templateIds', type: 'array', defaultValue: [] }
	],

    hasMany: {
        model: 'Spelled.model.config.Scene',
        name : 'getScenes',
        associationKey: 'scenes'
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
