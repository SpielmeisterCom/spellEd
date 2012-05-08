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
        'entity.TreeList',
        'entity.Create'
    ],

    init: function() {
        this.control({
            '#EntityList': {
                select : this.handleEntityClick
            },
            '#EntityList actioncolumn': {
                click: this.handleActionColumnClick
            },
            'entiteslist button[action="showCreateEntity"]': {
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

    showListContextMenu: function( view, record, item, index, e, options ) {

        if( !record.data.leaf ) {
            var entity = Ext.getStore('config.Entities').getById( record.internalId )

            if( entity ) {
                var menuController = this.application.getController('Spelled.controller.Menu')
                menuController.showEntitiesListContextMenu( entity, e )
            }

        } else {
            var component = Ext.getStore('config.Components').getById( record.internalId )

            if( component ) {
                var menuController = this.application.getController('Spelled.controller.Menu')
                menuController.showComponentContextMenu( component, e )
            }
        }

    },

    showCreateEntity: function( ) {
        var CreateView = this.getEntityCreateView()
        var createView = new CreateView()

        var EntityModel = this.getConfigEntityModel()
        createView.down('form').loadRecord( new EntityModel() )

        createView.show()
    },

    createEntity: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            zone   = this.application.getActiveZone(),
            entities = zone.getEntities()

        //TODO: Get converted format from Spell!
        var entityBlueprint = Ext.getStore('blueprint.Entities').getById( values.blueprintId )

        if( entityBlueprint ) {
            Ext.each( entityBlueprint.getComponents().data.items, function( component ) {
                component.setBlueprintConfig( component.get('blueprintId') )
            } )

            record.set( values )

            record.set('blueprintId', entityBlueprint.getFullName() )
            entities.add( record )

            this.showEntitylist( entities )
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

    handleEntityClick: function( treePanel, record ) {
        if( !record.data.leaf ) {
            this.getConfig( treePanel, record )
        } else {
            this.getComponentConfig( record )
        }
    },

    getConfig:  function( treePanel, record ) {
        if( record.data.leaf ) return

        console.log( "Maybe show a assets list?" )
    },

    getComponentConfig: function( record ) {
        if( !record.data.leaf ) return

        var component = Ext.getStore('config.Components').getById( record.internalId )

        if( component ) {
            var componentsController = this.application.getController('Spelled.controller.Components')
            componentsController.showConfig( component )
        }
    },

    showEntitylist: function( entities ) {

        var children = []
        Ext.each( entities.data.items, function( entity ) {
            var componentsAsChildren = []

            var configuration = entity.getComponents()
            Ext.each( configuration.data.items, function( component ) {

                componentsAsChildren.push( {
                        text         : component.get('blueprintId'),
                        leaf         : true,
                        id           : component.getId()
                    }
                )
            })

            children.push( {
                text      : entity.get('name'),
                id        : entity.getId(),
                expanded: true,
                leaf      : ( entities.data.items.length === 0 ) ? true : false,
                children  : componentsAsChildren
            } )
        })

        var rootNode = {
            text: "Entities",
            expanded: true,
            children: children
        };

        var entitiesPanel = Ext.ComponentManager.get( "EntityList" )
        entitiesPanel.getStore().setRootNode( rootNode )
    }
});