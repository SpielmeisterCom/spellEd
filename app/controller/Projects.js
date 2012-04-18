Ext.define('Spelled.controller.Projects', {
    extend: 'Ext.app.Controller',

    models: [
        'Project'
    ],

    createProject: function() {
        console.log( "create project" )
    },

    loadProject: function() {
        console.log( "load project" )
    }
});