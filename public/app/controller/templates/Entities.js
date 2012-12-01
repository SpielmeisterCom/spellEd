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
			showtemplatecomponents : this.showEntityTemplateComponentsListHelper,
			showcompositecomponents: this.showEntityCompositeComponentsListHelper,
			scope: this
		})
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
		this.application.sendDebugMessage(
			editView.down( 'container[name="entityPreviewContainer"]').getId(),
			'runtimeModule.start',
			this.createEntityTemplatePreviewItem( entityTemplate )
		)
	},

	convertEntity: function( entityId, template ) {
		var entity   = Ext.getStore( 'config.Entities' ).getById( entityId ),
			children = []

		entity.getChildren().each(
			function( child ) {
				children.push( child.clone( true ) )
			}
		)

		entity.copyComponentsToEntity( template )
		template.getChildren().add( children )

		entity.set( 'templateId', template.getFullName() )
		entity.resetConfig()
		entity.setDirty()
	},

	createEntityTemplatePreviewItem: function( entityTemplate ) {
		return this.createEntityPreviewItem( { name: "preview", templateId: entityTemplate.getFullName() } )
	},

	createEntityPreviewItem: function( entityConfig ) {
		var project       = this.application.getActiveProject(),
			sceneConfig   = {
				name: "dummyScene", namespace: '',
				systems: {
					update: [
						{ id: 'spell.system.debug.camera', config: { active: true } },
						{ id: 'spell.system.clearKeyInput', config: { active: true } }
					],
					render: []
				}
			},
			tmpProjectCfg = Ext.amdModules.projectConverter.toEngineFormat( project.getData( true ) ),
			scene         = this.application.getController( 'Scenes' ).prepareSceneObject( sceneConfig )

		scene.getEntities().add( entityConfig )

		tmpProjectCfg.startScene = scene.getFullName()
		tmpProjectCfg.scenes     = [ tmpProjectCfg.startScene ]
		scene.syncLibraryIds()

		return {
			runtimeModule: tmpProjectCfg,
			cacheContent: this.application.getController( 'Scenes' ).generateSceneCacheContent( scene, true )
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
			node   = me.application.getLastSelectedNode( me.getTemplatesTree() )

		record = this.application.getController( 'Entities' ).createEntityHelper( record, values )

		record.getOwner().save( {
			callback: function() {
				node.set( 'leaf', false )
				var entityNode = record.createTreeNode( node )
				entityNode.set( 'cls', me.application.getController('Templates').TYPE_ENTITY_COMPOSITE )

				me.getTemplatesTree().selectPath( node.appendChild( entityNode ).getPath() )

				window.close()
			}
		})

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

	removeEntityCompositeNode: function( node ) {
        var entity     = Ext.getStore( 'config.Entities' ).getById( node.getId() ),
			template   = entity.getOwner(),
			owner      = ( entity.hasEntity() ) ? entity.getEntity() : template,
            parentNode = node.parentNode,
			ownerNode  = this.getOwnerNode( node )

		if( !entity.isRemovable() ) return this.application.fireEvent( 'showentityremovealert', entity )

		owner.getChildren().remove( entity )
		Ext.getStore( 'config.Entities' ).remove( entity )
		template.setDirty()

		node.remove()

		if( !ownerNode.hasChildNodes() ) {
			ownerNode.set( 'cls', this.application.getController('Templates').TEMPLATE_TYPE_ENTITY )
		}

        this.getTemplatesTree().selectPath( parentNode.getPath() )
	},

    removeEntityTemplate: function( id ) {
		var entity = this.getTemplateEntitiesStore().getById( id )

		if( entity ) this.application.getController('Templates').removeTemplateCallback( entity )
    }
});
