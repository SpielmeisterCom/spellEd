Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'templateId',
        'name'
    ],

	parsedData: false,

    idgen: 'uuid',

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
			type:"belongsTo",
			model:"Spelled.model.config.Scene",
			getterName: 'getScene'
		},
		{
			type: 'belongsTo',
			model: 'Spelled.model.config.Entity',
			getterName: 'getEntity'
		}
	],

	prepareAssociatedData: function() {
		var me               = this,
			associationData  = {}

		if( this.parsed === true) return associationData
		this.parsed = true

		this.associations.each(
			function( association ) {
				if ( association.type == 'hasMany' && me[ association.storeName ] ) {
					associationData[ association.name ] = Ext.Array.map(
						me[ association.storeName ].data.items,
						function( item ) {
							return Ext.apply( item.data, item.getAssociatedData() )
						}
					)
				} else if( association.type == 'belongsTo' ) {
					if( !!this[ association.instanceName ] )
						associationData[ association.name ] = me[ association.getterName ]()
				}
			}
		)

		this.parsed = false
		return associationData
	},

	setEntity: function( entity ) {
		this[ 'Spelled.model.config.EntityBelongsToInstance' ] = entity
	},

	setScene: function( scene ) {
		this[ 'Spelled.model.config.SceneBelongsToInstance' ] = scene
	},

    getComponentByTemplateId: function( templateId ) {
        var result = undefined
        this.getComponents().each(
            function( component ) {
                if( component.get('templateId') === templateId ) {
                    result = component
                    return false
                }
            }
        )

        return result
    },

	hasScene: function() {
		return ( this[ 'Spelled.model.config.SceneBelongsToInstance' ] && Ext.isObject( this[ 'Spelled.model.config.SceneBelongsToInstance' ] ) )
	},

	hasEntity: function() {
		return ( this[ 'Spelled.model.config.EntityBelongsToInstance' ] && Ext.isObject( this[ 'Spelled.model.config.EntityBelongsToInstance' ] ) )
	},

    mergeWithTemplateConfig: function() {
        var entityTemplate     = Ext.getStore( 'template.Entities' ).getByTemplateId( this.get('templateId')),
            templateComponents = entityTemplate.getComponents(),
            components         = this.getComponents()

        templateComponents.each(
            function( templateComponent ) {
                var component = this.getComponentByTemplateId( templateComponent.get('templateId') )

                if( !component ) {

                    var newComponent = Ext.create( 'Spelled.model.config.Component', {
                        templateId: templateComponent.get('templateId'),
                        config: templateComponent.get('config')
                    })
					newComponent.setEntity( this )

                    components.add( newComponent )
                }
            },
            this
        )
    },

    constructor: function() {
        this.callParent(arguments)

		if( !!this.raw )
        	Ext.getStore( 'config.Entities' ).add( this )
    },

    getJSONConfig: function() {
        var result = this.data

        result.components = []
		this.getComponents().each( function( component ){
            result.components.push( component.getJSONConfig() )
        })

		result.children = []
		this.getChildren().each( function( entity ){
			result.children.push( entity.getJSONConfig() )
		})

        return result
    },

	hasChildren: function() {
		return ( this.getChildren().count() > 0 )
	},

	createTreeNode: function( node ) {
		var entityNode = node.createNode( {
				text      : this.get('name'),
				id        : this.getId(),
				iconCls   : "tree-scene-entity-icon",
				leaf      : !this.hasChildren()
			}
		)

		this.getChildren().each(
			function( entity ) {
				entityNode.appendChild(
					entity.createTreeNode( entityNode )
				)
			}
		)

		return entityNode
	}
});
