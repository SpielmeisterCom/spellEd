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

	storesForSave: [
		'template.Components',
		'template.Entities',
		'template.Systems',
		'script.Scripts'
	],

    init: function() {
		Ext.EventManager.on( window, 'beforeunload', this.projectCloseWarning, this)
		Ext.EventManager.on( window, 'unload', this.projectCloseWarning, this)

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
		},
		{
			ref : 'Scenes',
			selector: '#Scenes'
		},
		{
			ref : 'Navigator',
			selector: '#Navigator'
		},
		{
			ref : 'Library',
			selector: '#SceneEditor'
		}
	],

	projectCloseWarning: function() {
		if( this.checkIfDirty() ) return "You have unsaved changes.\nDo you really want to close this application?"
	},

	checkIfDirty: function() {
		var dirty = false
		Ext.each(
			this.storesForSave,
			function( id ) {
				Ext.getStore( id ).each(
					function( item ) {
						if( item.dirty === true ) {
							dirty = true
							return false
						}
					}
				)
			}
		)

		return ( dirty ) ? true : this.application.getActiveProject().dirty
	},

	globalSave: function() {
		Ext.each(
			this.storesForSave,
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
        var View = this.getProjectCreateView(),
			view = new View(),
			Project = this.getProjectModel(),
			form = view.down( 'form' )

		form.loadRecord( new Project() )

        view.show()
    },

    createProject: function ( button, event, record ) {
        var window = button.up('window'),
            form   = window.down('form'),
            values = form.getValues(),
			record = form.getRecord(),
            me     = this,
			store  = this.getProjectsStore()

		record.setId( values.name + '/project.json' )
		record.set( values )
		store.add( record )

		Spelled.SpellBuildActions.initDirectory( record.get('name'), record.getId(), function( provider, response ) {
			me.initProject( record.get('name') )
			window.close()
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
			exportFileName = project.get('name') +".zip",
			me             = this

		Spelled.SpellBuildActions.exportDeployment(
			project.get( 'name' ),
			exportFileName,
			function( provider, response ) {
				if( !!response.data ) {
					// WORKAROUND: delaying the download a little bit to mitigate asynchronous race condition
					var task = new Ext.util.DelayedTask( function() {
						window.location = '/' + exportFileName
					} )

					task.delay( 5000 )

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
		var Project = this.getProjectModel(),
			record  = this.getProjectsStore().findRecord( 'name', projectName )

		this.prepareStores( projectName )
		this.closeAllTabsFromProject()

		Project.load(
			record.getId(),
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

		app.getController( 'Scripts' ).refreshStores()
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

					app.getController( 'Templates' ).loadTemplateStores( callback )
				},
				this
			)
		)
	},

	projectLoadedCallback: function( project ) {
		project.checkForComponentChanges()
		this.getScenesList( project )
		this.getNavigator().setActiveTab( this.getScenes() )

		var tree       = this.getScenesTree(),
			startScene = project.getScenes().getById( project.get( 'startScene' ) ),
			node       = tree.getRootNode().findChild( 'id', startScene.get( 'name' ), true )

		tree.getSelectionModel().select( node )
		tree.expandPath( node.getPath() )

		this.application.getController( 'Scenes' ).renderScene( startScene )
		project.unDirty()
	},

	closeAllTabsFromProject: function() {
		var app = this.application

		app.closeAllTabs( this.getLibrary() )
	},

    getScenesList: function( project ) {
        this.application.getController('Scenes').showScenesList( project.getScenes() )
    }
});
