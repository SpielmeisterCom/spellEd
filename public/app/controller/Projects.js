Ext.define('Spelled.controller.Projects', {
    extend: 'Ext.app.Controller',

    views: [
        'project.Create',
        'project.Load'
    ],

    stores: [
        'Projects'
    ],

    models: [
        'Project'
    ],

    init: function() {
        this.control({
            'createproject button[action="createProject"]': {
                click: this.createProject
            },
            'loadproject button[action="loadProject"]': {
                click: this.loadProjectAction
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
                    me.loadProject( projectDirectory )
                    window.close()
//                })

            } else {

            }
        })
    },

    showLoadProject: function( ) {
        var View = this.getProjectLoadView()

        var view = new View()
        view.show()
    },

    loadProjectAction: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            values = form.getValues(),
            id = values.id || false

        if( !!id ){
            this.loadProject( id )
            window.close()
        }

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