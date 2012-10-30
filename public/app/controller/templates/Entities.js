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
		this.application.getController( 'Scenes').engineMessageBus.send(
			editView.down( 'container[name="entityPreviewContainer"]').getId(),
			{
				type : 'spelled.debug.startRuntimeModule',
				payload : this.createEntityTemplatePreviewItem( entityTemplate )
			}
		)
	},

	createEntityTemplatePreviewItem: function( entityTemplate ) {
		var project       = this.application.getActiveProject(),
			sceneConfig   = { name: "dummyScene", namespace: '' },
			tmpProjectCfg = Ext.amdModules.projectConverter.toEngineFormat( project.getData( true ) ),
			scene         = this.application.getController( 'Scenes' ).prepareSceneObject( sceneConfig )

		scene.getEntities().add( { name: "preview", templateId: entityTemplate.getFullName() } )

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
		Ext.getStore( 'config.Entities' ).add( record )

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
		var templateEntity = this.getTemplateEntitiesStore().getById( this.getOwnerNode( node ).getId()  )

		var entity = templateEntity.getChild( node.get('text') )
		node.set('id', entity.getId())

		entity.set( 'isTemplateComposite' , true )
		entity.setOwnerEntity( templateEntity )

		if( entity ) {
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
        var entity    = Ext.getStore( 'config.Entities' ).getById( node.getId() ),
			template  = entity.getOwner(),
			owner     = ( entity.hasEntity() ) ? entity.getEntity() : template,
			ownerNode = node.parentNode

		if( !entity.isRemovable() ) return this.application.fireEvent( 'showentityremovealert', entity )

		owner.getChildren().remove( entity )
		Ext.getStore( 'config.Entities' ).remove( entity )
		template.setDirty()

		node.remove()

		if( !ownerNode.hasChildNodes() ) {
			ownerNode.set( 'cls', this.application.getController('Templates').TEMPLATE_TYPE_ENTITY )
			this.getTemplatesTree().selectPath( ownerNode.getPath() )
		}
	},

    removeEntityTemplate: function( id ) {
		var entity = this.getTemplateEntitiesStore().getById( id )

		if( entity ) this.application.getController('Templates').removeTemplateCallback( entity )
    }
});
