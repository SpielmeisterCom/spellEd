Ext.define('Spelled.controller.Projects', {
    extend: 'Ext.app.Controller',

    views: [
        'project.Create'
    ],

    models: [
        'Project'
    ],

    init: function() {
        this.control({
            'createproject button[action="createProject"]': {
                click: this.createProject
            }
        })
    },

    showCreateProject: function() {
        var View = this.getProjectCreateView()

        var view = new View()
        view.show()
    },

    createProject: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            record = form.getRecord(),
            values = form.getValues()

        SpellBuild.ProjectActions.initDirectory( '/tmp/', '/tmp/config.json', function( provider, response ) {
            console.log( response )



            window.close()
        })

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