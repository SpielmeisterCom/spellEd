Ext.define('Spelled.controller.Projects', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.view.project.Create',
		'Spelled.view.project.Load',
		'Spelled.view.project.Settings',
		'Spelled.view.project.settings.General',
		'Spelled.view.project.settings.Language',
		'Spelled.view.project.settings.AddLanguage',
		'Spelled.view.project.settings.SupportedLanguageContextMenu',

		'Spelled.store.Projects',

		'Spelled.model.Project'
	],

    views: [
        'project.Create',
        'project.Load',
		'project.Settings',
		'project.settings.General',
		'project.settings.Language',
		'project.settings.AddLanguage',
		'project.settings.SupportedLanguageContextMenu'
    ],

    stores: [
        'Projects'
    ],

    models: [
        'Project'
    ],

	storesForSave: [
		'script.Scripts',
		'asset.Appearances',
		'asset.Animations',
		'asset.Sounds',
		'asset.Fonts',
		'asset.SpriteSheets',
		'asset.KeyFrameAnimations',
		'asset.KeyToActionMappings',
		'asset.TileMaps',
		'asset.Translations',
		'template.Components',
		'template.Entities',
		'template.Systems',
		'config.Scenes'
	],

    init: function() {
		Ext.TaskManager.start({
			run: this.updateSaveButtonState,
			interval: 500,
			scope: this
		})

		Ext.EventManager.on( window, 'beforeunload', this.projectCloseWarning, this)
		Ext.EventManager.on( window, 'unload', this.projectCloseWarning, this)

        this.control({
			'supportedlanguagecontextmenu [action="remove"]': {
				click: this.removeLanguage
			},
			'projectlanguagesettings grid[name="supportedLanguages"]': {
				itemcontextmenu: this.showSupportedLanguageContextMenuHelper,
				itemmouseenter: Ext.bind( this.application.showGridActionColumn, this.application ),
				itemmouseleave: this.application.hideActions
			},
			'projectsettingsaddlanguage [action="addLanguage"]':{
				click: this.addLanguage
			},
			'spelledmenu [action="showCreateProject"]': {
				click: this.showCreateProject
			},
			'projectsettings [action="setProjectSettings"]': {
				click: this.setProjectSettings
			},
			projectlanguagesettings: {
				addLanguage: this.addLanguage,
				showContextMenu: this.showSupportedLanguageContextMenu,
				showAddLanguage: this.showAddLanguageHandler
			},
			'spelledmenu [action="showLoadProject"]': {
				click: this.showLoadProject
			},
			'spelledmenu [action="showProjectSettings"]': {
				click: this.showProjectSettings
			},
			'spelledmenu [action="saveProject"]': {
				click: this.globalSave
			},
			'spelledmenu [action="exportProject"]': {
				click: this.exportActiveProject
			},
			nwtoolbar: {
				showLoadProject    : this.showLoadProject,
				showProjectSettings: this.showProjectSettings,
				showCreateProject  : this.showCreateProject,
				exportProject      : this.exportActiveProject,
				saveProject        : this.globalSave
			},
            'createproject button[action="createProject"]': {
                click: this.createProject
            },
            'loadproject button[action="loadProject"]': {
                click: this.loadProjectAction
            },
			'startscreen button[action="showCreateProject"]': {
				click: function( button ) {
					button.up('window').close()
					this.showCreateProject()
				}
			},
			'startscreen button[action="showLoadProject"]': {
				click: function( button ) {
					button.up('window').close()
					this.showLoadProject()
				}
			},
			'spelledconfigure': {
				loadProjects: function() {
					this.application.loadProjects()
				}
			}
        })

		this.application.on( {
			'exportproject': this.exportActiveProject,
			'globalsave'   : this.globalSave,
			'revertmodel'  : this.revertModel,
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
		},
		{
			ref: 'saveButton',
			selector: 'spelledmenu button[action="saveProject"]'
		}
	],

	removeLanguage: function( button ){
		var view     = button.up( 'menu' ),
			project  = this.application.getActiveProject(),
			language = view.ownerView

		project.getSupportedLanguages().remove( language )
		this.application.fireEvent( 'removedLanguage', language )
	},

	showSupportedLanguageContextMenuHelper: function( view, record, item, index, e ) {
		this.showSupportedLanguageContextMenu( record, e )
	},

	showSupportedLanguageContextMenu: function( record, e ) {
		this.application.fireEvent( 'showcontextmenu', this.getProjectSettingsSupportedLanguageContextMenuView(), e, record )
	},

	showAddLanguageHandler: function(){
		Ext.widget( 'projectsettingsaddlanguage' )
	},

	addLanguage: function( button ) {
		var window    = button.up( 'window' ),
			project   = this.application.getActiveProject(),
			combo     = window.down( 'combo[name="language"]' ),
			language  = combo.findRecordByValue( combo.getValue() ),
			languages = project.getSupportedLanguages()

		if( language && !languages.getById( language.getId() ) ) {
			languages.add( language )
			this.application.fireEvent( 'addedLanguage', language )
		}

		window.close()
	},

	setProjectSettings: function( button ) {
		var window        = button.up( 'window' ),
			generalConfig = window.down( 'projectgeneralsettings' ),
			languageConf  = window.down( 'projectlanguagesettings' ),
			project       = generalConfig.getRecord(),
			generalValues = generalConfig.getValues(),
			languageValues = languageConf.getValues(),
			config        = {}

		config.screenSize = [
			parseInt( generalValues.screenSizeX, 10 ),
			parseInt( generalValues.screenSizeY, 10)
		]

		Ext.copyTo( config, generalValues, 'loadingScene,screenMode,projectId' )
		config.quadTreeSize       = parseInt( generalValues.quadTreeSize, 10 )
		config.defaultLanguage    = languageValues.defaultLanguage

		project.set( 'config', config )
		project.setDirty()

		window.close()
	},

	updateSaveButtonState: function() {
		var state  = this.checkIfDirty(),
			button = this.getSaveButton()

		if( button ) button.setDisabled( !state )
	},

	projectCloseWarning: function() {
		if( this.checkIfDirty() ) return "You have unsaved changes!"
	},

	checkIfDirty: function() {
		if( !this.application.getActiveProject() ) return

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
		var me = this

		Ext.each(
			this.storesForSave,
			function( id ) {
				Ext.getStore( id ).each(
					function( item ) {
						if( item.dirty === true ) {
							item.save()
							me.application.fireEvent( 'savemodel', item )
						}
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
		var projectName = Ext.state.Manager.get( 'projectName' )

		if ( projectName ) {
			try {
				this.loadProject( projectName )

			} catch( e ) {
				this.showStartScreen()
			}

		} else {
			this.showStartScreen()
		}

	},

	showStartScreen: function() {
		Ext.state.Manager.clear( 'projectName' )
		Ext.create( 'Spelled.view.ui.StartScreen' ).show()
	},

	showProjectSettings: function() {
		var project = this.application.getActiveProject()

		if( project ) {
			var view     = Ext.widget( 'projectsettings' ),
				config   = project.get( 'config' ),
				general  = view.down( 'projectgeneralsettings' ),
				language = view.down( 'projectlanguagesettings'),
				store    = project.getSupportedLanguages()

			store.sort( 'name' )
			language.down( 'combo[name="defaultLanguage"]' ).bindStore( store )
			language.down( 'grid[name="supportedLanguages"]' ).reconfigure( store )

			general.loadRecord( project )
			language.loadRecord( project )

			general.getForm().setValues( config )
			language.getForm().setValues( config )

			general.getForm().setValues( { screenSizeX: config.screenSize[0], screenSizeY: config.screenSize[1] } )
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

    createProject: function ( button ) {
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
			me.loadProject( record.get('name'), true )
			window.close()
		})
    },

	initProject: function( project ) {
		var sceneController = this.application.getController( 'Scenes' ),
			scene           = sceneController.createScene( { name: 'Scene1', namespace: 'root' } )

		project.set('startScene', scene.getFullName() )
		project.save()
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
			projectName    = project.get( 'name' ),
			exportFileName = projectName +".zip",
			me             = this

		Spelled.SpellBuildActions.exportDeployment(
			projectName,
			exportFileName,
			function( provider, response ) {
				if( !!response.data ) {
					// WORKAROUND: delaying the download a little bit to mitigate asynchronous race condition
					var task = new Ext.util.DelayedTask( function() {
						window.location = Spelled.Converter.toWorkspaceUrl( '/' + exportFileName )
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

	clearStores: function( stores ) {
		if( !stores ) return

		var store = stores.pop()

		if( store ) {
			Ext.getStore( store ).removeAll( true )
			this.clearStores( stores )
		}
	},

	prepareStores: function( projectName ) {
		var app = this.application

		this.clearStores( Ext.clone( app.storeIds ) )
		app.fireEvent( 'clearstores' )

		app.setExtraParamOnProxies( 'projectName', projectName )
	},

	PROGRESS_STEP: function() {
		return 1 / ( this.storesForSave.length - 1 + 4 )
	},

	iterateLoadingProgress: function( text ) {
		var lastProgress = Ext.MessageBox.progressBar.value || 0,
			nextProgress = lastProgress + this.PROGRESS_STEP()

		Ext.MessageBox.updateProgress( nextProgress, Math.round( 100 * nextProgress ) + '% completed', text || null )

		if( nextProgress > 0.9999 ) {
			Ext.MessageBox.close()
		}
	},

    loadProject: function( projectName, initialize ) {
		var record  = this.getProjectsStore().findRecord( 'name', projectName )

		if( !record ) return this.showStartScreen()

		Ext.MessageBox.show({
			title: 'Please wait',
			msg: 'Loading project items...',
			progressText: 'Initializing...',
			width: 300,
			progress: true
		})

		this.prepareStores( projectName )
		this.closeAllTabsFromProject()

		this.loadStores( projectName, initialize )
	},

	storesReadyCallback: function( projectName, initialize ) {
		var Project = this.getProjectModel(),
			record  = this.getProjectsStore().findRecord( 'name', projectName )

		this.application.setActiveProject( record )

		if( initialize ) this.initProject( record )

		Project.load(
			record.getId(),
			{
				scope: this,
				success: function( project ) {
					this.iterateLoadingProgress()

					//Needed because scenes got fetched
					this.application.setActiveProject( project )
					Ext.state.Manager.set( 'projectName', project.get('name') )

					this.projectLoadedCallback( project )
				}
			}
		)
	},

	loadStores: function( project, initialize ) {
		var me        = this,
			stores    = Ext.clone( this.storesForSave ),
			getStore  = Ext.getStore,
			loadStore = function() {
				var store = stores.shift()

				if( !store ) {
					me.storesReadyCallback( project, initialize )
				} else {
					me.iterateLoadingProgress( "Loading '" + store + "' ... " )
					getStore( store ).load( { callback: loadStore } )
				}
			}

		loadStore()
	},

	projectLoadedCallback: function( project ) {
		this.iterateLoadingProgress()

		project.checkForComponentChanges()
		this.getScenesList( project )
		this.getNavigator().setActiveTab( this.getScenes() )

		var tree         = this.getScenesTree(),
			startScene   = project.getStartScene(),
			rootNode     = tree.getRootNode(),
			node         = rootNode.findChild( 'id', startScene.getId(), true )

		tree.getSelectionModel().select( node )

		rootNode.collapseChildren( true )

		this.getNavigator().defaultTitle = project.get( 'name' )
		this.getScenes().changeTitle()
		project.unDirty()

		this.application.fireEvent( 'renderscene', startScene )
		this.application.fireEvent( 'buildnamespacenodes' )

		this.iterateLoadingProgress()
	},

	closeAllTabsFromProject: function() {
		this.application.fireEvent( 'closealltabs' )
	},

    getScenesList: function( project ) {
	    this.application.getController('Scenes').showScenesList( project.getScenes() )
    }
});
