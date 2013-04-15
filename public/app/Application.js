Ext.define('Spelled.Application', {
	extend: 'Ext.app.Application',

	name: 'Spelled',
	requires: [
		'Ext.state.CookieProvider',
		'Spelled.view.ui.SpelledViewport',
		'Spelled.Configuration'
	],

	appFolder: 'app',

	controllers: [
		'Layout',
		'Scenes',
		'Entities',
		'Menu',
		'Projects',
		'Components',
		'Assets',
		'assets.Translations',
		'Templates',
		'Scripts',
		'Systems',
		'Library',
		'templates.Components',
		'templates.Entities',
		'templates.Systems'
	],

	storeIds: [
		'template.Entities',
		'template.Components',
		'template.Systems',
		'asset.Animations',
		'asset.Fonts',
		'asset.KeyFrameAnimations',
		'asset.KeyToActionMappings',
		'asset.Sounds',
		'asset.SpriteSheets',
		'asset.Appearances',
		'asset.TileMaps',
		'asset.Translations',
		'script.Scripts',
		'config.Scenes',
		'asset.KeyFrameAnimationPreviews'
	],

	refs: [
		{
			ref : 'MainPanel',
			selector: '#MainPanel'
		},
		{
			ref: 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref: 'ScenesTree',
			selector: '#ScenesTree'
		}
	],

	project: undefined,
	renderedScene: undefined,

	sendDebugMessage: function( target, type, payload ) {
		this.engineMessageBus.send( target, { type : 'spell.debug.' + type, payload : payload } )
	},

	selectNode: function( tree, node ) {
		tree.selectPath( node.getPath() )
		tree.getSelectionModel().deselectAll()
		tree.getSelectionModel().select( node )
	},

	generateFileIdFromObject: function( object ) {
		return this.getActiveProject().get('name') + "/library/" + (( object.namespace.length > 0 ) ? object.namespace.replace( /\./g, "/" ) +"/"+ object.name : object.name)
	},

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

	showGridActionColumn: function( grid, record, item ) {
		var icons = Ext.DomQuery.select('.edit-action-icon', item )

		this.showActionColumnIcons( icons )
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

	getRenderedScene: function() {
		return this.renderedScene
	},

	setRenderedScene: function( scene ) {
		this.renderedScene = scene
	},

	isRenderedSceneLastSelectedScene: function() {
		return this.getLastSelectedScene() === this.getRenderedScene()
	},

	getLastSelectedScene: function() {
		var sceneController = this.getController( 'Scenes' ),
			getScenesNode = function( node ) {
				var parentNode = node.parentNode

				if( !parentNode || sceneController.getTreeItemType( node ) === sceneController.TREE_ITEM_TYPE_SCENE ) return node
				else return getScenesNode( parentNode )
			},
			scenesNode = getScenesNode( this.getLastSelectedNode( this.getScenesTree() ) )

		return Ext.getStore( 'config.Scenes' ).getById( scenesNode.getId() )
	},

	setExtraParamOnProxies: function( name, value ) {
		Ext.each(
			this.storeIds,
			function( storeId ) {
				Ext.getStore( storeId ).getProxy().setExtraParam( name, value )
			}
		)
	},

	dirtySaveAlert: function( model, callback ) {
		Ext.Msg.confirm(
			'You have unsaved changes',
			'Do you really want to close this tab?<br/>Your changes will be discarded.',
			function( button ) {
				if ( button === 'yes' && Ext.isObject( model ) ) {
					this.fireEvent( 'revertModel', model )
				}

				callback( button )
			},
			this
		)
	},

	init: function() {
		Ext.Direct.on('exception', function( response ) {
			if( !Ext.Msg.isVisible() ) {
				Ext.Msg.show({
					closable: false,
					title: 'Critical Error',
					msg: "Could not execute '" + response.transaction.action +"."+ response.transaction.method +
						"': <br/><br/>"+ response.xhr.responseText,
					icon: Ext.MessageBox.ERROR
				})
			}
		})

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

		//TODO: Bug in ExtJS setValues, uses Ext.iterate which is BAD because it checkes length attribute as condition
		Ext.override(
			Ext.form.Basic,
			{
				setValues: function( values ) {
					var me = this,
						v, vLen, val, field;

					function setVal(fieldId, val) {
						var field = me.findField(fieldId);
						if (field) {
							field.setValue(val);
							if (me.trackResetOnLoad) {
								field.resetOriginalValue();
							}
						}
					}

					if (Ext.isArray(values)) {
						// array of objects
						vLen = values.length;

						for (v = 0; v < vLen; v++) {
							val = values[v];

							setVal(val.id, val.value);
						}
					} else {
						// object hash
						Ext.Object.each(values, setVal);
					}
					return this
				}
			}
		)

		//load configuration from global CONFIGURATION variable that is defined in app-initialize
		this.configuration = Spelled.Configuration

		/**
		 * Message bus used for communication with engine instances.
		 */
		this.engineMessageBus = Ext.create( 'Spelled.MessageBus' )

		window.addEventListener(
			'message',
			Ext.bind( this.engineMessageBus.receive, this.engineMessageBus ),
			false
		)
	},

	showSpellEdConfig: function() {
		Ext.state.Manager.clear( 'workspacePath' )
		Ext.create( 'Spelled.view.ui.SpelledConfiguration' ).show()
	},

	loadProjects: function() {
		var loadingComplete = function() {
			this.getController( 'Projects').loadLastProject()
		}

		this.engineMessageBus.addHandler( {'spelled.debug.consoleMessage' : function( sourceId, payload ) {
			Spelled.Logger.log( payload.level, payload.text )
		}} )

		Ext.getStore( 'Projects' ).load({
			callback: loadingComplete,
			scope: this
		})
	},

	launch: function() {
		var me = this

		Spelled.Configuration.createStateProvider()

		Ext.get('loading').remove()
		Ext.get('loading-mask').fadeOut( {
			remove: true
		} )

		Ext.create( 'Spelled.view.ui.SpelledViewport' )

		if( Spelled.Configuration.isNodeWebKit() ) {
			var workspacePath = Spelled.Configuration.getWorkspacePath()

			if( !workspacePath )
				me.showSpellEdConfig()
			else {
				var provider = Ext.direct.Manager.getProvider( 'webkitProvider')
				provider.createWebKitExtDirectApi( function() {
					me.loadProjects()
				} )
			}
		} else {
			me.loadProjects()
		}
	}
});
