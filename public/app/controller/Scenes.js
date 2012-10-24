Ext.define('Spelled.controller.Scenes', {
	extend: 'Ext.app.Controller',

	requires: [
		'Spelled.Logger',
		'Spelled.MessageBus',
		'Spelled.view.scene.ProgressBar',

		'widget.label'
	],

	models: [
		'config.Scene'
	],

	stores: [
		'AspectRatios',
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
		},
		{
			ref : 'Library',
			selector: '#Library'
		},
		{
			ref : 'Scenes',
			selector: '#Scenes'
		},
		{
			ref : 'ProgressBar',
			selector: 'spellprogressbar'
		}
	],

	views: [
		'scene.TreeList',
		'scene.Navigator',
		'scene.Create',
		'scene.Editor',
		'scene.Script',
		'ui.SpelledRendered',
		'scene.ProgressBar'
	],

	TREE_ITEM_TYPE_SCENE         : 1,
	TREE_ITEM_TYPE_ENTITY        : 2,
	TREE_ITEM_TYPE_SYSTEM        : 3,
	TREE_ITEM_TYPE_SCRIPT        : 4,
	TREE_ITEM_TYPE_ENTITIES      : 5,
	TREE_ITEM_TYPE_SYSTEM_ITEM   : 6,
	TREE_ITEM_TYPE_SYSTEM_FOLDER : 7,

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
					this.application.activateTabByEvent( this.getScenes(), event )
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
					this.application.activateTabByEvent( this.getLibrary(), event )
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

		// Keymapping for global Save on ctrl+S
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.S,
				ctrl: true,
				scope: this,
				fn: function( keyCode, e ) {
					e.stopEvent()
					this.application.fireEvent( 'globalsave' )
				}
			}
		)


		// Keymapping for toggle titleSafe
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.I,
				ctrl: true,
				scope: this,
				fn: function( keyCode, e ) {
					e.stopEvent()
					this.renderedSceneToggleButton( 'toggleTitleSafe' )
				}
			}
		)

		// Keymapping for toggle grid
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.B,
				ctrl: true,
				scope: this,
				fn: function( keyCode, e ) {
					e.stopEvent()
					this.renderedSceneToggleButton( 'toggleGrid' )
				}
			}
		)

		// Keymapping for fullscreen
		Spelled.KeyMap.addBinding(
			{
				key: Ext.EventObject.U,
				ctrl: true,
				scope: this,
				fn: this.fullScreenKeyEvent
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

						me.engineMessageBus.send(
							sourceId,
							{
								type : "spelled.debug.simulateScreenAspectRatio",
								payload : {
									aspectRatio:  me.application.getActiveScene().get( 'aspectRatio' )
								}
							}
						)

						me.engineMessageBus.send(
							sourceId,
							{
								type : "spelled.debug.drawTitleSafeOutline",
								payload : me.application.getActiveScene().get( 'showTitleSafe' )
							}
						)

					},
					'spell.debug.consoleMessage' : function( sourceId, payload ) {
						Spelled.Logger.log( payload.level, payload.text )
					},
					'spell.loadingProgress' : function( sourceId, payload ) {
						me.updateRenderProgress( payload )
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
			'renderedscene > toolbar combobox[name="aspectRatioSelector"]': {
				change: this.changeAspectRatio
			},
			'renderedscene > toolbar button[action="reloadScene"]': {
				click: me.reloadScene
			},
			'renderedscene > toolbar button[action="toggleGrid"]': {
				toggle: me.toggleGrid
			},
			'renderedscene > toolbar button[action="toggleTitleSafe"]': {
				toggle: me.toggleTitleSafe
			},
			'renderedscene > toolbar button[action="fullscreen"]': {
				click: me.activateFullscreen
			},

			'scenetreelist > treeview': {
				drop : me.dispatchTreeNodeDrop
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
				click: me.createSceneAction
			},
			'scenesnavigator': {
				activate: me.showScenesEditor
			},
			'scripteditor': {
				reloadscene: this.reloadSceneKeyEvent,
				toggle: this.renderedSceneToggleButton,
				fullscreen: this.fullScreenKeyEvent,
				scriptvalidation: this.sendScriptChangeToEngine
			}
		})

		this.application.on({
			clearstores: this.clearScenesStore,
			scenescriptbeforeclose: this.checkIfSceneScriptIsDirty,
			reloadscene: this.reloadSceneKeyEvent,
			scenetabchange: this.showScenesEditor,
			systemchange: this.sendSystemChangeToEngine,
			assetchange: this.sendAssetChangeToEngine,
			scope: this
		})
	},

	getSpelledIframe: function() {
		return this.getSceneEditor().down( 'spellediframe' )
	},

	sendAssetChangeToEngine: function( asset ) {
		var data    = asset.getData(),
			payload = Ext.amdModules.assetConverter.toEngineFormat( data )

		Ext.copyTo( payload, data, 'name,namespace' )
		this.sendChangeToEngine( "spelled.debug.updateAsset", { definition: payload } )
	},

	sendChangeToEngine: function( type, payload ) {
		var iframe     = this.getSpelledIframe()

		this.engineMessageBus.send(
			iframe.getId(),
			{
				type : type,
				payload : payload
			}
		)
	},

	sendSystemChangeToEngine: function( model ) {
		var definition = model.getData( true )
		this.sendChangeToEngine(
			"spelled.debug.updateSystem",
			{
				definition: Ext.amdModules.systemConverter.toEngineFormat( definition )
			}
		)
	},

	sendScriptChangeToEngine: function( model, annotations ) {
		var breakpoints = model.get( 'breakpoints'),
			lines = model.get( 'content' ).split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/),
			hasBreakpoints = undefined


		if ( breakpoints !== undefined ) {
			//check for active breakpoints and add the debugger statement for each breakpoint
			for (var i=0; i<lines.length; i++) {
				if ( breakpoints[i] !== undefined ) {
					lines[i] = 'debugger; ' + lines[i]
					hasBreakpoints = true
				}
			}
		}

		//don't send an update to the engine if we have no breakpoint enabled and active warnings/errors
		if( !hasBreakpoints && annotations.length > 0 ) return

		this.sendChangeToEngine(
			"spelled.debug.updateScript",
			{
				id: model.getFullName(),
				moduleSource: lines.join("\n")
			}
		)
	},

	clearScenesStore: function() {
		this.getConfigScenesStore().removeAll()
	},

	changeAspectRatio: function( field, newValue, oldValue ) {
		var sceneEditor = this.getSceneEditor(),
			scene       = this.application.getActiveScene(),
			iframe      = sceneEditor.getActiveTab().down( 'spellediframe' )

		scene.set( 'aspectRatio', newValue )

		this.engineMessageBus.send(
			iframe.getId(),
			{
				type : 'spelled.debug.simulateScreenAspectRatio',
				payload : {
					aspectRatio: newValue
				}
			}
		)
	},

	dispatchTreeDblClick: function( treePanel, record ) {
		//TODO: refactor to listen on itemclicks even if its selected.
		this.dispatchTreeClick( treePanel, record  )

		switch( this.getTreeItemType( record ) ) {
			case this.TREE_ITEM_TYPE_SCRIPT:
				this.openSceneScript()
				break
			case this.TREE_ITEM_TYPE_SYSTEM_ITEM:
				this.application.fireEvent( 'showSystemItem', treePanel, record )
				break
			default:
				return
		}
	},

	renderedSceneToggleButton: function( action ) {
		var sceneEditor = this.getSceneEditor(),
			sceneTab    = sceneEditor.items.first(),
			button      = sceneTab.down( 'toolbar button[action="' + action + '"]' )

		if( sceneTab && !sceneEditor.isHidden() && button) button.toggle()
	},

	fullScreenKeyEvent: function( keyCode, e ) {
		var sceneEditor = this.getSceneEditor(),
			sceneTab    = sceneEditor.items.first()

		if( e )	e.stopEvent()

		if( sceneTab && !sceneEditor.isHidden() )
			this.activateFullscreen( sceneTab.down( 'button' ) )
	},

	openSceneScript: function(){
		var sceneEditor = this.getSceneEditor(),
			scene       = this.application.getActiveScene(),
			title       = scene.getFullName(),
			foundTab    = this.application.findActiveTabByTitle( sceneEditor, title )

		if( foundTab )
			return foundTab

		var view = Ext.widget( 'scenescriptedit', {
			title: title,
			model: scene
		} )

		this.application.createTab( sceneEditor, view )
	},

	checkIfSceneScriptIsDirty: function( panel ) {
		var scene = panel.model

		if( scene.dirty ) {
			var callback = function( button ) {
				if ( button === 'yes') {
					scene.revertScript()
					panel.destroy()
				}
			}

			this.application.dirtySaveAlert( null, callback )
			return false
		} else {
			panel.destroy()
		}
	},

	reloadSceneKeyEvent: function( keyCode, e ) {
		var sceneEditor = this.getSceneEditor(),
			sceneTab    = sceneEditor.items.first()

		if( e )	e.stopEvent()

		if( sceneTab && !sceneEditor.isHidden() )
			this.reloadScene( sceneTab.down( 'button' ) )
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
		return ( this.getTreeItemType( e.record ) === this.TREE_ITEM_TYPE_ENTITY )
	},

	setDefaultScene: function( scene ) {
		var project = this.application.getActiveProject(),
			tree    = this.getScenesTree()

		project.set( 'startScene', scene.getFullName() )

		tree.getRootNode().eachChild( function( child ) {
			if( child.getId() === scene.getId() ) {
				child.set( 'iconCls', "tree-default-scene-icon" )
			} else {
				child.set( 'iconCls', "tree-scene-icon" )
			}
		})
	},

	dispatchTreeNodeDrop: function(  node, data, overModel, dropPosition ) {
		var record = data.records[ 0 ]

		switch( this.getTreeItemType( record ) ){
			case this.TREE_ITEM_TYPE_SYSTEM_ITEM:
				this.application.fireEvent( 'movescenesystem', record )
				break
			case this.TREE_ITEM_TYPE_ENTITIES:
			case this.TREE_ITEM_TYPE_ENTITY:
				this.application.fireEvent( 'movesceneentity', overModel.getId(), record.getId(), dropPosition  )
				break
		}
	},

	getTreeItemType: function( record ) {
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
			case 'tree-system-icon':
				type = this.TREE_ITEM_TYPE_SYSTEM_ITEM
				break
			case 'tree-system-folder-icon':
				type = this.TREE_ITEM_TYPE_SYSTEM_FOLDER
				break
		}

		return type
	},

	dispatchTreeListContextMenu: function( gridView, list, columnIndex, rowIndex, e ) {
		var node = gridView.getRecord( gridView.findTargetByEvent(e) )
		e.stopEvent()

		switch( this.getTreeItemType( node ) ) {
			case this.TREE_ITEM_TYPE_ENTITIES:
				this.application.getController( 'Entities').showEntitiesFolderListContextMenu( gridView, node, columnIndex, rowIndex, e )
				break
			case this.TREE_ITEM_TYPE_SCENE:
				this.showListContextMenu( gridView, list, node, rowIndex, e )
				break
			case this.TREE_ITEM_TYPE_SYSTEM_ITEM:
				this.application.getController( 'Systems').showSceneSystemsItemListContextMenu( gridView, node, columnIndex, rowIndex, e )
				break
			case this.TREE_ITEM_TYPE_SYSTEM:
			case this.TREE_ITEM_TYPE_SYSTEM_FOLDER:
				this.application.getController( 'Systems').showSceneSystemsListContextMenu( gridView, node, columnIndex, rowIndex, e )
				break
			case this.TREE_ITEM_TYPE_ENTITY:
				this.application.getController( 'Entities').showListContextMenu( gridView, node, columnIndex, rowIndex, e )
				break
		}
	},

	dispatchMouseEnterTree: function( view, list, node, rowIndex, e  ) {
		var icons  = undefined,
			record = view.getRecord( node )

		switch( this.getTreeItemType( record ) ) {
			case this.TREE_ITEM_TYPE_ENTITIES:
			case this.TREE_ITEM_TYPE_ENTITY:
			case this.TREE_ITEM_TYPE_SCENE:
			case this.TREE_ITEM_TYPE_SYSTEM:
			case this.TREE_ITEM_TYPE_SYSTEM_ITEM:
				icons = Ext.DomQuery.select( '.edit-action-icon', node)
				break
		}

		this.application.showActionColumnIcons( icons )
	},

	dispatchTreeClick: function( treePanel, record ) {
		this.getRightPanel().removeAll()

		switch( this.getTreeItemType( record ) ) {
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
				this.application.fireEvent( 'showentityinfo', record.getId() )
				break
			case this.TREE_ITEM_TYPE_SYSTEM:
				var scene = this.getConfigScenesStore().getById( record.parentNode.getId() )
				if( scene ) {
					this.application.setActiveScene( scene )
					this.application.getController('Systems').refreshSceneSystemList( scene )
				}
				break
			case this.TREE_ITEM_TYPE_SYSTEM_ITEM:
				var template = Ext.getStore( 'template.Systems' ).getByTemplateId( record.get( 'text' ) )
				if( template ) this.application.fireEvent( 'showsystemtemplateconfig', template )
				break
			case this.TREE_ITEM_TYPE_SCRIPT:
				var scene = this.getConfigScenesStore().getById( record.parentNode.getId() )
				if( scene ) {
					this.application.setActiveScene( scene )
				}
				break
		}
	},

	showScenesEditor: function() {
		var tree = this.getScenesTree(),
			node = this.application.getLastSelectedNode( tree )

		this.getRightPanel().show()
		this.getRightPanel().removeAll()

		if( node ) this.dispatchTreeClick( tree, node )

		this.getSceneEditor().show()
	},

	showCreateScene: function( ) {
		var View  = this.getSceneCreateView(),
			view = new View()

		view.show()
	},

	createSceneAction: function ( button ) {
		var window = button.up('window'),
			form   = window.down('form'),
			values = form.getValues()

		this.createScene( values )

		window.close()
	},

	createScene: function( values ) {
		var project = this.application.getActiveProject(),
			Model   = this.getConfigSceneModel(),
			store   = this.getConfigScenesStore(),
			content = {
				name: values.name,
				namespace: ( values.namespace === 'root' ) ? '' : values.namespace.substring( 5 )
			}

		content.id = this.application.generateFileIdFromObject( content ) + '.json'
		var scene = new Model( content )
		scene.set( 'content', this.createInitialSceneScriptContent( scene ) )

		store.add( scene )
		project.getScenes().add( scene )
		scene.setProject( project )
		this.initScene( scene )

		scene.appendOnTreeNode( this.getScenesTree().getRootNode() )
		scene.save()

		return scene
	},

	initScene: function( scene ) {
		var entity = scene.getEntities().add( {
			name: 'camera',
			templateId: 'spell.entity.2d.graphics.camera'
		} )[0]

		var cameraComponent = entity.getComponents().add( {
			templateId : "spell.component.2d.graphics.camera",
			changed: true,
			config: {
				"active": true
			}
		} )[0]

		cameraComponent.setEntity( entity )
		entity.setScene( scene )
	},

	showListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showScenesListContextMenu( e )
	},

	deleteScene: function( scene ) {
		var project     = this.application.getActiveProject(),
			scenes      = project.getScenes(),
			sceneEditor = this.getSceneEditor()

		scenes.remove( scene )
		this.application.closeOpenedTabs( sceneEditor, scene.getRenderTabTitle() )
	},

	reloadScene: function( button ) {
		var panel   = button.up( 'panel' ),
			project = this.application.getActiveProject(),
			iframe  = panel.down( 'spellediframe' ),
			sceneId = iframe.sceneId,
			scene   = this.getConfigScenesStore().getById( sceneId )

		iframe.destroy()

		var newIframe = Ext.widget(
			'spellediframe',
			{
				projectName : project.get('name'),
				sceneId : sceneId,
				hidden: true
			}
		)

		panel.add( [ newIframe, { xtype: 'spellprogressbar'} ] )

		this.engineMessageBus.send(
			newIframe.getId(),
			{
				type : 'spelled.debug.startRuntimeModule',
				payload : {
					runtimeModule: Ext.amdModules.createProjectInEngineFormat( project ),
					scene: Ext.amdModules.sceneConverter.toRuntimeModuleFormat( scene.getData( true ) )
				}
			}
		)
	},

	updateRenderProgress: function( value ) {
		var progressBar = this.getProgressBar(),
			panel       = progressBar.up( 'renderedscene' )

		progressBar.updateProgress( value )

		if( value === 1 && panel ){
			panel.remove( progressBar )
			panel.down( 'spellediframe').show()
		}
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

	toggleTitleSafe: function( button, state ) {
		var tab   = button.up( 'renderedscene' ).down( 'spellediframe' ),
			scene = this.application.getActiveScene()

		if( !tab ) return

		scene.set( 'showTitleSafe', state )

		this.engineMessageBus.send(
			tab.getId(),
			{
				type : 'spelled.debug.drawTitleSafeOutline',
				payload : state
			}
		)
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
				dom.contentWindow.focus()

				//we need to call this function directly here, because Firefox does
				//not accept calling this function from another context
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
		var tab = Ext.widget(
			'renderedscene',
			{
				title : title,
				showGrid : showGrid
			}
		)

		var iframe = Ext.widget(
			'spellediframe',
			{
				projectName : projectName,
				sceneId : sceneId
			}
		)

		tab.add( iframe )

		return tab
	},

	renderScene: function( scene ) {
		var sceneEditor = this.getSceneEditor(),
			title       = scene.getRenderTabTitle(),
			tab         = this.application.findActiveTabByTitle( sceneEditor, title )

		if( !tab ) {
			var project = this.application.getActiveProject(),
				newTab  = this.createSpellTab(
					title,
					project.get( 'name' ),
					scene.getId(),
					scene.get( 'showGrid' )
				)

			tab = this.application.createTab( sceneEditor, newTab )
		}

		this.setDefaultScene( scene )
		this.reloadScene( tab.down( 'button' ) )
	},

	showScenesList: function( scenes ) {
		var tree     = this.getScenesTree(),
			rootNode = tree.getStore().getRootNode(),
			project  = this.application.getActiveProject()
		rootNode.removeAll()

		scenes.each( function( scene ) {
			var node = scene.appendOnTreeNode( rootNode )

			this.application.getController('Systems').refreshSceneSystemList( scene )

			if( project.get( 'startScene' ) == scene.getFullName() ) {
				node.set( 'iconCls', 'tree-default-scene-icon' )
			}

			node.expand( true, function() { node.collapse( true ) } )
		},this)
	},

	createInitialSceneScriptContent: function( scene ) {
		var parts = [
			"return {",
			"	init : function( spell, sceneConfig ) {",
			"		spell.EntityManager.createEntities( sceneConfig.entities )",
			"	},",
			"	destroy : function( spell, sceneConfig ) {}",
			"}"
		]

		return this.application.getController( 'Scripts' ).createModuleHeader( scene.getFullName(), parts.join( '\n\t\t' ) )
	}
});
