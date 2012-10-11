Ext.define('Spelled.model.template.Entity', {
    extend: 'Spelled.abstract.model.Template',

    fields: [
        "namespace",
        "name"
    ],

	sortOrder : 220,
	iconCls : "tree-scene-entity-icon",

	associations: [
		{
			type: 'hasMany',
			model: 'Spelled.model.config.Component',
			associationKey: 'components',
			name :  'getComponents'
		},
		{
			type: 'hasMany',
			model: 'Spelled.model.config.Entity',
			associationKey: 'children',
			name :  'getChildren'
		},
		{
			type: 'belongsTo',
			model: 'Spelled.model.config.Entity',
			getterName: 'getEntity'
		}
	],

	setEntity: function( entity ) {
		this[ 'Spelled.model.config.EntityBelongsToInstance' ] = entity
	},

	proxy: {
		type: 'direct',
		extraParams: {
			type: 'entityTemplate'
		},
		api: {
			create:  Spelled.StorageActions.create,
			read:    Spelled.StorageActions.read,
			update:  Spelled.StorageActions.update,
			destroy: Spelled.StorageActions.destroy
		},
		writer: {
			type: 'entityTemplate'
		},
		reader: {
			type: 'entityTemplate'
		}
    },

	getChild: function( id ) {

		var helperFunction = function( entity ) {
			var child = entity.getChildren().findRecord( 'name', id )

			if( !child ) {
				entity.getChildren().each(
					function( item ) {
						var result = helperFunction( item )

						if( !!result ) {
							child = result
							return false
						}
					}
				)
			}

			return child
		}

		return helperFunction( this )
	},

	mergeChildrenComponentsConfig: function() {
		this.getChildren().each(
			function( entity ){
				entity.checkForComponentChanges()
			}
		)
	},

	createTreeNode: function( node ) {
		var entityNode = this.mixins.abstractModel.createTreeNode.call( this, node),
			me         = this


		this.getChildren().each( function( entity ) {
			var childNode = entity.createTreeNode( node )
			entityNode.appendChild( childNode )

			var markAsComposites = function( compositeNode ) {
				compositeNode.set( 'cls', 'templateEntityComposite' )
				compositeNode.set( 'qtitle', me.sortOrder )
				compositeNode.set( 'id', entityNode.get('id') + compositeNode.get('text') )

				compositeNode.eachChild( function( item ) {
					markAsComposites( item )
				})
			}
			markAsComposites( childNode )
			entityNode.set( 'leaf', false )
		})

		node.appendChild( entityNode )
	}
});
