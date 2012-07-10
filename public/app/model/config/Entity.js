Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',

    fields: [
        'templateId',
        'name',
		{ name: 'removable', type: 'boolean', defaultValue: true },
		{ name: 'isTemplateComposite', type: 'boolean', defaultValue: false}
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
		},
		{
			type: 'belongsTo',
			model: 'Spelled.model.template.Entity',
			getterName: 'getOwnerEntity'
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

	isTemplateComposite: function() {
		return ( this.get( 'isTemplateComposite' ) === true )
	},

	getOwner: function() {

		if( this.isTemplateComposite() && this.hasEntity() && this.modelName === this.getEntity().modelName ) {
			return this.getEntity().getOwner()

		} else if( this.hasOwnerEntity() ) {
			return this.getOwnerEntity()
		}

		if( this.hasScene() )  return this.getScene()
		if( this.hasEntity() ) return this.getEntity()
	},

	setEntity: function( entity ) {
		this[ 'Spelled.model.config.EntityBelongsToInstance' ] = entity
	},

	setOwnerEntity: function( entity ) {
		this[ 'Spelled.model.template.EntityBelongsToInstance' ] = entity
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

	isAnonymous: function() {
		return ( Ext.isEmpty(this.get('templateId')) )
	},

	getEntityTemplate: function() {
		return Ext.getStore( 'template.Entities' ).getByTemplateId( this.get('templateId'))
	},

	hasScene: function() {
		return ( this[ 'Spelled.model.config.SceneBelongsToInstance' ] && Ext.isObject( this[ 'Spelled.model.config.SceneBelongsToInstance' ] ) )
	},

	hasEntity: function() {
		return ( this[ 'Spelled.model.config.EntityBelongsToInstance' ] && Ext.isObject( this[ 'Spelled.model.config.EntityBelongsToInstance' ] ) )
	},

	hasOwnerEntity: function() {
		return ( this[ 'Spelled.model.template.EntityBelongsToInstance' ] && Ext.isObject( this[ 'Spelled.model.template.EntityBelongsToInstance' ] ) )
	},

    mergeWithTemplateConfig: function() {
        var entityTemplate     = this.getEntityTemplate(),
            templateComponents = entityTemplate.getComponents(),
            components         = this.getComponents()

        templateComponents.each(
            function( templateComponent ) {
                var component = this.getComponentByTemplateId( templateComponent.get('templateId') )

                if( !component ) {

                    var newComponent = Ext.create( 'Spelled.model.config.Component', {
                        templateId: templateComponent.get('templateId'),
                        config: Ext.clone( templateComponent.get('config') )
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
		var result = Ext.clone( this.data )

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

	copyTemplateEntity: function() {
		var copy = Ext.create( 'Spelled.model.config.Entity', {
			templateId: this.get('templateId'),
			name : this.get('name'),
			removable : false
		})
		Ext.getStore( 'config.Entities' ).add( copy )
		return copy
	},

	isRemovable: function() {
		return ( this.get('removable') === true )
	},

	createTreeNode: function( node ) {
		var entityTemplate = this.getEntityTemplate(),
			children       = this.getChildren(),
			me             = this

		if( entityTemplate ) {
			entityTemplate.getChildren().each(
				function( entity ) {
					var index = children.findBy( function( item ) {
						return ( item.get('templateId') === entity.get('templateId') )
					})

					if( index > -1 ) {
						children.getAt( index ).set( 'removable', false )
						return
					}

					var copy = entity.copyTemplateEntity()
					copy.setEntity( me )
					children.add( copy )
				}
			)
		}

		var entityNode = node.createNode( {
				text      : this.get('name'),
				id        : this.getId(),
				iconCls   : ( this.isRemovable() ) ? "tree-scene-entity-icon" : "tree-scene-entity-readonly-icon",
				leaf      : !this.hasChildren()
			}
		)

		children.each(
			function( entity ) {
				entityNode.appendChild(
					entity.createTreeNode( entityNode )
				)
			}
		)

		return entityNode
	}
});
