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
                var configFilePath   = values.name + '/project.json'

                SpellBuild.ProjectActions.initDirectory( values.name, configFilePath, function( provider, response ) {
                    me.loadProject( values.name )
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

	prepareStores: function( projectName ) {
		var app = this.application
		app.setExtraParamOnProxies( 'projectName', projectName )

		app.getController( 'Templates' ).loadTemplateStores( projectName )
		app.getController( 'Assets' ).refreshStores()
		app.getController( 'Scripts' ).refreshStores()
	},

    loadProject: function( projectName ) {
        var Project = this.getProjectModel()

		this.prepareStores( projectName )
		this.closeAllTabsFromProject()

		Project.load( projectName, {
            scope: this,
            success: function( project ) {
				project.checkForComponentChanges()
				this.getScenesList( project )
				this.application.setActiveProject( project )
				Ext.getCmp('Navigator').setActiveTab( Ext.getCmp('Scenes') )

				var tree       = Ext.getCmp('ScenesTree'),
					firstScene = project.getScenes().first()

				tree.getSelectionModel().select( tree.getRootNode().findChild( 'id', firstScene.get('name') ) )

				this.application.getController( 'Scenes' ).renderScene( firstScene )
            }
        })

    },

	closeAllTabsFromProject: function() {
		var app = this.application

		app.closeAllTabs( Ext.getCmp('ScriptEditor') )
		app.closeAllTabs( Ext.getCmp('AssetEditor') )
		app.closeAllTabs( Ext.getCmp('SceneEditor') )
		app.closeAllTabs( Ext.getCmp('TemplateEditor') )
	},

    getScenesList: function( project ) {
        this.application.getController('Scenes').showScenesList( project.getScenes() )
    }
});
