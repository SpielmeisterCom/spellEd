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

		this.application.on( {
			'globalsave': this.globalSave,
			'revertmodel': this.revertModel,
			scope: this
		})
	},

	refs: [
		{
			ref : 'ScenesTree',
			selector: '#ScenesTree'
		}
	],

	globalSave: function() {
		var stores = [
			'template.Components',
			'template.Entities',
			'template.Systems'
		]

		Ext.each(
			stores,
			function( id ) {
				Ext.getStore( id ).each(
					function( item ) {
						if( item.dirty === true ) item.save()
					}
				)
			}
		)

		this.saveActiveProject()
	},

	revertModel: function( model ) {
		var proxy = model.getProxy(),
			Model = proxy.getModel(),
			store = model.store

		Model.load( model.getId(), {
			scope: this,
			success: function( record ) {
				if( !store ) return
				store.remove( model )
				store.add( record )
			}
		})
	},

	loadLastProject: function() {
		// loading default project
		var projectName = Ext.state.Manager.get( 'projectName' ) || 'spellReferenceProject'

		try {
			this.loadProject( projectName )

		} catch( e ) {
			Ext.state.Manager.clear( 'projectName' )
			Ext.create( 'Spelled.view.ui.StartScreen' ).show()
		}
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

				Spelled.SpellBuildActions.initDirectory( values.name, configFilePath, function( provider, response ) {
					me.initProject( values.name )
                    window.close()
                })

            } else {

            }
        })
    },

	initProject: function( projectName ) {
		var callback = Ext.bind(
			function( project ) {
				var sceneController = this.application.getController( 'Scenes' ),
					scene = sceneController.createScene( { name: 'Scene1' } )

				project.set('startScene', scene.getId() )
				project.save()
			},
			this
		)

		this.loadProject( projectName, callback )
	},

    showLoadProject: function( ) {
        var View = this.getProjectLoadView(),
			view = new View()

        view.show()
    },

	saveActiveProject: function( callback ) {
		var project = this.application.getActiveProject()

		project.save( {	callback: callback } )
	},

	exportActiveProject: function() {
		var project        = this.application.getActiveProject(),
			exportFileName = project.get('name') +".tar",
			me             = this

		Spelled.SpellBuildActions.exportDeployment(
			project.get( 'name' ),
			exportFileName,
			function( provider, response ) {
				if( !!response.data ) {
					window.location = '/' + exportFileName

				} else {
					me.application.showBuildServerConnectError()
				}
			}
		)
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
		app.fireEvent( 'clearstores' )
		app.setExtraParamOnProxies( 'projectName', projectName )
	},

    loadProject: function( projectName, callback ) {
        var Project = this.getProjectModel()

		this.prepareStores( projectName )
		this.closeAllTabsFromProject()

		Project.load(
			projectName,
			{
				scope: this,
				success: function( project ) {
					this.onProjectLoaded( project )

					if( !!callback )
						Ext.callback( callback( project ) )
				}
			}
		)
	},

	onProjectLoaded: function( project ) {
		var app = this.application

		Ext.state.Manager.set( 'projectName', project.get('name') )
		app.setActiveProject( project )

		app.getController( 'Scripts' ).refreshStoresAndTreeStores( true )
		//Need to do a synchronous load
		//TODO: find a solution for synchonous loading stores with proxies etc.
		app.getController( 'Assets' ).refreshStoresAndTreeStores(
			true,
			Ext.bind( function() {
					var callback = Ext.bind( function() {
							this.projectLoadedCallback( project )
						},
						this
					)

					app.getController( 'Templates' ).loadTemplateStores( project.get('name'), callback, true )
				},
				this
			)
		)
	},

	projectLoadedCallback: function( project ) {
		project.checkForComponentChanges()
		this.getScenesList( project )
		Ext.getCmp('Navigator').setActiveTab( Ext.getCmp('Scenes') )

		var tree       = this.getScenesTree(),
			startScene = project.getScenes().getById( project.get( 'startScene' ) ),
			node       = tree.getRootNode().findChild( 'id', startScene.get( 'name' ), true )

		tree.getSelectionModel().select( node )
		tree.expandPath( node.getPath() )


		this.application.getController( 'Scenes' ).renderScene( startScene )
	},

	closeAllTabsFromProject: function() {
		var app = this.application

		app.closeAllTabs( Ext.getCmp('ScriptEditor') )
		app.closeAllTabs( Ext.getCmp('AssetEditor') )
		app.closeAllTabs( Ext.getCmp('SceneEditor') )
	},

    getScenesList: function( project ) {
        this.application.getController('Scenes').showScenesList( project.getScenes() )
    }
});
