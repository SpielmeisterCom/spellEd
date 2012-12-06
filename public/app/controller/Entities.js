Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.model.config.Component',
		'Spelled.model.config.Entity',
		'Spelled.model.template.Entity',
		'Spelled.store.config.Entities',
		'Spelled.store.template.Entities',
		'Spelled.view.entity.Create',
		'Spelled.view.entity.Convert',
		'Spelled.view.entity.ComponentsList',
		'Spelled.view.entity.HasTemplateHeader'
	],

    models: [
        'config.Entity',
        'template.Entity'
    ],

    stores: [
       'config.Entities',
       'template.Entities'
    ],

    views: [
        'entity.Create',
		'entity.Convert',
		'entity.ComponentsList',
		'entity.HasTemplateHeader'
    ],

	refs: [
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref: 'ScenesTree',
			selector: '#ScenesTree'
		},
		{
			ref: 'Navigator',
			selector: '#Navigator'
		},
		{
			ref: 'TemplatesTree',
			selector: '#LibraryTree'
		},
		{
			ref: 'Library',
			selector: '#Library'
		}
	],

    init: function() {
		var me               = this,
			engineMessageBus = me.application.engineMessageBus

	    this.control({
		    'createentity button[action="createEntity"]' : {
			    click: this.createEntity
		    },
		    'entiteslist': {
			    itemcontextmenu: this.showListContextMenu
		    },
		    'entityhastemplateheader tool[type="search"]': {
			    showTemplateEntity: this.showTemplateEntity
		    },
		    'entitieslistcontextmenu [action="showConvertEntity"]': {
			    click: this.showConvertEntity
		    },
		    'scenetreelist': {
			    edit: this.changeEntityName
		    },
		    'scenetreelist [action="showCreateEntity"]': {
			    click: me.showCreateEntityHelper
		    }
	    })

		this.application.on({
			updateentitynode       : this.updateEntityNode,
			triggerrenamingentity  : this.triggerRenameEntityEvent,
			refreshentitynode      : this.refreshEntityNode,
			showentityinfo         : this.showEntityInfo,
			cloneconfigentity      : this.cloneEntityConfig,
			showentityremovealert  : this.showEntityRemoveAlert,
			removeentity           : this.removeEntity,
			movesceneentity        : this.moveEntity,
			scope: this
		})

		engineMessageBus.addHandler(
			{
				'spelled.entity.update' : function( sourceId, payload ) {
					var id          = payload.id,
						componentId = payload.componentId,
						config      = payload.config

					me.updateEntityComponent( id, componentId, config )
				},
				'spelled.debug.entity.clone': function ( sourceId, payload ) {
					var tree = me.getScenesTree(),
						node = tree.getStore().getNodeById( payload.id )

					if( node ) me.cloneEntityConfig( node.getId(), node )
				},
				'spelled.debug.entity.remove': function ( sourceId, payload ) {
					var entity = me.getConfigEntitiesStore().getById( payload.id )

					if( entity ) me.removeEntity( entity )
				}
			}
		)
    },

	updateEntityNode: function( entity ) {
		var node = this.getScenesTree().getStore().getNodeById( entity.getId() )

		if( node ) {
			var parent = node.parentNode

			node.removeAll()
			node.remove()

			parent.appendChild( entity.createTreeNode( parent ) )
		}
	},

	showCreateEntityHelper: function() {
		var scene = this.application.getRenderedScene()
		this.showCreateEntity( scene )
	},

	updateEntityComponent:function( id, componentId, config ){
		var entity           = this.getConfigEntitiesStore().getById( id ),
			component        = entity.getComponentByTemplateId( componentId ),
			componentConfig  = component.get( 'config' ),
			tree             = this.getScenesTree(),
			lastSelectedNode = this.application.getLastSelectedNode( tree )

		Ext.Object.each(
			config,
			function( key, value ) {
				componentConfig[ key ] = value
			}
		)

		entity.setDirty()

		if( lastSelectedNode.getId() === id ) this.application.fireEvent( 'componentpropertygridupdate', component, componentConfig, false )
	},

	triggerRenameEntityEvent: function( node ) {
		var cellEditor = this.getScenesTree().getPlugin( 'renamePlugin' )
		cellEditor.startEdit( node, 0 )
	},

	changeEntityName: function( editor, e ) {
		var entity = this.getConfigEntitiesStore().getById( e.record.getId() )

		entity.set( 'name', e.record.get('text') )
		entity.setDirty()

		this.sendEntityEventToEngine(
			'component.update' , {
				entityId    : entity.getId(),
				componentId : 'spell.component.entityMetaData',
				config      : { name: entity.get( 'name' ) }
			}
		)

		e.record.commit()
	},

	refreshEntityNode: function( id ) {
		var tree     = this.getScenesTree(),
			rootNode = tree.getRootNode(),
			node     = rootNode.findChild( 'id', id, true ),
			parent   = node.parentNode,
			index    = parent.indexOf( node ),
			entity   = this.getConfigEntitiesStore().getById( id )

		node.remove( true )

		var newNode = entity.createTreeNode( parent )
		parent.insertChild( index, newNode )
		tree.selectPath( newNode.getPath() )
	},

	showConvertEntity: function() {
		var node   = this.application.getLastSelectedNode( this.getScenesTree() ),
			view   = Ext.widget( 'convertentity' )

		view.down('form').getForm().setValues( { type:'entityTemplate', owner: node.getId() } )
	},

	cloneEntityConfig: function( id, node ) {
		var store      = this.getConfigEntitiesStore(),
			entity     = store.getById( id ),
			owner      = entity.getOwner(),
			clone      = entity.clone(),
			clonedNode = clone.createTreeNode(node),
			ownerStore = undefined

		if( entity.hasScene() ) {
			ownerStore = owner.getEntities()
			clone.setScene( owner )
		} else {
			ownerStore = owner.getChildren()
			clone.setEntity( owner )
		}

		ownerStore.insert( ownerStore.indexOf( entity ) + 1, clone )

		node.parentNode.insertBefore( clonedNode, node.nextSibling )
		clone.setDirty()
		store.add( clone )

		this.sendCreateMessage( clone )
	},

	sendCreateMessage: function( entity ) {
		this.sendEntityEventToEngine( 'entity.create', { entityConfig: entity.getMessageData() } )
	},

	isSceneTarget: function( targetId ) {
		var node   = this.getScenesTree().getStore().getById( targetId ),
			scenes = this.application.getController( 'Scenes' )

		return scenes.getTreeItemType( node ) === scenes.TREE_ITEM_TYPE_ENTITIES
	},

	moveEntity: function( targetId, entityId, dropPosition ) {
		var store         = this.getConfigEntitiesStore(),
			isSceneTarget = this.isSceneTarget( targetId ),
			target        = ( isSceneTarget ) ? null : store.getById( targetId ),
			entity        = store.getById( entityId ),
			owner         = entity.getOwner(),
			targetOwner   = ( isSceneTarget ) ? null : target.getOwner(),
			entities      = ( entity.hasScene() ) ? owner.getEntities() : owner.getChildren(),
			renderedScene = this.application.getRenderedScene(),
			targetScene   = this.application.getLastSelectedScene(),
			fromScene     = entity.getOwningScene()

		entities.remove( entity )
		fromScene.setDirty()
		targetScene.setDirty()

		delete entity[ 'Spelled.model.config.EntityBelongsToInstance' ]
		delete entity[ 'Spelled.model.template.EntityBelongsToInstance' ]
		delete entity[ 'Spelled.model.config.SceneBelongsToInstance' ]

		if( isSceneTarget ) {
			target = this.getStore( 'config.Scenes' ).getById( this.getScenesTree().getStore().getById( targetId ).parentNode.getId() )

			target.getEntities().add( entity )
			entity.setScene( target )
		} else if( dropPosition === "append" ) {
			entity.setEntity( target )
			target.getChildren().add( entity )
		} else {
			var offset         = ( dropPosition === 'after' ) ? 1 : 0,
				hasScene       = target.hasScene(),
				targetEntities = ( hasScene ) ? targetOwner.getEntities() : targetOwner.getChildren()

			if( hasScene ) entity.setScene( targetOwner )
			else entity.setEntity( targetOwner )

			targetEntities.insert( targetEntities.indexOf( target ) + offset, entity )
		}

		if( fromScene == targetScene && renderedScene == targetScene ) {
			this.sendEntityEventToEngine( 'entity.reassign', {
				entityId: entity.getId(),
				parentEntityId: ( entity.hasEntity() ) ? entity.getEntity().getId() : undefined
			} )

		} else if( renderedScene == targetScene ) {
			this.sendCreateMessage( entity )

		} else if( renderedScene === fromScene ) {
			this.application.fireEvent( 'sendToEngine', 'entity.remove', { entityId: entity.getId() } )
		}

		target.setDirty()
	},

	sendEntityEventToEngine: function( type, payload ) {
		if( this.application.isRenderedSceneLastSelectedScene() ) this.application.fireEvent( 'sendToEngine', type, payload )
	},

	removeEntityHelper: function( entity ) {
		this.sendEntityEventToEngine( 'entity.remove', { entityId: entity.getId() } )

		entity.getOwner().setDirty()
		this.deleteEntity( entity )
		var node = this.getScenesTree().getStore().getNodeById( entity.getId() )

		node.remove()
	},

	removeEntity: function( entity ) {
		if( !entity.isRemovable() ) {
			Ext.Msg.alert(
				"Remove not allowed",
				"The entity '" + entity.get('name') + "' is locked to a template and can't be removed!"
			)
		} else {
			Ext.Msg.confirm(
				'Remove '+ entity.get('name'),
				'Do you really want to remove the entity "' + entity.get('name') + '"?',
				function( button ) {
					if ( button === 'yes' ) {
						if( entity ) {
							this.removeEntityHelper( entity )
						}
					}
				},
				this
			)
		}
	},

	showEntityRemoveAlert: function( entity ) {
		Ext.Msg.alert( "Can not remove: '" + entity.get( 'name' ) + "'", "Is linked to a entityTemplate: '" + entity.getOwner().get( 'name' ) + "'" )
	},

	showTemplateEntity: function( entityTemplateId ) {
		var entityTemplate = this.getTemplateEntitiesStore().getById( entityTemplateId ),
			tree           = this.getTemplatesTree(),
			node           = tree.getRootNode().findChild( 'id', entityTemplateId, true )

		if( entityTemplate && node ) {
			this.getNavigator().setActiveTab( this.getLibrary() )

			if( node ) {
				this.application.selectNode( tree, node )
				this.application.fireEvent( 'templatedblclick', this.getNavigator(), node )
			}
		}
	},

	showEntitiesFolderListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showEntitiesFolderListContextMenu( e )
	},

    showListContextMenu: function( view, record, item, index, e, options ) {
		var entity = this.getConfigEntitiesStore().getById( record.getId() )

		if( entity ) {
			this.application.getController('Menu').showEntitiesListContextMenu( entity, e )
		}
    },

    showCreateEntity: function( owner ) {
        var CreateView  = this.getEntityCreateView(),
        	createView  = new CreateView(),
			EntityModel = this.getConfigEntityModel(),
			newEntity   = new EntityModel(),
			sceneCombo  = createView.down( 'combobox[name="scene"]' )

        createView.down('form').loadRecord( newEntity )

		if( owner.modelName === newEntity.modelName ) {
			newEntity.setEntity( owner )
			sceneCombo.hide()
		} else {
			newEntity.setScene( owner )
			sceneCombo.setValue( owner.getFullName() )
		}

        createView.show()
    },

	createEntityHelper: function( record, values ) {
		Ext.getStore( 'template.Entities' ).clearFilter( true )

		if( !Ext.isEmpty( values.templateId ) ) {
			var entityTemplate = this.getTemplateEntitiesStore().getById( values.templateId )
			record.set( 'templateId', entityTemplate.getFullName() )

			entityTemplate.getComponents().each(
				function( component ) {

					var newComponent = Ext.create( 'Spelled.model.config.Component', {
						templateId: component.get('templateId'),
						config: Ext.clone( component.get('config') )
					} )

					newComponent.setEntity( record )
					record.getComponents().add( newComponent )
				}
			)
		}


		if( record.hasScene() ) {
			record.getScene().getEntities().add( record )
		} else {
			record.getEntity().getChildren().add( record )
		}

		record.getOwner().setDirty()

		record.set( 'name', values.name )

		this.getConfigEntitiesStore().add( record )
		this.sendCreateMessage( record )

		return record
	},

    createEntity: function ( button ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
			scene  = Ext.getStore( 'config.Scenes' ).findRecord( 'sceneId', values.scene )

		record = this.createEntityHelper( record, values )

		if( scene ) record.setScene( scene )

		var node = ( values.owner ) ? this.application.getLastSelectedNode( this.getScenesTree() )
			: this.getScenesTree().getStore().getNodeById( ( scene ) ? scene.getId() + "_entities" : record.getEntity().getId() )

		node.set( 'leaf', false )

		var entityNode = record.createTreeNode( node ),
			newNode    = node.appendChild( entityNode ).getPath()

		this.getScenesTree().selectPath( newNode )
		window.close()
    },

    deleteEntity: function ( entity ) {
		this.getConfigEntitiesStore().remove( entity )

		if( entity.hasScene() ) {
			entity.getScene().getEntities().remove( entity )
		} else if( entity.hasEntity() ) {
			entity.getEntity().getChildren().remove( entity )
		}
	},

	showEntityInfo: function( id ) {
		var entity = this.getConfigEntitiesStore().getById( id )

		if( entity ) {
			this.showComponentsList( entity )
			return entity
		}
	},

    showComponentsList: function( entity ) {
		entity.mergeWithTemplateConfig()

		this.createComponentsListView( entity )
	},

	createComponentsListView: function( entity ) {
		var contentPanel = this.getRightPanel(),
			View         = this.getEntityComponentsListView(),
			components   = entity.getComponents()

		var view = new View()

		if( !!entity.isAnonymous ) {
			view.docString = ( entity.isAnonymous() ) ? view.docString : "#!/guide/" + entity.getEntityTemplate().getDocumentationName()

			if( !entity.isAnonymous() ) {
				view.add( {
						xtype: 'entityhastemplateheader',
						entityTemplateId: entity.getEntityTemplate().getId(),
						html:  entity.getEntityTemplate().getFullName()
					}
				)
			}
		} else {
			view.docString = "#!/guide/" + entity.getDocumentationName()
		}

		components.each(
			function( component ) {
				component.setEntity( entity )
				view.add( this.application.getController('Components').createConfigGridView( component ) )
			},
			this
		)

		view.sortByTitle()
		view.entity = entity

		contentPanel.add( view )

		contentPanel.setTitle( 'Components in entity "' + entity.get('name') +'"' )

		return view
	}
});
