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
                    configFilePath   = values.name + '/project.json'

                SpellBuild.ProjectActions.initDirectory( values.name, configFilePath, function( provider, response ) {
                    me.loadProject( projectDirectory )
                    window.close()
                })

            } else {

            }
        })
    },

    showLoadProject: function( ) {
        var View = this.getProjectLoadView()

        var view = new View()
        view.show()
    },

    saveActiveProject: function( ) {
        var project = this.application.getActiveProject()

        project.save()
    },

    loadProjectAction: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            values = form.getValues(),
            projectName = values.name || false

        if( !!projectName ){
            this.loadProject( projectName )
            window.close()
        }

    },

    loadProject: function( projectName ) {
        var me = this

        var Project = this.getProjectModel()

        Project.load( projectName, {
            success: function( project ) {
                me.getZonesList( project )
                me.application.setActiveProject( project )
                me.application.getController('Spelled.controller.Assets').setProjectNameOfAssetProxy( project.get('name') )
            }
        })
    },

    getZonesList: function( project ) {

        var zonesController = this.application.getController('Spelled.controller.Zones')

        zonesController.showZoneslist( project.getZones() )
    }
});