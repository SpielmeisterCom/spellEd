Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',

    views: [
        'menu.Menu',
        'menu.contextmenu.ZonesList',
        'menu.contextmenu.EntitiesList',
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


            'entitieslistcontextmenu [action="remove"]': {
                click: this.removeEntity
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

    showEntitiesListContextMenu: function( entity, e ) {
        e.stopEvent()

        var View = this.getMenuContextmenuEntitiesListView()
        var view = new View()
        view.showAt( e.getXY() )
        view.setEntity( entity )
    },

    showZonesListContextMenu: function( e ) {
        e.stopEvent()

        var View = this.getMenuContextmenuZonesListView()
        var view = new View()
        view.showAt( e.getXY() )
    },

    showComponentContextMenu: function( component, e ) {
        e.stopEvent()
    },

    removeEntity: function( item ) {
        var view = item.up('entitieslistcontextmenu')

        var entity = view.getEntity()

        if( entity ) {
            var entitiesController = this.application.getController( 'Spelled.controller.Entities' )
            entitiesController.deleteEntity( entity )
        }
    },

    removeZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            var zonesController = this.application.getController( 'Spelled.controller.Zones' )
            zonesController.deleteZone( zone )
        }
    },

    editZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            var zonesController = this.application.getController( 'Spelled.controller.Zones' )
            zonesController.editZone( zone )
        }
    },

    renderZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            var zonesController = this.application.getController( 'Spelled.controller.Zones' )
            zonesController.renderZone( zone )
        }
    },

    showCreateProject: function() {
        var projectController = this.application.getController('Spelled.controller.Projects')
        projectController.showCreateProject()
    },

    showLoadProject: function() {
        var projectController = this.application.getController('Spelled.controller.Projects')
        projectController.showLoadProject()
    },

    saveProject: function() {
        var projectController = this.application.getController('Spelled.controller.Projects')

        projectController.saveActiveProject()
    }
});