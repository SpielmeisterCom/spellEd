Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',

    models: [
        'config.Entity',
        'blueprint.Entity'
    ],

    stores: [
       'EntitiesTree',
       'config.Entities',
       'blueprint.Entities'
    ],

    views: [
        'entity.Create',
		'entity.ComponentsList'
    ],

    init: function() {
        this.control({
            '#EntityList': {
                deleteclick:     this.deleteEntityActionIconClick,
                itemmouseenter:  this.application.showActionsOnFolder,
                itemmouseleave:  this.application.hideActions
            },
            '#ZonesTree button[action="showCreateEntity"]': {
                click: this.showCreateEntity
            },
            'createentity button[action="createEntity"]' : {
                click: this.createEntity
            },
            'entiteslist': {
                itemcontextmenu: this.showListContextMenu
            }
        })
    },

    deleteEntityActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        var entity = Ext.getStore('config.Entities').getById( node.get('id') )

        if( !entity ) return

        this.deleteEntity( entity )
    },

    showListContextMenu: function( view, record, item, index, e, options ) {

        if( !record.data.leaf ) {
            var entity = Ext.getStore('config.Entities').getById( record.getId() )

            if( entity ) {
                var menuController = this.application.getController('Menu')
                menuController.showEntitiesListContextMenu( entity, e )
            }

        } else {
            var component = Ext.getStore('config.Components').getById( record.getId() )

            if( component ) {
                var menuController = this.application.getController('Menu')
                menuController.showComponentContextMenu( component, e )
            }
        }

    },

    showCreateEntity: function( ) {
        var CreateView = this.getEntityCreateView(),
        	createView = new CreateView()

        var EntityModel = this.getConfigEntityModel()
        createView.down('form').loadRecord( new EntityModel() )

        createView.show()
    },

    createEntity: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
			store  = this.getConfigEntitiesStore()

        var entityBlueprint = Ext.getStore('blueprint.Entities').getById( values.blueprintId )
		var zone = Ext.getStore('config.Zones').getById( values.zoneId )

        if( entityBlueprint && zone ) {
            entityBlueprint.getComponents().each(
                function( component ) {

                    var newComponent = Ext.create( 'Spelled.model.config.Component', {
                        blueprintId: component.get('blueprintId'),
                        config: component.get('config')
                    } )

                    record.getComponents().add( newComponent )
					Ext.getStore('config.Components').add( newComponent )
                }
            )

            record.set( values )
			record.setZone( zone )
            record.set('blueprintId', entityBlueprint.getFullName() )

			zone.getEntities().add( record )
			store.add( record )

			this.application.getController('Projects').getZonesList( zone.getProject() )
            window.close()
        }
    },

    deleteEntity: function ( entity ) {
        var zone     = this.application.getActiveZone(),
            entities = zone.getEntities()

        entities.remove( entity )

        this.showEntitylist( entities )
    },

    editEntity: function ( entity ) {
        console.log( "editEntity"  )
        console.log( entity )
    },

	showEntityInfo: function( id ) {
		var entity = this.getConfigEntitiesStore().getById( id )

		if( entity ) {
			this.showComponentsList( entity )
			return entity
		}
	},

    showComponentsList: function( entity ) {
        var contentPanel = Ext.ComponentManager.get( "RightPanel"),
			View = this.getEntityComponentsListView()

		contentPanel.removeAll()

		entity.mergeWithBlueprintConfig()

		contentPanel.setTitle( entity.get('name') + " - Components" )

		var view = new View()
		entity.getComponents().each(
			function( component ) {
				view.add( this.application.getController('Components').createConfigGridView( component ) )
			},
			this
		)

		contentPanel.add( view )
     }
});