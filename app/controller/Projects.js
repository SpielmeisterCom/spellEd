Ext.define('Spelled.controller.Projects', {
    extend: 'Ext.app.Controller',

    models: [
        'Project'
    ],

    createProject: function() {
        console.log( "create project" )
    },

    loadProject: function() {
        //var controller = this.getController('AnotherController');
        //controller.init();()        //get a reference to the User model class


        var Project = this.getProjectModel()

        Project.load( 1, {
            success: function( project ) {
                console.log( project )
            }
        })


        console.log( "load project" )
    }
});