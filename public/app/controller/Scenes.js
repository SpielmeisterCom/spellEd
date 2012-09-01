Ext.define('Spelled.controller.Scenes', {
	extend: 'Ext.app.Controller',

	requires: [
		'Spelled.Logger',
		'Spelled.MessageBus'
	],

	models: [
		'config.Scene'
	],

	stores: [
		'ScenesTree',
		'config.Scenes'
	],

	refs: [
		{
			ref : 'MainPanel',
			selector: '#MainPanel'
		},
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref : 'ScenesTree',
			selector: '#ScenesTree'
		},
		{
			ref : 'SceneEditor',
			selector: '#SceneEditor'
		}
	],

	views: [
		'scene.TreeList',
		'scene.Navigator',
		'scene.Create',
		'scene.Editor',
		'scene.Script',
		'ui.SpelledRendered'
	],

	TREE_ITEM_TYPE_SCENE    : 1,
	TREE_ITEM_TYPE_ENTITY   : 2,
	TREE_ITEM_TYPE_SYSTEM   : 3,
	TREE_ITEM_TYPE_SCRIPT   : 4,
	TREE_ITEM_TYPE_ENTITIES : 5,

	/**
	 * Message bus used for communication with engine instances.
	 */
	engineMessageBus : undefined,


	init: function() {
		var me = this

		//Show Scenes on ctrl+1
		Spelled.KeyMap = new Ext.util.KeyMap( document,
			{
				key: Ext.EventObject.ONE,
				ctrl: true,
				scope: this,
				handler: function( keycode, event) {
					this.application.activateTabByEvent( Ext.getCmp('Scenes'), event )
				}
			}
		)
		//Show Templates on ctrl+2
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.TWO,
				ctrl: true,
				scope: this,
				handler: function( keycode, event) {
					this.application.activateTabByEvent( Ext.getCmp('Templates'), event )
				}
			}
		)
		//Show Assets on ctrl+1
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.THREE,
				ctrl: true,
				scope: this,
				handler: function( keycode, event) {
					this.application.activateTabByEvent( Ext.getCmp('Assets'), event )
				}
			}
		)
		//Show Assets on ctrl+4
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.FOUR,
				ctrl: true,
				scope: this,
				handler: function( keycode, event) {
					this.application.activateTabByEvent( Ext.getCmp('Scripts'), event )
				}
			}
		)

		// Keymapping for reloadingScenes on ctrl+R
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.R,
				ctrl: true,
				scope: this,
				fn: me.reloadSceneKeyEvent
			}
		)

		// initializing the engine message bus
		this.engineMessageBus = Ext.create(
			'Spelled.MessageBus',
			{
				handlers : {
					'spell.initialized' : function( sourceId, payload ) {
						me.engineMessageBus.flushQueue( sourceId )

						me.engineMessageBus.send(
							sourceId,
							{
								type : "spelled.debug.drawCoordinateGrid",
								payload : me.application.getActiveScene().get( 'showGrid' )
							}
						)
					},
					'spell.debug.consoleMessage' : function( sourceId, payload ) {
						Spelled.Logger.log( payload.level, payload.text )
					}
				}
			}
		)

		window.addEventListener(
			'message',
			Ext.bind( this.engineMessageBus.receive, this.engineMessageBus ),
			false
		)


		this.control({
			'renderedscene': {
				show: function( panel ) {
					panel.down( 'spellediframe').focus()
				}
			},
			'renderedscene > toolbar button[action="reloadScene"]': {
				click: me.reloadScene
			},
			'renderedscene > toolbar button[action="toggleGrid"]': {
				toggle: me.toggleGrid
			},
			'renderedscene > toolbar button[action="fullscreen"]': {
				click: me.activateFullscreen
			},
			'scenetreelist': {
				itemdblclick   : me.dispatchTreeDblClick,
				select         : me.dispatchTreeClick,
				beforeedit     : me.checkIfTreeColumnIsEditable,
				edit           : me.changeEntityName,
				itemcontextmenu: me.dispatchTreeListContextMenu,
				editclick    :   me.dispatchTreeListContextMenu,
				itemmouseenter : me.dispatchMouseEnterTree,
				itemmouseleave : me.application.hideActions
			},
			'scenetreelist button[action="showCreateScene"]': {
				click: me.showCreateScene
			},
			'createscene button[action="createScene"]' : {
				click: me.createScene
			},
			'scenesnavigator': {
				activate: me.showScenesEditor
			},
			'scenescript combobox[name="scriptId"]' : {
				select: this.setSceneScript
			}
		})
	},

	dispatchTreeDblClick: function( treePanel, record ) {
		switch( this.getClickedTreeItemType( record ) ) {
			case this.TREE_ITEM_TYPE_SCRIPT:
				this.application.getController( 'Scripts').openSceneScript()
				break
			default:
				return
		}
	},

	reloadSceneKeyEvent: function( keyCode, e ) {
		var sceneEditor = this.getSceneEditor(),
			activeTab   = sceneEditor.getActiveTab()

		e.stopEvent()
		if( activeTab && !sceneEditor.isHidden() )
			this.reloadScene( activeTab.down( 'button' ) )
	},

	triggerRenameEntityEvent: function( node ) {
		var cellEditor = this.getScenesTree().getPlugin( 'renameEntityPlugin' )
		cellEditor.startEdit( node, 0 )
	},

	changeEntityName: function( editor, e ) {
		var entity = Ext.getStore( 'config.Entities' ).getById( e.record.getId() )

		entity.set( 'name', e.record.get('text') )
		e.record.commit()
	},

	checkIfTreeColumnIsEditable: function( editor, e ) {
		return ( this.getClickedTreeItemType( e.record ) === this.TREE_ITEM_TYPE_ENTITY )
	},

	setDefaultScene: function( scene ) {
		var project = this.application.getActiveProject(),
			tree    = this.getScenesTree()

		project.set( 'startScene', scene.get( 'name' ) )

		tree.getRootNode().eachChild( function( child ) {
			if( child.getId() === scene.get( 'name' ) ) {
				child.set( 'iconCls', "tree-default-scene-icon" )
			} else {
				child.set( 'iconCls', "tree-scene-icon" )
			}
		})
	},

	getClickedTreeItemType: function( record ) {
		var type = undefined

		switch( record.get('iconCls') ) {
			case 'tree-scene-icon':
			case 'tree-default-scene-icon':
				type = this.TREE_ITEM_TYPE_SCENE
				break
			case 'tree-scene-entity-icon':
			case 'tree-scene-entity-readonly-icon':
				type = this.TREE_ITEM_TYPE_ENTITY
				break
			case 'tree-scene-system-icon':
				type = this.TREE_ITEM_TYPE_SYSTEM
				break
			case 'tree-scene-script-icon':
				type =  this.TREE_ITEM_TYPE_SCRIPT
				break
			case 'tree-entities-folder-icon':
				type = this.TREE_ITEM_TYPE_ENTITIES
				break
		}

		return type
	},

	dispatchTreeListContextMenu: function( gridView, list, columnIndex, rowIndex, e ) {
		var node = gridView.getRecord( gridView.findTargetByEvent(e) )
		e.stopEvent()

		switch( this.getClickedTreeItemType( node ) ) {
			case this.TREE_ITEM_TYPE_ENTITIES:
				this.application.getController( 'Entities').showEntitiesFolderListContextMenu( gridView, node, columnIndex, rowIndex, e )
				break
			case this.TREE_ITEM_TYPE_SCENE:
				this.showListContextMenu( gridView, list, node, rowIndex, e )
				break
			case this.TREE_ITEM_TYPE_ENTITY:
				this.application.getController( 'Entities').showListContextMenu( gridView, node, columnIndex, rowIndex, e )
				break
		}
	},

	dispatchMouseEnterTree: function( view, list, node, rowIndex, e  ) {
		var icons  = undefined,
			record = view.getRecord( node )

		switch( this.getClickedTreeItemType( record ) ) {
			case this.TREE_ITEM_TYPE_ENTITIES:
			case this.TREE_ITEM_TYPE_ENTITY:
			case this.TREE_ITEM_TYPE_SCENE:
				icons = Ext.DomQuery.select( '.edit-action-icon', node)
				break
		}

		this.application.showActionColumnIcons( icons )
	},

	dispatchTreeClick: function( treePanel, record ) {
		this.getRightPanel().removeAll()

		switch( this.getClickedTreeItemType( record ) ) {
			case this.TREE_ITEM_TYPE_SCENE:
				this.getRightPanel().add( { xtype: 'label' , docString : '#!/guide/concepts_scenes'} )

				var scene = this.getConfigScenesStore().getById( record.getId() )
				if( scene ) {
					this.application.setActiveScene( scene )
				}
				break
			case this.TREE_ITEM_TYPE_ENTITIES:
				this.getRightPanel().add( { xtype: 'label' , docString : '#!/guide/concepts_entities_components'} )
				break
			case this.TREE_ITEM_TYPE_ENTITY:
				this.application.getController('Entities').showEntityInfo( record.getId() )
				break
			case this.TREE_ITEM_TYPE_SYSTEM:
				var scene = this.getConfigScenesStore().getById( record.parentNode.getId() )
				if( scene ) {
					this.application.setActiveScene( scene )
					this.application.getController('Systems').refreshSceneSystemList( scene )
				}
				break
			case this.TREE_ITEM_TYPE_SCRIPT:
				var scene = this.getConfigScenesStore().getById( record.parentNode.getId() )
				if( scene ) {
					this.application.setActiveScene( scene )
					this.refreshSceneScriptCombobox( scene )
				}
				break
		}
	},

	refreshSceneScriptCombobox: function( scene ) {
		var contentPanel = this.getRightPanel(),
			View = this.getSceneScriptView(),
			view = new View(),
			combobox = view.down( 'combobox' )

		combobox.select( scene.get('scriptId') )

		contentPanel.add( view )
	},

	setSceneScript: function( combo, records ) {
		var scene = this.application.getActiveScene()

		scene.set('scriptId', combo.getValue())
	},

	showScenesEditor: function() {
		var tree = this.getScenesTree()
		this.application.hideMainPanels()
		this.getRightPanel().show()

		if( tree.getSelectionModel().getSelection().length > 0 ){
			this.dispatchTreeClick( tree, tree.getSelectionModel().getSelection()[0] )
		}

		Ext.getCmp('SceneEditor').show()
	},

	showCreateScene: function( ) {
		var View  = this.getSceneCreateView(),
			Model = this.getConfigSceneModel()

		var view = new View()
		view.down('form').loadRecord( new Model() )

		view.show()
	},

	createScene: function ( button ) {
		var window = button.up('window'),
			form   = window.down('form'),
			record = form.getRecord(),
			values = form.getValues(),
			project= this.application.getActiveProject(),
			store  = this.getConfigScenesStore()

		record.set( values )

		store.add( record )
		project.getScenes().add( record )

		record.appendOnTreeNode( this.getScenesTree().getRootNode() )

		window.close()
	},

	showListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showScenesListContextMenu( e )
	},

	deleteScene: function( scene ) {
		var project  = this.application.getActiveProject(),
			scenes   = project.getScenes(),
			sceneEditor = Ext.getCmp('SceneEditor')

		scenes.remove( scene )
		this.application.closeOpenedTabs( sceneEditor, scene.getRenderTabTitle() )
		this.application.closeOpenedTabs( sceneEditor, scene.getSourceTabTitle() )
	},

	reloadScene: function( button ) {
		var panel   = button.up( 'panel' ),
			project = this.application.getActiveProject(),
			iframe  = panel.down( 'spellediframe' ),
			sceneId = iframe.sceneId,
			me      = this

		var w = Ext.create('Ext.window.Window', {
			modal: true,
			layout: 'fit',
			items: [{
				xtype: "progressbar",
				text : "Updating...",
				width: 300
			}]
		}).show()

		this.application.getController('Projects').saveActiveProject(
			function() {
				iframe.destroy()
				w.close()

				var newIframe = Ext.create(
					'Spelled.view.ui.SpelledIframe',
					{
						projectName : project.get('name'),
						sceneId : sceneId
					}
				)

				panel.add( newIframe )

				me.engineMessageBus.send(
					newIframe.getId(),
					{
						type : 'spelled.debug.executeRuntimeModule',
						payload : Ext.amdModules.createProjectInEngineFormat( project )
					}
				)
			}
		)
	},

	toggleGrid: function( button, state ) {
		var tab   = button.up( 'renderedscene').down( 'spellediframe' ),
			scene = this.application.getActiveScene()

		if( tab ) {
			scene.set( 'showGrid', state )

			this.engineMessageBus.send(
				tab.getId(),
				{
					type : "spelled.debug.drawCoordinateGrid",
					payload : state
				}
			)
		}
	},

	activateFullscreen: function( button, state ) {
		var tab      = button.up( 'renderedscene').down( 'spellediframe'),
			dom      = tab.el.dom,
			prefixes = ["moz", "webkit", "ms", "o", ""],
			docEl    = document.documentElement,
			fullScreenFunctionAvailable = false

		Ext.each(prefixes, function( prefix ) {
			var fnName = (prefix.length > 0) ? "RequestFullScreen" : "requestFullScreen"

			if (dom[prefix + fnName] !== undefined) {
				//we need to call this function directly here, because Firefox does
				//not accept calling a this function from another context
				dom[prefix + fnName]()

				fullScreenFunctionAvailable = true
			}
		})


		if (!fullScreenFunctionAvailable) {
			//inform the user if this function is not available
			window.alert('Sorry, the fullscreen function is not yet supported in your browser. Try using another browser.')
		}
	},

	createSpellTab: function( title, projectName, sceneId, showGrid ) {
		var tab = Ext.create(
			'Spelled.view.ui.SpelledRendered',
			{
				title : title,
				showGrid : showGrid
			}
		)

		var iframe = Ext.create(
			'Spelled.view.ui.SpelledIframe',
			{
				projectName : projectName,
				sceneId : sceneId
			}
		)

		tab.add( iframe )

		return tab
	},

	renderScene: function( scene ) {
		var sceneEditor = Ext.getCmp( "SceneEditor" ),
			title = scene.getRenderTabTitle()

		var foundTab = this.application.findActiveTabByTitle( sceneEditor, title )

		if( foundTab ) {
			return foundTab
		}

		var project = this.application.getActiveProject()

		var tab = this.createSpellTab(
			title,
			project.get( 'name' ),
			scene.getId(),
			scene.get( 'showGrid' )
		)

		this.application.createTab( sceneEditor, tab )

		this.engineMessageBus.send(
			tab.down( 'spellediframe' ).getId(),
			{
				type : 'spelled.debug.executeRuntimeModule',
				payload : Ext.amdModules.createProjectInEngineFormat( project )
			}
		)
	},

	showScenesList: function( scenes ) {
		var tree     = this.getScenesTree(),
			rootNode = tree.getStore().getRootNode(),
			project  = this.application.getActiveProject()
			rootNode.removeAll()

		scenes.each( function( scene ) {
			var node = scene.appendOnTreeNode( rootNode )

			if( project.get( 'startScene' ) == scene.getId() ) {
				node.set( 'iconCls', 'tree-default-scene-icon' )
			}
		})
	}
});
