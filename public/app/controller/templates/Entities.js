Ext.define('Spelled.controller.templates.Entities', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.model.template.Entity',
		'Spelled.model.config.Entity',

		'Spelled.store.template.Entities',

		'Spelled.view.template.entity.Add',
		'Spelled.view.template.entity.Edit'
	],

    models: [
        'template.Entity',
		'config.Entity'
    ],

    stores: [
        'template.Entities'
    ],

	views: [
		'template.entity.Add',
		'template.entity.Edit'
	],

	refs: [
		{
			ref : 'TemplateEditor',
			selector: '#SceneEditor'
		},
		{
			ref: 'TemplatesTree',
			selector: '#LibraryTree'
		}
	],

    init: function() {
        this.control({
			'addentitytotemplate button[action="addEntityToTemplate"]' : {
				click: this.addEntityToTemplate
			}
        })

		this.application.on( {
			initentitypreviewruntime: this.initEntityPreviewRuntime,
			showtemplatecomponents : this.showEntityTemplateComponentsListHelper,
			showcompositecomponents: this.showEntityCompositeComponentsListHelper,
			updateentitytemplatesenginewide: this.sendUpdateToAllEntitiesBasedOnTemplate,
			scope: this
		})
    },

	sendUpdateToAllEntitiesBasedOnTemplate: function( entityTemplate ) {
		if( !entityTemplate ) return

		var previewTab = this.application.findTabByTitle( this.getTemplateEditor(), entityTemplate.getFullName() ),
			type       = 'library.updateEntityTemplate',
			message    = { definition: entityTemplate.toSpellEngineMessageFormat() }

		if( previewTab ) {
			var iframe = previewTab.down( 'component[name="entityPreviewContainer"]' )
			this.application.sendDebugMessage( iframe.getId(), type, message )
		}

		this.application.fireEvent( 'sendToEngine', type, message )
	},

	openTemplate: function( entityTemplate ) {
		var templateEditor = this.getTemplateEditor(),
			project        = this.application.getActiveProject()

		var editView = Ext.widget( 'entitytemplateedit',  {
				title    : entityTemplate.getFullName(),
				template : entityTemplate,
				projectName : project.get( 'name' )
			}
		)

		this.application.createTab( templateEditor, editView )

		var containerId = editView.down( '[name="entityPreviewContainer"]').getId(),
			config      = this.createEntityTemplatePreviewItem( entityTemplate )

		this.initEntityPreviewRuntime( containerId, config.applicationModule, config.cacheContent )
	},

	initEntityPreviewRuntime: function( containerId, applicationModule, cacheContent ) {
		this.application.sendDebugMessage(
			containerId,
			'application.addToCache', {
				cacheContent: cacheContent
			}
		)

		this.application.sendDebugMessage(
			containerId,
			'application.startApplicationModule', {
				applicationModule: applicationModule
			}
		)
	},

	convertEntity: function( entityId, template ) {
		var entity   = Ext.getStore( 'config.Entities' ).getById( entityId ),
			children = []

		entity.mergeWithTemplateConfig()

		entity.getChildren().each(
			function( child ) {
				children.push( child.clone( true ) )
			}
		)

		entity.copyComponentsToEntity( template )
		template.getChildren().add( children )

		entity.set( 'templateId', template.getFullName() )
		entity.resetConfig()
	},

	createEntityTemplatePreviewItem: function( entityTemplate ) {
		return this.createEntityPreviewItem( { name: "preview", templateId: entityTemplate.getFullName(), preview: true } )
	},

	createEntityPreviewItem: function( entityConfig, dependencies ) {
		var dependencies  = Ext.isArray( dependencies ) ? dependencies : [],
			project       = this.application.getActiveProject(),
			sceneConfig   = {
				name: "dummyScene", namespace: '',
				dependencies: dependencies,
				systems: {
					update: [
						{ id: 'spell.system.debug.camera', config: { active: true } },
						{ id: 'spell.system.clearKeyInput', config: { active: true } }
					],
					render: []
				}
			},
			tmpProjectCfg = Ext.amdModules.projectConverter.toEngineFormat( project.getData( true ) ),
			scene         = this.application.getController( 'Scenes' ).prepareSceneObject( sceneConfig, true )

		scene.getEntities().add( entityConfig )

		tmpProjectCfg.startScene = scene.getFullName()
		tmpProjectCfg.scenes     = [ tmpProjectCfg.startScene ]
		scene.updateDependencies()

		return {
			applicationModule: tmpProjectCfg,
			cacheContent: this.application.getController( 'Scenes' ).generateSceneCacheContent( scene, { withScript: true, editorMode: true } )
		}
	},

	getOwnerNode: function( node ) {
		return ( node.get('cls') === this.application.getController( 'Templates' ).TEMPLATE_TYPE_ENTITY ) ? node : this.getOwnerNode( node.parentNode )
	},

	showAddEntity: function( owner ) {
		var createView  = Ext.widget( 'addentitytotemplate' ),
			EntityModel = this.getConfigEntityModel(),
			newEntity   = new EntityModel()

		createView.down('form').loadRecord( newEntity )
		newEntity.set( 'isTemplateComposite', true )
		newEntity.setEntity( owner )

		createView.show()
	},

	addEntityToTemplate: function( button ) {
		var window = button.up('addentitytotemplate'),
			form   = window.down('form'),
			record = form.getRecord(),
			values = form.getValues(),
			me     = this,
			node   = me.application.getLastSelectedNode( me.getTemplatesTree()),
			markAsComposite = function( node ) {
				node.set( 'cls', me.application.getController('Templates').TYPE_ENTITY_COMPOSITE )
			}

		record = this.application.getController( 'Entities' ).createEntityHelper( record, values )

		node.set( 'leaf', false )
		var entityNode = record.createTreeNode( node )
		markAsComposite( entityNode )
		entityNode.cascadeBy( markAsComposite )

		me.getTemplatesTree().selectPath( node.appendChild( entityNode ).getPath() )

		window.close()
	},

	showEntityTemplateComponentsListHelper: function( id ) {
		var entity = this.getTemplateEntitiesStore().getById( id )

		if( entity ) {
			entity.mergeChildrenComponentsConfig()
			this.showEntityTemplateComponentsList( entity )
		}
	},

	showEntityCompositeComponentsListHelper: function( node ) {
		var templateEntity = this.getTemplateEntitiesStore().getById( this.getOwnerNode( node ).getId() ),
            entity         = Ext.getStore( 'config.Entities' ).getById( node.getId() )

        templateEntity.mergeChildrenComponentsConfig()

		if( entity ) {
            entity.set( 'isTemplateComposite' , true )
            entity.setOwnerEntity( templateEntity )

			if( !entity.isAnonymous() ) entity.mergeWithTemplateConfig()

			this.showEntityTemplateComponentsList( entity )
		}
	},

	showEntityTemplateComponentsList: function( entity ) {
		var view = this.application.getController('Entities').createComponentsListView( entity )

		if( !!entity.isReadonly && entity.isReadonly() ) {
			view.disable()
			this.application.getController( 'Templates' ).addDisabledTemplateHeader( view )
		}
	},

	showRemoveEntityCompositeReferences: function( id ) {
		var entity   = Ext.getStore( 'config.Entities' ).getById( id ),
			template = Spelled.EntityHelper.getRootTemplateEntityFromEntity( entity )

		if( entity ) {
			if( this.application.getController( 'Templates' ).checkForReferences( template ) ) {
				this.confirmDeleteReference(
					Ext.bind(
						function( button ) {
							if( button != "cancel" ) {
								this.removeEntityCompositeHelper( entity, button === 'yes' )
							}
						},
						this
					)
				)
			} else {
				this.removeEntityCompositeHelper( entity, false )
			}
		}
	},

	showRemoveEntityTemplateReferences: function( id ) {
		var entity = this.getTemplateEntitiesStore().getById( id )

		if( entity ) {
			if( this.application.getController( 'Templates' ).checkForReferences( entity ) ) {
				this.confirmDeleteReference(
					Ext.bind(
						function( button ) {
							if( button != "cancel" ) this.removeEntityTemplate( entity, button === 'yes' )
						},
						this
					)
				)
			} else {
				this.removeEntityTemplate( entity, false )
			}
		}
	},

	removeEntityCompositeHelper: function( entity, copyIntoReferences ) {
		var node      = this.getTemplatesTree().getStore().getNodeById( entity.getId() ),
			ownerNode = this.getOwnerNode( node ),
			template  = this.getTemplateEntitiesStore().getById( ownerNode.getId()),
			entities  = Spelled.EntityHelper.getEntitesByTemplateId( template.getFullName() )

		if( !entity.isRemovable() ) return this.application.fireEvent( 'showentityremovealert', entity )

		if( copyIntoReferences ) {
			entities.each(
				function( item ) {
					this.convertEntityCompositeFromConfigEntity( item, entity )
				},
				this
			)
		} else {
			entities.each(
				function( item ) {
					this.removeEntityCompositeFromConfigEntity( item, entity )
				},
				this
			)
		}

		this.removeEntityCompositeNode( node )
	},

	convertEntityCompositeFromConfigEntity: function( entity, composite ) {
		var parents         = [],
			rootOwner       = Spelled.EntityHelper.getRootEntityOwnerFromEntity( composite, parents ),
			entityToConvert = Spelled.EntityHelper.findNeededEntity( entity, parents )

		if ( !entityToConvert ) return

		var nextTemplate = Spelled.EntityHelper.getNextEntityBasedTemplate( entity ,[] ),
			rootOwner    = Spelled.EntityHelper.getRootEntityOwnerFromEntity( entity, [] )
		//If next based template isn't the rootOwner and has a scene, its already existing as sibling in the nextTemplate
		if ( nextTemplate && rootOwner && nextTemplate !== rootOwner && rootOwner.hasScene() ) return

		entityToConvert.set( 'templateId', composite.get( 'templateId' ) )
		entityToConvert.set( 'removable', true )
		entityToConvert.setDirty()

		entityToConvert.mergeEntityTemplateWithTemplateConfig( composite )

		composite.getComponents().each(
			function( component ) {
				var cmp = entityToConvert.getComponentByTemplateId( component.get( 'templateId' ) )
				cmp.set( 'config', cmp.getConfigMergedWithTemplateConfig() )
				cmp.set( 'additional', true )
			}
		)

		this.application.fireEvent( 'updateentitynode', entityToConvert )
	},

	removeEntityCompositeFromConfigEntity: function( entity, composite ){
		var parents        = [],
			rootOwner      = Spelled.EntityHelper.getRootEntityOwnerFromEntity( composite, parents ),
			entityToRemove = Spelled.EntityHelper.findNeededEntity( entity, parents )

		if( entityToRemove ) this.application.getController( 'Entities' ).removeEntityHelper( entityToRemove )
	},

	removeEntityCompositeNode: function( node ) {
        var entity     = Ext.getStore( 'config.Entities' ).getById( node.getId() ),
			template   = entity.getOwner(),
			owner      = ( entity.hasEntity() ) ? entity.getEntity() : template,
            parentNode = node.parentNode,
			ownerNode  = this.getOwnerNode( node )

		owner.getChildren().remove( entity )
		Ext.getStore( 'config.Entities' ).remove( entity )
		template.setDirty()

		node.remove()

		if( !ownerNode.hasChildNodes() ) {
			ownerNode.set( 'cls', this.application.getController('Templates').TEMPLATE_TYPE_ENTITY )
		}

        this.getTemplatesTree().selectPath( parentNode.getPath() )
	},

	removeEntityTemplate: function( entityTemplate, copyIntoReferences ) {
		var entities           = Spelled.EntityHelper.getEntitesByTemplateId( entityTemplate.getFullName() ),
			entitiesController = this.application.getController( 'Entities' )

		if( !copyIntoReferences ) {
			entities.each(
				function( entity ) {
					entitiesController.removeEntityHelper( entity )
				},
				this
			)
		} else {
			entities.each(
				function( entity ) {
					entity.convertToAnonymousEntity()
					this.fireEvent( 'updateentitynode', entity )
				},
				this.application
			)
		}

		this.application.fireEvent( 'templateremove', entityTemplate )
	},

	confirmDeleteReference: function( callback ) {
		Ext.Msg.confirm(
			'What should happen to the References?',
			'Should the editor make a copy in all referenced entities? Choose "no" if all references should be removed.',
			function( button ) {
				if( button != "cancel" ) callback( button )
			},
			this
		)
	}
});
