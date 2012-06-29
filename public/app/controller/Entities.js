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
		'entity.ComponentsList'
    ],

	refs: [
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		}
	],

    init: function() {
        this.control({
            'createentity button[action="createEntity"]' : {
                click: this.createEntity
            },
            'entiteslist': {
                itemcontextmenu: this.showListContextMenu
			}
        })
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

    createEntity: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
			store  = this.getConfigEntitiesStore()

		if( !Ext.isEmpty( values.templateId ) ) {
			var entityTemplate = Ext.getStore('template.Entities').getById( values.templateId )

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

			record.set('templateId', entityTemplate.getFullName() )
		}


		if( record.hasScene() ) {
			record.getScene().getEntities().add( record )
		} else {
			record.getEntity().getChildren().add( record )
		}

		record.set( values )
		store.add( record )

		this.application.getController('Projects').getScenesList( this.application.getActiveProject() )
		window.close()
    },

	getActiveEntity: function() {
		var node = Ext.getCmp('ScenesTree').getSelectionModel().getLastSelected()

		if( node ) {
			return this.getConfigEntitiesStore().getById( node.getId() )
		}
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
        var contentPanel = this.getRightPanel(),
			View         = this.getEntityComponentsListView(),
			components   = entity.getComponents()

		if( !Ext.isEmpty(entity.get('templateId')) )
			entity.mergeWithTemplateConfig()

		var view = new View()
		components.each(
			function( component ) {
				view.add( this.application.getController('Components').createConfigGridView( component ) )
			},
			this
		)

		view.sortByTitle()

		contentPanel.add( view )

		contentPanel.setTitle( 'Components in entity "' + entity.get('name') +'"' )
	}
});
