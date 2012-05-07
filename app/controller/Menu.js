Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',

    views: [
        'menu.Menu',
        'menu.contextmenu.EntitiesList',
        'ui.SpelledConsole'
    ],

    init: function() {
        this.control({
            'spelledmenu [action="createProject"]': {
                click: this.createProject
            },
            'spelledmenu [action="loadProject"]': {
                click: this.loadProject
            },
            'entitieslistcontextmenu [action="remove"]': {
                click: this.removeEntity
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

    showComponentContextMenu: function( component, e ) {
        e.stopEvent()
    },

    removeEntity: function( item ) {
        var view = item.up('entitieslistcontextmenu')

        var entity = view.getEntity()

        if( entity ) {
            var entitiesController = this.application.getController('Spelled.controller.Entities')
            entitiesController.deleteEntity( entity )
        }
    },

    createProject: function() {
        var projectController = this.application.getController('Spelled.controller.Projects')
        projectController.createProject()
    },

    loadProject: function() {
        var projectController = this.application.getController('Spelled.controller.Projects')
        projectController.loadProject()
    }
});