Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',

    views: [
        'menu.Menu'
    ],

    init: function() {
        this.control({
            '#createProject': {
                click: this.createProject
            },
            '#loadProject': {
                click: this.loadProject
            }
        })
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