Ext.define('Spelled.controller.Projects', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.view.project.Create',
		'Spelled.view.project.Load',
		'Spelled.view.project.Settings',
		'Spelled.view.project.settings.General',
		'Spelled.view.project.settings.Language',
		'Spelled.view.project.settings.TabPanel',
        'Spelled.view.project.settings.Android',
        'Spelled.view.project.settings.iOS',
		'Spelled.view.project.settings.Tizen',
        'Spelled.view.project.settings.AddLanguage',
		'Spelled.view.project.settings.Web',
		'Spelled.view.project.settings.Plugins',
		'Spelled.view.project.settings.SupportedLanguageContextMenu',
		'Spelled.view.project.settings.QualityLevelsContextMenu',

		'Spelled.view.project.resources.Image',
		'Spelled.view.project.resources.Certificate',
		'Spelled.view.project.resources.PrivateKeyFile',
		'Spelled.view.project.resources.ProvisionFile',

		'Spelled.store.Projects',

		'Spelled.store.project.TizenResources',
		'Spelled.store.project.AndroidResources',
		'Spelled.store.project.IOSResources',


		'Spelled.store.SupportedOrientations',

		'Spelled.model.Project'
	],

    views: [
        'project.Create',
        'project.Load',
		'project.Settings',
		'project.settings.General',
		'project.settings.Language',
		'project.settings.AddLanguage',
		'project.settings.Web',
		'project.settings.Plugins',
		'project.settings.SupportedLanguageContextMenu',
	    'project.settings.QualityLevelsContextMenu'
    ],

    stores: [
        'Projects',
	    'SupportedOrientations',
		'project.Plugins',
	    'project.TizenResources',
	    'project.AndroidResources',
	    'project.IOSResources',
		'project.WindowsResources',
		'project.WindowsPhoneResources'
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
		'asset.InputMappings',
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

		this.application.platform.addClosingEditorHandler()

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
	        'qualitylevelscontextmenu [action="remove"]': {
		        click: this.removeQualityLevel
	        },
	        'projectqualitysettings grid[name="qualityLevels"]': {
		        itemcontextmenu: this.showQualityLevelsContextMenu,
		        itemmouseenter: Ext.bind( this.application.showGridActionColumn, this.application ),
		        itemmouseleave: this.application.hideActions
	        },
	        projectqualitysettings: {
		        addQualityLevel: this.addQualityLevel,
		        showContextMenu: this.showQualityLevelsContextMenu
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
			nwtoolbar: {
				showLoadProject    : this.showLoadProject,
				showProjectSettings: this.showProjectSettings,
				showCreateProject  : this.showCreateProject,
				saveProject        : this.globalSave,
				callCleanBuild     : this.callCleanBuild,
				callExportTarget   : function( menu, item ){
					this.exportActiveProject( item.target )
				},
				callDebugTarget    : function( menu, item ){
					this.callBuildTarget( this.BUILD_DEBUG, item.target )
				},
				callReleaseTarget  : function( menu, item ){
					this.callBuildTarget( this.BUILD_RELEASE, item.target )
				}
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
			'button[action="showBuildResultInBrowser"]': {
				click: this.showBuildResultInBrowser
			},
			'spelledconfigure': {
				loadProjects: function() {
					this.application.loadProjects()
				}
			},
			'buildtargetsmenu': {
				click: this.dispatchBuildTargetClick
			},
			'spelledmenu [action="callCleanBuild"]': {
				click: this.callCleanBuild
			},
			'projectplugins': {
				fillpluginform: this.fillPluginSettings
			}
        })

		this.application.on( {
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

	BUILD_RELEASE: 'buildRelease',
	BUILD_DEBUG  : 'buildDebug',

	fillPluginSettings: function( view, plugin, form ) {
		var project = this.application.getActiveProject(),
			name    = plugin.get( 'pluginId' ),
			config  = project.getPlugin( name )

		form.getForm().setValues( Ext.Object.merge( {}, config, { name: name } ) )
	},

	showBuildResultInBrowser: function( button ) {
		var project    = this.application.getActiveProject(),
			tmp        = button.buildType === this.BUILD_DEBUG ? 'debug' : 'release',
			folderPath = [ project.get( 'name' ), 'build', tmp, button.target, 'index.html' ]

		window.open( Spelled.Converter.toWorkspaceUrl( folderPath.join( '/') ) )
	},

	buildActionsCallback: function( buildType, target, msg, response ){
		Spelled.Logger.log( 'INFO', response.output )
		Ext.Msg.close()

		var buttons = [
			{
				text: 'Ok',
				handler: function() {
					this.up('window').close()
				}
			}
		]

		if( target ) {
			buttons.push(
				{
					text: 'Preview',
					action: 'showBuildResultInBrowser',
					target: target,
					buildType: buildType
				}
			)

			if( Spelled.platform.Adapter.isNodeWebKit() ) {
				buttons.push(
					{
						text: 'Show result',
						action: 'showBuildResult',
						target: target,
						buildType: buildType
					}
				)
			}
		}


		Ext.create('Ext.window.Window', {
			title: 'Finished',
			height: 200,
			width: 400,
			layout: 'fit',
			cls: 'console-message-info',
			items: {
				autoScroll:true,
				html: "Finished: " + msg + "\n\n" + response.output
			},
			buttons: buttons
		}).show()
	},

	callCleanBuild: function( menu ) {
		if( !this.application.hasActiveProject() ) return Spelled.MessageBox.showMissingProjectsError()

		var project = this.application.getActiveProject(),
			name    = project.get( 'name'),
			msg     = 'Cleaning project: "' + name + '"'

		Ext.Msg.wait( 'Please wait...', msg )

		Spelled.SpellBuildActions.buildClean(
			name,
			function( provider, response ) {
				this.buildActionsCallback( menu.action, null, msg, response )
			},
			this
		)
	},

	callBuildTarget: function( buildActionName, target ) {
		if( !this.application.hasActiveProject() ) return Spelled.MessageBox.showMissingProjectsError()

		var project = this.application.getActiveProject(),
			msg     = 'Building target "' +target +'"'

		Ext.Msg.wait( 'Please wait...', msg )

		Spelled.SpellBuildActions[ buildActionName ](
			project.get( 'name' ),
			target,
			function( provider, response ) {
				if( !!response.data ) {
					this.buildActionsCallback( buildActionName, target, msg, response )
				} else {
					Spelled.MessageBox.showBuildServerConnectError( response )
				}
			},
			this
		)
	},

	dispatchBuildTargetClick: function( menu, item ) {
		var action = menu.action,
			target = item.target

		switch( action ) {
			case 'callExportTarget':
				this.exportActiveProject( target )
				break
			case 'callDebugTarget':
				this.callBuildTarget( this.BUILD_DEBUG, target )
				break
			case 'callReleaseTarget':
				this.callBuildTarget( this.BUILD_RELEASE, target )
				break
		}
	},

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
			if( !project.getDefaultLanguageKey() ) {
				project.get( 'config' ).defaultLanguage = language.getId()
			}

			languages.add( language )
			this.application.fireEvent( 'addedLanguage', language )
		}

		window.close()
	},

	removeQualityLevel: function( button ) {
		var view     = button.up( 'menu' ),
			qualityLevels = view.ownerView

		qualityLevels.store.remove( qualityLevels )
	},

	showQualityLevelsContextMenu: function( grid, record, cell, idx, e ) {

		this.application.fireEvent( 'showcontextmenu', this.getProjectSettingsQualityLevelsContextMenuView(), e, record )
	},

	addQualityLevel: function( button ) {
		var grid = button.down( 'grid' )

		grid.getStore().add( { name: 'Name', level: 99 } )
	},

	setProjectSettings: function( button ) {
		var window        = button.up( 'window' ),
			generalConfig = window.down( 'projectgeneralsettings' ),
			languageConf  = window.down( 'projectlanguagesettings' ),
			qualityConf   = window.down( 'projectqualitysettings' ),
            androidConf   = window.down( 'projectandroidsettings' ),
            iosConf       = window.down( 'projectiossettings' ),
			tizenConf     = window.down( 'projecttizensettings' ),
			webConf       = window.down( 'projectwebsettings' ),
			winstoreConf  = window.down( 'projectwindowssettings' ),
			winphoneConf  = window.down( 'projectwindowsphonesettings' ),
			pluginConf    = window.down( 'projectplugins' ),
			project       = generalConfig.getRecord(),
			generalValues = generalConfig.getValues(),
			languageValues = languageConf.getValues(),
			config        = {}

        config.android = Ext.clone( androidConf.getValues() )
        config.ios     = Ext.clone( iosConf.getValues() )
		config.tizen   = Ext.clone( tizenConf.getValues() )
		config.web     = Ext.clone( webConf.getValues() )
		config.winstore = Ext.clone( winstoreConf.getValues() )
		config.winphone = Ext.clone( winphoneConf.getValues() )
		config.plugins = pluginConf.getPluginsConfig()

		config.screenSize = [
			parseInt( generalValues.screenSizeX, 10 ),
			parseInt( generalValues.screenSizeY, 10)
		]

		Ext.copyTo( config, generalValues, 'loadingScene,screenMode,orientation,projectId,version' )
		config.defaultLanguage = languageValues.defaultLanguage

		config.qualityLevels = qualityConf.getTransformedQualityData()

		project.set( 'config', config )
		project.setDirty()

		project.save()

		window.close()
	},

	updateSaveButtonState: function() {
		var state  = this.checkIfDirty(),
			button = this.getSaveButton()

		if( button ) button.setDisabled( !state )
	},

	projectCloseWarning: function() {
		if( this.checkIfDirty() && ( !Spelled.Configuration.isDemoInstance() && !window._error_handler ) ) return "You have unsaved changes!"
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
							if( item.isReadonly && item.isReadonly() ) return true

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
				quality  = view.down( 'projectqualitysettings'),
                ios      = view.down( 'projectiossettings'),
                android  = view.down( 'projectandroidsettings'),
				tizen    = view.down( 'projecttizensettings'),
				web      = view.down( 'projectwebsettings'),
				winstore = view.down( 'projectwindowssettings'),
				winphone = view.down( 'projectwindowsphonesettings'),
				store    = project.getSupportedLanguages()

			store.sort( 'name' )
			language.down( 'combo[name="defaultLanguage"]' ).bindStore( store )
			language.down( 'grid[name="supportedLanguages"]' ).reconfigure( store )

			quality.down( 'grid[name="qualityLevels"]' ).reconfigure( project.getQualityLevelsStore() )

			general.loadRecord( project )
			language.loadRecord( project )

			general.setValues( config )
			language.setValues( config )

			if( config.screenSize ) general.setValues( { screenSizeX: config.screenSize[0], screenSizeY: config.screenSize[1] } )

            if( config.ios ) ios.setValues( config.ios )

            if( config.android ) android.setValues( config.android )

			if( config.tizen ) tizen.setValues( config.tizen )

			if( config.web ) web.setValues( config.web )

			if( config.winstore ) winstore.setValues( config.winstore )

			if( config.winphone ) winphone.setValues( config.winphone )

		} else {
			Spelled.MessageBox.showMissingProjectsError()
		}
	},

    showCreateProject: function() {
        var View = this.getProjectCreateView(),
			view = new View( { closable: this.application.hasActiveProject() } ),
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

    showLoadProject: function( ) {
        var View = this.getProjectLoadView(),
			view = new View( { closable: this.application.hasActiveProject() } )

        view.show()
    },

	saveActiveProject: function( callback ) {
		if( !this.application.hasActiveProject() ) return Spelled.MessageBox.showMissingProjectsError()

		var project = this.application.getActiveProject()

		project.save( {	callback: callback } )
	},

	exportActiveProject: function( target ) {
		if( !this.application.hasActiveProject() ) return Spelled.MessageBox.showMissingProjectsError()

		var project        = this.application.getActiveProject(),
			projectName    = project.get( 'name' ),
			exportFileName = projectName +".zip"

		var progress = Ext.Msg.wait( 'Please wait...', 'Exporting project' )

		Spelled.SpellBuildActions.buildExport(
			projectName,
			exportFileName,
			target,
			function( provider, response ) {
				progress.close()

				if( !!response.data ) {
					window.location = Spelled.Converter.toWorkspaceUrl( '/' + exportFileName )
				} else {
					Spelled.MessageBox.showBuildServerConnectError( response )
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
		return 1 / ( this.storesForSave.length + 2 )
	},

	iterateLoadingProgress: function( text ) {
		var lastProgress = Ext.MessageBox.progressBar.value || 0,
			nextProgress = lastProgress + this.PROGRESS_STEP()

		Ext.Msg.updateProgress( nextProgress, Math.round( 100 * nextProgress ) + '% completed', text || null )

		if( nextProgress > 0.9999 ) {
			Ext.Msg.close()
		}
	},

    loadProject: function( projectName, initialize ) {
		var record = this.getProjectsStore().findRecord( 'name', projectName, null, null, null, true ),
			me     = this

		if( !record ) return this.showStartScreen()

		Ext.Msg.show({
			title: 'Please wait',
			msg: 'Loading project items...',
			progressText: 'Initializing...',
			width: 300,
			progress: true
		})

		var callback = function() {
			me.prepareStores( projectName )
			me.closeAllTabsFromProject()
			me.loadStores( projectName )
		}

		if( !initialize ) {
			Spelled.SpellBuildActions.initDirectory( projectName, false, callback )

		} else {
			callback()
		}
	},

	storesReadyCallback: function( projectName ) {
		var Project = this.getProjectModel(),
			record  = this.getProjectsStore().findRecord( 'name', projectName, null, null, null, true )

		this.application.setActiveProject( record )

		Project.load(
			record.getId(),
			{
				scope: this,
				success: function( project ) {
					this.iterateLoadingProgress( "Preparing project..." )

					setTimeout(
						Ext.bind( function() {
								//Needed because scenes got fetched
								this.application.setActiveProject( project )
								Ext.state.Manager.set( 'projectName', project.get('name') )

								this.projectLoadedCallback( project )
							},
							this
						),
						50
					)
				}
			}
		)
	},

	loadStores: function( project ) {
		var me        = this,
			stores    = Ext.clone( this.storesForSave ),
			getStore  = Ext.getStore,
			loadStore = function() {
				var store = stores.shift()

				if( !store ) {
					me.storesReadyCallback( project )

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

		var tree       = this.getScenesTree(),
			startScene = project.getStartScene(),
			rootNode   = tree.getRootNode(),
			node       = rootNode.findChild( 'id', startScene.getId(), true )

		project.unDirty()

		tree.getSelectionModel().select( node )

		rootNode.collapseChildren( true )

		this.getNavigator().defaultTitle = project.get( 'name' )
		this.getScenes().changeTitle()

		this.application.fireEvent( 'renderscene', startScene )
		this.application.fireEvent( 'buildnamespacenodes' )
	},

	closeAllTabsFromProject: function() {
		this.application.fireEvent( 'closealltabs' )
	},

    getScenesList: function( project ) {
	    this.application.getController('Scenes').showScenesList( project.getScenes() )
    }
});
