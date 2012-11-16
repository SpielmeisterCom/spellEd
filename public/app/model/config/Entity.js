Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',
	requires: [
		'idgen.sequential',
		'association.belongsto',
		'association.hasmany',
		'Spelled.model.config.Component',
		'Spelled.model.config.Scene',
		'Spelled.model.template.Entity'
	],

    fields: [
        'templateId',
        'name',
		{ name: 'removable', type: 'boolean', defaultValue: true },
		{ name: 'isTemplateComposite', type: 'boolean', defaultValue: false}
    ],

	parsedData: false,

    idgen: {
		type: 'sequential',
		prefix: '_',
		id: 'configEntity'
	},

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

	getMessageData: function() {
		var data = Ext.amdModules.entityConverter.toEngineFormat( this.getData(true), { includeEntityIds: true } )

		if( this.hasEntity() ) data.parentId = this.getEntity().getId()

		return data
	},

	resetConfig: function() {
		this.set( 'config', {} )
		this.getComponents().removeAll()
		this.getChildren().removeAll()
	},

	clone: function( internal ) {
		var cloneConfig = Ext.amdModules.entityConverter.toEditorFormat( Ext.amdModules.entityConverter.toEngineFormat(this.getData( true )) )

		if( !internal ) cloneConfig.name = this.get('name') + "_copy"

		var copy = Ext.create( this.$className, cloneConfig )

		Ext.Array.each(
			copy.getComponents().add( cloneConfig.components ),
			function( component ) {
				component.setEntity( copy )
			}
		)

		this.getChildren().each(
			function( child ) {
				var childClone = child.clone( true )

				copy.getChildren().add( childClone )
				childClone.setEntity( copy )
			},
			this
		)

		copy.checkForComponentChanges()
		return copy
	},

	checkForComponentChanges : function() {
		this.getComponents().each(
			function( component ) {
				component.getConfigMergedWithTemplateConfig()
			}
		)

		this.getChildren().each( function( entity ) { entity.checkForComponentChanges() } )
	},

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

	setDirty: function() {
		this.getOwner().setDirty()

		this.callParent()
	},

	unDirty: function() {
		this.dirty = false
		this.getComponents().each( function( component ) { component.unDirty() } )
		this.getChildren().each( function( entity ) { entity.unDirty() } )
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
		if( !this.isAnonymous() ) {
			this.mergeEntityTemplateWithTemplateConfig( this.getEntityTemplate() )

		} else if( this.hasEntity() ) {
			var owner = this.getOwner()

			if( owner && !owner.isAnonymous() ) {
				var ownerTemplate = owner.getEntityTemplate(),
					entity        = ownerTemplate.getChildren().findRecord( 'name', this.get('name') )

				if( entity ) {
					this.mergeEntityTemplateWithTemplateConfig( entity )
				}
			}
		}
	},

	mergeEntityTemplateWithTemplateConfig: function( entityTemplate ) {
        var templateComponents = entityTemplate.getComponents(),
            components         = this.getComponents()

        templateComponents.each(
            function( templateComponent ) {
                var component = this.getComponentByTemplateId( templateComponent.get('templateId') )

                if( !component ) {

                    var newComponent = Ext.create( 'Spelled.model.config.Component', {
                        templateId: templateComponent.get('templateId')
                    })
					newComponent.setEntity( this )

                    components.add( newComponent )
                }
            },
            this
        )
    },

	getOwningScene: function() {
		if( this.hasScene() ) return this.getScene()
		else return this.getOwner().getOwningScene()
	},

    constructor: function() {
        this.callParent(arguments)

		if( !!this.raw )
        	Ext.getStore( 'config.Entities' ).add( this )
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
						return ( item.get('templateId') === entity.get('templateId') && item.get('name') === entity.get('name') )
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


		var iconCls = ""
		if ( !this.isRemovable() ) {
			iconCls = "tree-scene-entity-readonly-icon"
		} else {
			if (this.isAnonymous()) {
				iconCls = "tree-scene-entity-icon"
			} else {
				iconCls = "tree-scene-entity-linked-icon"
			}
		}

		var entityNode = node.createNode( {
				text      : this.get('name'),
				id        : this.getId(),
				iconCls   : iconCls,
				leaf      : false
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
