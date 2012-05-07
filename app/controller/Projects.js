Ext.define('Spelled.controller.Projects', {
    extend: 'Ext.app.Controller',

    models: [
        'Project'
    ],

    createProject: function() {
        console.log( "create project" )
    },

    loadProject: function() {
        var me = this

        var Project = this.getProjectModel()

        //TODO: remove dummy project
        Project.load( 1, {
            success: function( project ) {
                me.getZonesList( project )
                me.application.setActiveProject( project )
            }
        })
    },

    getZonesList: function( project ) {

        var zonesController = this.application.getController('Spelled.controller.Zones')

        zonesController.showZoneslist( project.getZones() )
    }
});