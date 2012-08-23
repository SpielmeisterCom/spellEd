Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',

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
		}
	],

    init: function() {
        this.control({
            'createentity button[action="createEntity"]' : {
                click: this.createEntity
            },
            'entiteslist': {
                itemcontextmenu: this.showListContextMenu
			},
			'entityhastemplateheader tool[type="search"]': {
				showTemplateEntity: this.showTemplateEntity
			}
        })
    },

	showTemplateEntity: function( entityTemplateId ) {
		var entityTemplate = Ext.getStore( 'template.Entities' ).getById( entityTemplateId ),
			tree           = Ext.getCmp( 'TemplatesTree' ),
			node           = tree.getRootNode().findChild( 'id', entityTemplateId, true )

		if( entityTemplate && node ) {
			this.getNavigator().setActiveTab( Ext.getCmp( 'Templates' ) )

			if( node ) {
				tree.selectPath( node.getPath() )
				tree.getSelectionModel().deselectAll()
				tree.getSelectionModel().select( node )
			}
		}
	},

	showEntitiesFolderListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showEntitiesFolderListContextMenu( e )
	},

    showListContextMenu: function( view, record, item, index, e, options ) {
		var entity = Ext.getStore('config.Entities').getById( record.getId() )

		if( entity ) {
			this.application.getController('Menu').showEntitiesListContextMenu( entity, e )
		}
    },

    showCreateEntity: function( owner ) {
        var CreateView  = this.getEntityCreateView(),
        	createView  = new CreateView(),
			EntityModel = this.getConfigEntityModel(),
			newEntity   = new EntityModel()


        createView.down('form').loadRecord( newEntity )

		if( owner.modelName === newEntity.modelName ) {
			newEntity.setEntity( owner )
		} else {
			newEntity.setScene( owner )
		}

        createView.show()
    },

	createEntityHelper: function( record, values ) {
		if( !Ext.isEmpty( values.templateId ) ) {
			var entityTemplate = Ext.getStore('template.Entities').getById( values.templateId )
			record.set( 'templateId', entityTemplate.getFullName() )

			entityTemplate.getComponents().each(
				function( component ) {

					var newComponent = Ext.create( 'Spelled.model.config.Component', {
						templateId: component.get('templateId'),
						config: component.get('config')
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

		record.set( 'name', values.name )

		return record
	},

    createEntity: function ( button ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
			store  = this.getConfigEntitiesStore()

		record = this.createEntityHelper( record, values )
		store.add( record )

		var node = this.application.getLastSelectedNode( this.getScenesTree() )
		node.set( 'leaf', false )
		this.getScenesTree().selectPath( node.appendChild( record.createTreeNode( node )).getPath() )

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
