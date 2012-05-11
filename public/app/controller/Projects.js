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
            values = form.getValues(),
            me     = this


        Spelled.ProjectActions.create( values.name , function( provider, response ) {

            if( response.result !== false ) {
                var projectDirectory = response.result,
                    configFilePath   = projectDirectory + '/config.json'


//TODO: replace with ext-direct from spelljs
//                SpellBuild.ProjectActions.initDirectory( projectDirectory, configFilePath, function( provider, response ) {
//                    console.log( response )
//
                    me.loadProject( configFilePath )
                    window.close()
//                })

            } else {

            }
        })
    },

    loadProject: function( id ) {
        var me = this

        var Project = this.getProjectModel()

        Project.load( id, {
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