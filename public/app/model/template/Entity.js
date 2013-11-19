Ext.define('Spelled.model.template.Entity', {
	extend: 'Spelled.base.model.Template',
	requires: [
		'Spelled.data.writer.EntityTemplate',
		'Spelled.data.reader.EntityTemplate',
		'Spelled.base.model.Entity'
	],

	mixins: [ 'Spelled.base.model.Entity' ],

	fields: [
        "namespace",
        "name"
    ],

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
		type: 'storageaction',
		extraParams: {
			type: 'entityTemplate'
		},
		writer: {
			type: 'entityTemplate'
		},
		reader: {
			type: 'entityTemplate'
		}
    },

	getCalculatedDependencies: function() {
		//Needed for templates which aren't used in a scene to merge their config
		this.mergeChildrenComponentsConfig()

		var entity = Ext.create( 'Spelled.model.config.Entity', { templateId: this.getFullName() } )

		return entity.getCalculatedDependencies()
	},

	createDependencyNode: function() {
		var entity = Ext.create( 'Spelled.model.config.Entity', { templateId: this.getFullName() } )

		return entity.createDependencyNode()
	},

	getChild: function( id ) {

		var helperFunction = function( entity ) {
			var child = entity.getChildren().findRecord( 'id', id, null, null, null, true )

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
		this.checkForComponentChanges()
	},

	createTreeNode: function( node ) {
		var entityNode       = this.mixins.abstractModel.createTreeNode.call( this, node ),
			sortOrder        = this.sortOrder

		this.getChildren().each( function( entity ) {
			var childNode = entity.createTreeNode( entityNode )

			entityNode.set( 'leaf', false )

			Spelled.EntityHelper.markAsTemplateComposites( childNode, sortOrder )

			entityNode.appendChild( childNode )
		})

		return entityNode
	},

	toSpellEngineMessageFormat: function() {
		var data    = this.getData( true ),
			payload = Ext.amdModules.entityTemplateConverter.toEngineFormat( data )

		Ext.copyTo( payload, data, 'name,namespace' )

		return payload
	}
});
