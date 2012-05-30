Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',

    views: [
        'menu.Menu',
        'menu.contextmenu.ZonesList',
        'menu.contextmenu.EntitiesList',
        'menu.contextmenu.AssetsList',
        'menu.contextmenu.ComponentBlueprintAttributesList',
        'menu.contextmenu.EntityBlueprintComponentsList',
        'ui.SpelledConsole',
        'ui.StartScreen'
    ],

    init: function() {
        this.control({
            'spelledmenu [action="showCreateProject"]': {
                click: this.showCreateProject
            },
            'spelledmenu [action="showloadProject"]': {
                click: this.showLoadProject
            },
            'spelledmenu [action="saveProject"]': {
                click: this.saveProject
            },


            'startscreen button[action="showCreateProject"]': {
                click: function( button ) {
                    button.up('window').close()
                    this.showCreateProject()
                }
            },
            'startscreen button[action="showLoadProject"]': {
                click: function( button ) {
                    button.up('window').close()
                    this.showLoadProject()
                }
            },


            'assetslistcontextmenu [action="create"]': {
                click: this.showCreateAsset
            },
            'assetslistcontextmenu [action="remove"]': {
                click: this.removeAsset
            },


            'entitieslistcontextmenu [action="remove"]': {
                click: this.removeEntity
            },


            'componentblueprintattributescontextmenu [action="remove"]': {
                click: this.removeComponentAttribute
            },


            'entityblueprintcomponentscontextmenu [action="remove"]': {
                click: this.removeComponent
            },


            'zoneslistcontextmenu [action="remove"]': {
                click: this.removeZone
            },
            'zoneslistcontextmenu [action="default"]': {

            },
            'zoneslistcontextmenu [action="edit"]': {
                click: this.editZone
            },
            'zoneslistcontextmenu [action="render"]': {
                click: this.renderZone
            }
        })
    },

    createAndShowView: function( View, event ) {
        event.stopEvent()

        var view = new View()
        view.showAt( event.getXY() )

        return view
    },

    showComponentAttributesListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuComponentBlueprintAttributesListView(),
            e
        )
    },

    showEntityBlueprintComponentsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuEntityBlueprintComponentsListView(),
            e
        )
    },

    showEntitiesListContextMenu: function( entity, e ) {

        var view = this.createAndShowView(
            this.getMenuContextmenuEntitiesListView(),
            e
        )

        view.setEntity( entity )
    },

    showZonesListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuZonesListView(),
            e
        )
    },

    showAssetsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuAssetsListView(),
            e
        )
    },

    showComponentContextMenu: function( component, e ) {
        e.stopEvent()
    },

    showCreateAsset: function( ) {
        var assetsController = this.application.getController( 'Assets' )
        assetsController.showCreateAsset( )
    },

    removeAsset: function( ) {
        var tree = Ext.getCmp( 'AssetsTree'),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
            var assetsController = this.application.getController( 'Assets' )
            assetsController.removeAsset( node.get('id') )
        }
    },

    removeComponentAttribute: function( ) {
        var tree = Ext.getCmp( 'ComponentBlueprintAttributesTree' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
            var blueprintsController = this.application.getController( 'Blueprints' )
            blueprintsController.removeComponentAttribute( node.get('id') )
        }
    },

    removeComponent: function( ) {
        var tree = Ext.getCmp( 'EntityBlueprintComponentsTree' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && !node.isLeaf() && !node.isRoot() ) {
            var blueprintsController = this.application.getController( 'Blueprints' )
            blueprintsController.removeEntityComponent( node.get('id') )
        }
    },

    removeEntity: function( item ) {
        var view = item.up('entitieslistcontextmenu')

        var entity = view.getEntity()

        if( entity ) {
            var entitiesController = this.application.getController( 'Entities' )
            entitiesController.deleteEntity( entity )
        }
    },

    removeZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            var zonesController = this.application.getController( 'Zones' )
            zonesController.deleteZone( zone )
        }
    },

    editZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            var zonesController = this.application.getController( 'Zones' )
            zonesController.editZone( zone )
        }
    },

    renderZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            var zonesController = this.application.getController( 'Zones' )
            zonesController.renderZone( zone )
        }
    },

    showCreateProject: function() {
        var projectController = this.application.getController('Projects')
        projectController.showCreateProject()
    },

    showLoadProject: function() {
        var projectController = this.application.getController('Projects')
        projectController.showLoadProject()
    },

    saveProject: function() {
        var projectController = this.application.getController('Projects')

        projectController.saveActiveProject()
    }
});