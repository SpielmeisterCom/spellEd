Ext.define('Spelled.model.config.Entity', {
    extend: 'Ext.data.Model',
	requires: [
		'idgen.sequential',
		'association.belongsto',
		'association.hasmany',
		'Spelled.model.config.Component',
		'Spelled.model.config.Scene',
		'Spelled.model.template.Entity',
		'Spelled.abstract.model.Entity'
	],

	mixins: [ 'Spelled.abstract.model.Entity', 'Spelled.abstract.model.Model' ],

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

	getCalculatedDependencies: function(){
		var ids   = [],
			merge = Ext.Array.merge

		if( !this.isAnonymous() ) {
			this.mergeChildren( this.getEntityTemplate() )
		}

		this.mergeWithTemplateConfig()

		this.getComponents().each(
			function( component ) {
				ids.push( this.get( 'templateId' ) )
				ids = merge( ids, component.getDependencies() )
			}
		)

		this.getChildren().each(
			function( entity ) {
				ids.push( entity.get( 'templateId' ) )
				ids = merge( ids, entity.getDependencies() )
			}
		)

		return Ext.Array.clean( ids )
	},

	getMessageData: function() {
		var data = Ext.amdModules.entityConverter.toEngineFormat( this.getData(true), { includeEntityIds: true } )

		if( this.hasEntity() ) data.parentId = this.getEntity().getId()

		return data
	},

	stripRedundantData: function() {
		this.getComponents().each(
			function( component ) {
				component.stripRedundantData()
			}
		)

		this.getChildren().each(
			function( entity ) {
				entity.stripRedundantData()
			}
		)
	},

	convertToAnonymousEntity: function() {
		var template   = this.getEntityTemplate(),
			components = this.getComponents(),
			children   = this.getChildren()

		this.set( 'templateId', '' )
		this.set( 'removable', true )

		template.getComponents().each(
			function( component ) {
				var componentId = component.get( 'templateId' ),
					cmp         = components.findRecord( 'templateId', componentId ) || Ext.create( 'Spelled.model.config.Component', {
						templateId: component.get( 'templateId' )
					})

				cmp.set( 'additional', true )
				cmp.set( 'config', Ext.Object.merge( {}, component.getConfigMergedWithTemplateConfig(), cmp.get( 'config' ) ) )

				this.getComponents().add( cmp )
				cmp.setEntity( this )

				cmp.stripRedundantData()
			},
			this
		)

		template.getChildren().each(
			function( item ) {
				var child = this.getChildren().findRecord( 'name', item.get( 'name' ) ) || item.clone( true )

				child.convertToAnonymousEntity()

				children.add( child )
			},
			this
		)

		this.setDirty()
	},

	resetConfig: function() {
		this.set( 'config', {} )
		this.getComponents().removeAll()
		this.getChildren().removeAll()
	},

	copyComponentsToEntity: function( entity ) {
		this.getComponents().each(
			function( component ) {
				var cmp = Ext.create( 'Spelled.model.config.Component', {
					templateId: component.get( 'templateId' ),
					additional: component.get( 'additional' )
				})

				cmp.set( 'config', component.getConfigMergedWithTemplateConfig() )
				entity.getComponents().add( cmp )
				cmp.setEntity( entity )

				cmp.stripRedundantData()
			}
		)
	},

	generateCloneName: function( name ) {
		if( this.hasEntity() ) {
			var found = this.getEntity().getChildren().findRecord( 'name', name )

			if( found )	{
				var parts    = name.split( "_"),
					lastPart = parts.pop(),
					counter  = parseInt( lastPart, 10),
					valid    = Ext.isNumber( counter ),
					index    = valid ? counter + 1 : 1

				if( !valid ) parts.push( lastPart )

				parts.push( index )
				return this.generateCloneName( parts.join( "_" ) )
			}
		}

		return name
	},

	clone: function( internal, removable ) {
		this.mergeWithTemplateConfig()

		var cloneConfig = Ext.amdModules.entityConverter.toEditorFormat( Ext.amdModules.entityConverter.toEngineFormat(this.getData( true )) )
		cloneConfig.removable = ( Ext.isDefined( removable ) ) ? !!removable : true

		if( !internal ) {
			var rqxp = /_copy_/g,
				name = this.get( 'name' )

			cloneConfig.name = this.generateCloneName( rqxp.test( name ) ? name : name + "_copy_1" )
		}

		var copy = Ext.create( this.$className, cloneConfig )

		this.copyComponentsToEntity( copy )

		this.getChildren().each(
			function( child ) {
				var childClone = child.clone( true, removable )

				copy.getChildren().add( childClone )
				childClone.setEntity( copy )
			},
			this
		)

		copy.checkForComponentChanges()
		return copy
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
		return Ext.isEmpty( this.get('templateId') )
	},

	getEntityTemplate: function() {
		var template = Ext.getStore( 'template.Entities' ).getByTemplateId( this.get('templateId') )

		if( !template ) Spelled.EntityHelper.missingTemplateError( this )

		return template
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

			if( owner && owner.isAnonymous && !owner.isAnonymous() ) {
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
                        templateId: templateComponent.get('templateId'),
						config: {}
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
		var copy = this.clone( true, false )
		Ext.getStore( 'config.Entities' ).add( copy )
		return copy
	},

	isRemovable: function() {
		return ( this.get('removable') === true )
	},

	mergeChildren: function( sourceEntity ) {
		var children = this.getChildren()

		if( sourceEntity ) {
			sourceEntity.getChildren().each(
				function( entity ) {
					var child = undefined,
						index = children.findBy( function( item ) {
							return ( item.get('templateId') === entity.get('templateId') && item.get('name') === entity.get('name') )
						})

					if( index > -1 ) {
						child = children.getAt( index )
						child.mergeEntityTemplateWithTemplateConfig( entity )
						child.set( 'removable', false )
					} else {
						child = entity.copyTemplateEntity()
						child.setEntity( this )
						children.add( child )
					}

					child.mergeChildren( entity )
				},
				this
			)
		}
	},

	createTreeNode: function( node ) {
		var iconCls = ""

		if( !this.isAnonymous() ) this.mergeChildren( this.getEntityTemplate() )

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
