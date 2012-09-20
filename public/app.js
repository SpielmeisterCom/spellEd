require(
	[
		'requireToExt/inject',

		'ace/ace',
		'ace/mode/javascript',
		'ace/theme/pastel_on_dark',

		'spell/editor/createProjectInEngineFormat',
		'spell/editor/converter/project',
		'spell/editor/converter/component',
		'spell/editor/createFontGenerator',
		'spell/editor/systemFontDetector',

		'underscore'
	],
	function(
		injectModulesIntoExt,

		ace,
		aceModeJavascript,
		aceThemePastelOnDark,

		createProjectInEngineFormat,
		projectConverter,
		componentConverter,
		createFontGenerator,
		systemFontDetector,

		_
	) {
		Ext.Loader.setConfig( {
			paths : {
				"Spelled" : "app"
			}
		} );

		injectModulesIntoExt( {
			'ace'                         : ace,
			'aceModeJavascript'           : aceModeJavascript,
			'aceThemePastelOnDark'        : aceThemePastelOnDark,
			'createProjectInEngineFormat' : createProjectInEngineFormat,
			'createFontGenerator'         : createFontGenerator,
			'componentConverter'          : componentConverter,
			'projectConverter'            : projectConverter,
			'systemFontDetector'          : systemFontDetector,
			'underscore'                  : _
		} )

		var resolveDependencies = function( response ) {
			Ext.require(
				JSON.parse( response.responseText ).dependencies,
				createApplication
			);
		};

		var loadDependencies = function() {
			Ext.Ajax.request( {
			   url: 'dependencies.json',
			   success: resolveDependencies
			} );
		};

		var startApplication = function() {
			if( !Ext.Ajax ) throw "Error: Missing dependency Ext.Ajax."

			Ext.Loader.setConfig( { enabled : true } );
			loadDependencies();
		}

		var createApplication = function() {
			Ext.Loader.setConfig( { enabled : false } );

			Ext.application( {
				name: 'Spelled',

				appFolder: 'app',

				controllers: [
					'Scenes',
					'Entities',
					'Menu',
					'Projects',
					'Components',
					'Assets',
					'Templates',
					'Scripts',
					'Systems',
					'templates.Components',
					'templates.Entities',
					'templates.Systems'
				],

				stores: [
					'template.Entities',
					'template.Components',
					'template.Systems',
					'asset.Textures',
					'asset.Sounds',
					'script.Scripts'
				],

				refs: [
					{
						ref : 'MainPanel',
						selector: '#MainPanel'
					},
					{
						ref: 'RightPanel',
						selector: '#RightPanel'
					}
				],

				project: undefined,
				scene: undefined,

				showDocumentation: function( docString ) {
					if( Ext.isObject( this.configuration ) ) {
						var docPath = this.configuration.documentationServerURL + docString
						window.open( docPath, '_blank')
					}
				},

				activateTabByEvent: function( tab, event ) {
					event.stopEvent()
					Ext.getCmp('Navigator').setActiveTab( tab, event )
				},

				showBuildServerConnectError: function() {
					Ext.Msg.alert( 'Service unavailable', "SpellEd can't connect to the Build-Server." )
				},

				getLastSelectedNode: function( treePanel ) {
					return treePanel.getSelectionModel().getLastSelected()
				},

				removeSelectedNode: function( treePanel, callback ) {
					this.getLastSelectedNode( treePanel ).remove()
				},

				createTab: function( tabPanel, view ) {

					var newPanel  = tabPanel.add(
						view
					)

					tabPanel.setActiveTab( newPanel )

					return newPanel
				},

				closeAllTabs: function( tabPanel ) {
					if( !tabPanel ) return

					tabPanel.items.each(
						function( tab ) {
							tab.destroy()
						}
					)
				},

				closeOpenedTabs: function( tabPanel, title ) {
					tabPanel.items.each(
						function( tab ) {
							if( tab.title === title ) {
								tab.destroy()
							}
						}
					)
				},

				findTabByTitle: function( tabPanel, title ) {
					var foundPanel = undefined
					tabPanel.items.each(
						function( panel ) {
							if( panel.title === title ) {
								foundPanel = panel
								return foundPanel
							}
						}
					)

					return foundPanel
				},

				findActiveTabByTitle: function( tabPanel, title ) {
					var foundPanel = this.findTabByTitle( tabPanel, title )
					if( foundPanel ) tabPanel.setActiveTab( foundPanel )
					return foundPanel
				},

				hideMainPanels: function() {
					this.getRightPanel().hide()

					this.getMainPanel().items.each(
						function( panel ) {
							panel.hide()
						}
					)
				},

				hideActions: function( view, list, node, rowIndex, e ) {
					var icons = Ext.DomQuery.select('.x-action-col-icon', node)
					Ext.each( icons, function( icon ){
						Ext.get( icon ).addCls( 'x-hidden' )
					})
				},

				showActionsOnLeaf: function( view, list, node, rowIndex, e ) {
					this.application.showActions( true, view, list, node, rowIndex, e )
				},

				showActionsOnFolder: function( view, list, node, rowIndex, e ) {
					this.application.showActions( false, view, list, node, rowIndex, e )
				},

				showActions: function( showOnLeaf, view, list, node, rowIndex, e ) {
					var icons = Ext.DomQuery.select('.edit-action-icon', node),
						node  = view.getRecord( node )

					if( node.isLeaf() === showOnLeaf && !node.isRoot() ) {
						this.showActionColumnIcons( icons )
					}
				},

				showActionColumnIcons: function( icons ) {
					Ext.each(
						icons,
						function(icon){
							Ext.get(icon).removeCls('x-hidden')
						}
					)
				},

				getActiveProject: function() {
					return this.project
				},

				setActiveProject: function( project ) {
					Ext.state.Manager.set( 'projectName', project.get('name') )
					this.project = project
				},

				getActiveScene: function() {
					return this.scene
				},

				setActiveScene: function( scene ) {
					this.scene = scene
				},

				setExtraParamOnProxies: function( name, value ) {
					Ext.each(
						this.stores,
						function( storeId ) {
							Ext.getStore( storeId ).getProxy().setExtraParam( name, value )
						}
					)
				},

				dirtySaveAlert: function( model, callback ) {
					Ext.Msg.confirm(
						'You have unsaved changed',
						'Do you really want to close this tab? Your changes will be discarded.',
						function( button ) {
							if ( button === 'yes') {
								this.fireEvent( 'revertModel', model )
							}

							callback( button )
						},
						this
					)
				},

				launch: function() {
					var me = this

					//load configuration from global CONFIGURATION variable that is defined in app-initialize
					me.configuration = Ext.app.CONFIGURATION

					Ext.override(
						Ext.data.proxy.Direct,
						{
							listeners: {
								exception: {
									fn: function( proxy, response ) {
										Ext.Msg.alert(
											'An Error occurred',
											"Could not execute '" + response.transaction.action +"."+ response.transaction.method +"': <br/><br/>"+ response.xhr.responseText
										)
									}
								}
							}
						}
					)

					Ext.Direct.on('exception', function( response ) {
						if( !Ext.Msg.isVisible() ) {
							Ext.Msg.show({
								buttons: Ext.Msg.OK,
								title: 'Critical Error',
								msg: "Could not execute '" + response.transaction.action +"."+ response.transaction.method +
									"': <br/><br/>"+ response.xhr.responseText,
								icon: Ext.MessageBox.ERROR
							})
						}
					})

					Ext.direct.Manager.addProvider( Ext.app.REMOTING_API )

					var loadingComplete = function() {
						Ext.get('loading').remove()
						Ext.get('loading-mask').fadeOut( {
							remove: true
						} )

						Ext.create('Spelled.view.ui.SpelledViewport')
						var stateProvider = Ext.create( 'Ext.state.CookieProvider')
						Ext.state.Manager.setProvider( stateProvider )
						this.getController( 'Projects').loadLastProject()
					}

					Ext.getStore( 'Projects' ).load({
						callback: loadingComplete,
						scope: this
					})
				}
			} )
		};

		startApplication();
	}
)
