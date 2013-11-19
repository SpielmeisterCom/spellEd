Ext.define('Spelled.controller.Scenes', {
	extend: 'Ext.app.Controller',

	requires: [
		'Spelled.Logger',
		'Spelled.MessageBus',
		'Spelled.view.scene.Properties',
		'Spelled.view.scene.AddLibraryId',
		'Spelled.view.scene.dependencies.StaticContextMenu',
		'Spelled.view.scene.dependencies.DynamicContextMenu',
		'Spelled.store.system.Defaults',
		'Spelled.store.system.EditMode',
		'Spelled.view.scene.library.ContextMenu',

		'Spelled.view.ui.SpelledIframe',

		'widget.label'
	],

	models: [
		'config.Scene'
	],

	stores: [
		'AspectRatios',
		'ScenesTree',
		'config.Scenes',
		'system.Defaults',
		'system.EditMode'
	],

	views: [
		'scene.TreeList',
		'scene.Navigator',
		'scene.Create',
		'scene.Editor',
		'scene.Script',
		'scene.Properties',
		'scene.dependencies.StaticContextMenu',
		'scene.dependencies.DynamicContextMenu',
		'scene.AddLibraryId',
		'scene.library.ContextMenu',
		'ui.SpelledRendered'
	],

	TREE_ITEM_TYPE_SCENE         : 1,
	TREE_ITEM_TYPE_ENTITY        : 2,
	TREE_ITEM_TYPE_SYSTEM        : 3,
	TREE_ITEM_TYPE_SCRIPT        : 4,
	TREE_ITEM_TYPE_ENTITIES      : 5,
	TREE_ITEM_TYPE_SYSTEM_ITEM   : 6,
	TREE_ITEM_TYPE_SYSTEM_FOLDER : 7,

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
			ref: 'SpelledIframe',
			selector: 'renderedscene > spellediframe'
		},
		{
			ref: 'RenderedScene',
			selector: 'renderedscene'
		},
		{
			ref: 'SceneProperties',
			selector: 'sceneproperties'
		}
	],

	init: function() {
		var me               = this,
			engineMessageBus = me.application.engineMessageBus

		//Show Scenes on ctrl+1
		Spelled.KeyMap = new Ext.util.KeyMap( document,
			{
				key: Ext.EventObject.ONE,
				ctrl: true,
				scope: this,
				handler: function( keycode, event) {
					me.application.activateTabByEvent( me.getScenes(), event )
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
					me.application.activateTabByEvent( me.getLibrary(), event )
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
					me.application.fireEvent( 'globalsave' )
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
					me.renderedSceneToggleButton( 'toggleTitleSafe' )
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
					me.renderedSceneToggleButton( 'toggleGrid' )
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

		engineMessageBus.addHandler(
			{
				'spelled.initialized' : function( sourceId ) {
					engineMessageBus.flushQueue( sourceId )
				},
				'spelled.loadingProgress' : function( sourceId, payload ) {
					me.updateRenderProgress( sourceId, payload )
				},
                'spelled.debug.entity.select': function( sourceId, payload ) {
                    me.selectEntityTreeItem( payload.id )
				},
				'spelled.debug.application.startScene': function( sourceId, payload ) {
					var sceneId = payload.targetSceneId,
						scene   = me.getConfigScenesStore().findRecord( 'sceneId', sceneId, 0, false, false, true )

					if( !scene ) {
						throw 'Error: Could not find scene "' + sceneId + '".'
					}

					me.switchScene( scene )

					me.sendChangeToEngine(
						'application.addToCache',
						{
							cacheContent : me.generateSceneCacheContent( scene, { editorMode: true } )
						}
					)

					me.sendChangeToEngine( 'application.startScene', payload )
				},
				'spelled.debug.application.sceneStarted': function( sourcId, payload ) {
					var cameraState = me.getRenderedScene().down( '[action="toggleDevCam"]' ).pressed

					me.sendChangeToEngine(
						'system.add',
						{
							executionGroupId : 'update',
							systemConfig : { active: cameraState },
							systemId : 'spell.system.debug.camera',
							index : 0
						}
					)
				}
			}
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
			'renderedscene > toolbar button[action="toggleDevCam"]': {
				toggle: me.toggleDevCam
			},
			'renderedscene > toolbar button[action="toggleEdit"]': {
				toggle: me.toggleEditScene
			},
			'renderedscene > toolbar button[action="fullscreen"]': {
				click: me.activateFullscreen
			},
			'renderedscene > toolbar button[action="debug"]': {
				click: me.activateDebug
			},
			'spelldependencies': {
				showStaticLibraryItemContextMenu: me.showStaticLibraryItemContextMenu,
				showDynamicLibraryItemContextMenu: me.showDynamicLibraryItemContextMenu,
				showActionColumns: Ext.bind( me.application.showGridActionColumn, me.application ),
				hideActionColumns: me.application.hideActions,
				showAddToLibrary: me.showAddToLibrary,
				deepLink: me.libraryDeepLink
			},
			'staticlibraryitemcontextmenu [action="showInLibrary"], dynamiclibraryitemcontextmenu [action="showInLibrary"]': {
				click: me.libraryDeepLinkHelper
			},
			'dynamiclibraryitemcontextmenu [action="remove"]': {
				click: me.removeSceneLibraryItem
			},
			'sceneaddlibraryid': {
				addToLibrary: me.addToLibrary
			},
			'scenetreelist > treeview': {
				drop : me.dispatchTreeNodeDrop,
				beforedrop: me.dispatchTreeNodeBeforeDrop
			},
			'scenetreelist': {
				iteminsert     : me.expandAndClose,
				itemappend     : me.expandAndClose,
				itemdblclick   : me.dispatchTreeDblClick,
				select         : me.dispatchTreeClick,
				beforeedit     : me.checkIfTreeColumnIsEditable,
				itemcontextmenu: me.dispatchTreeListContextMenu,
				editclick      : me.dispatchTreeListContextMenu,
				itemmouseenter : me.dispatchMouseEnterTree,
				itemmouseleave : me.application.hideActions
			},
			'scenetreelist [action="showCreateScene"]': {
				click: me.showCreateScene
			},
			'sceneslistcontextmenu [action="showSceneProperties"]': {
				click: me.showSceneProperties
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
			},
			'scenelibrarycontextmenu [action="remove"]': {
				click: this.removeSceneFromLibrary
			}
		})

		this.application.on({
			scenelibrarycontextmenu: this.showSceneLibraryContextMenu,
			deletescene: this.deleteScene,
			clearstores: this.clearScenesStore,
			scenescriptbeforeclose: this.checkIfSceneScriptIsDirty,
			renderscene: this.renderScene,
			reloadscene: this.reloadSceneKeyEvent,
			scenetabchange: this.showScenesEditor,
			systemchange: this.sendSystemChangeToEngine,
			assetchange: this.sendAssetChangeToEngine,
			sendToEngine: this.sendChangeToEngine,
			scope: this
		})
	},

	removeSceneFromLibrary: function( menuItem ) {
		var parentMenu = menuItem.parentMenu,
			node       = parentMenu.ownerView,
			sceneId    = node.getId(),
			scene      = this.getConfigScenesStore().getById( sceneId ),
			project    = this.application.getActiveProject()

		if( project.getScenesStore.getById( sceneId ) ) {
			Spelled.MessageBox.alert( "Can't remove scene", 'This Scene is in use. Remove it from the scenes list first.' )

		} else {
			this.application.fireEvent( 'removefromlibrary', node, function() {
				scene.destroy()
				node.remove()
			} )
		}
	},

	showSceneLibraryContextMenu: function( view, record, item, index, e, options ) {
		this.application.fireEvent( 'showcontextmenu', this.getSceneLibraryContextMenuView(), e, record )
	},

	libraryDeepLinkHelper: function( button ) {
		var view   = button.up( 'menu'),
			record = Ext.getStore( 'Library' ).findLibraryItemByLibraryId( view.ownerView.get( 'libraryId' ) )

		this.libraryDeepLink( record )
	},

	libraryDeepLink: function( record ) {
		this.application.fireEvent( 'deeplink', record )
	},

	showStaticLibraryItemContextMenu: function( record, e ) {
		this.application.fireEvent( 'showcontextmenu', this.getSceneDependenciesStaticContextMenuView(), e, record )
	},

	showDynamicLibraryItemContextMenu: function( record, e ) {
		this.application.fireEvent( 'showcontextmenu', this.getSceneDependenciesDynamicContextMenuView(), e, record )
	},

	showAddToLibrary: function( gridView, multiple ) {
		var record = gridView.record

		Ext.widget( 'sceneaddlibraryid', { multiple: multiple, excludingIds: record.getDependencies() } )
	},

	removeSceneLibraryItem: function( button ) {
		var dependencyView = this.getRightPanel().down( 'spelldependencies' ),
			view           = button.up( 'menu'),
			recordToRemove = view.ownerView,
			value          = recordToRemove.get( 'libraryId' ),
			record         = dependencyView.record,
			dependencies   = record.getDependencies()

		Ext.Array.remove( dependencies, value )
		record.set( 'dependencies', dependencies )
		record.setDirty()
		record.needToCalcCependency()

		recordToRemove.remove()
	},

	addToLibrary: function( window, records ) {
		var dependencyView = this.getRightPanel().down( 'spelldependencies' ),
			record         = dependencyView.record,
			dependencies   = record.getDependencies(),
			library        = Ext.getStore( 'Library' )

		Ext.Array.each(
			records,
			function( record ) {
				var libraryId   = record.get( 'libraryId' ),
					libraryItem = library.findLibraryItemByLibraryId( libraryId )

				dependencies.push( libraryId )

				if( libraryItem ) Ext.Array.push( dependencies, libraryItem.getDependencies() )
			}
		)

		record.set( 'dependencies', dependencies )
		record.setDirty()
		record.needToCalcCependency()

		dependencyView.reconfigureStores()

		window.close()
	},

	showSceneProperties: function() {
		var view  = this.getScenePropertiesView().create( { record: this.application.getLastSelectedScene() } )

		this.getRightPanel().setTitle( 'Scene dependencies' )
		this.getRightPanel().add( [ { xtype: 'label' , docString : '#!/guide/concepts_scenes'}, view ] )
	},

	selectEntityTreeItem: function( entityId ) {
		var tree = this.getScenesTree(),
			node = tree.getStore().getNodeById( entityId )

		if( node ) this.dispatchTreeClick( tree, node )
	},

	expandAndClose: function( tree, node, refNode ) {
		node.expand( true, function() { node.collapse( true ) } )
	},

	sendAssetChangeToEngine: function( asset, previewIframe ) {
		var message = { definition: asset.toSpellEngineMessageFormat() }

		this.sendChangeToEngine( "library.updateAsset", message )

		if( previewIframe && previewIframe.getId )
			this.application.sendDebugMessage( previewIframe.getId(), "library.updateAsset", message )
	},

    /**
     * Wrapper for sending changes only to the rendered scene.
     *
     * For sending changes to a different target, for example the asset preview use:
     * this.application.sendDebugMessage()
     *
     * @param type
     * @param payload
     */
	sendChangeToEngine: function( type, payload ) {
		var iframe = this.getSpelledIframe()

        this.application.sendDebugMessage( iframe.getId(), type, payload )
	},

	sendSystemChangeToEngine: function( model ) {
		var scene            = this.application.getRenderedScene(),
			systemConfig     = false,
			executionGroupId = false

		Ext.Object.each(
			scene.get( 'systems' ),
			function( key, value ) {

				executionGroupId = key
				Ext.Array.each(
					value,
					function( system ) {
						if( system.id === model.get( 'templateId' ) ) {
							systemConfig = system.config
							return false
						}
					}
				)

				if( systemConfig ) return false
			}
		)

		if( !systemConfig ) return

		this.application.fireEvent( 'updatescenesystem', executionGroupId, model, systemConfig )
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

		var errors = []

		Ext.Array.each(
			annotations,
			function( item ) {
				Ext.Array.each(
					item,
					function( error ) {
						if( error.severity == "error") errors.push( error )
					}
				)
			}
		)

		//don't send an update to the engine if we have active errors
		if( errors.length > 0 ) return

		this.sendChangeToEngine( "library.updateScript", { id: model.getFullName(), moduleSource: lines.join("\n") } )
	},

	clearScenesStore: function() {
		this.getConfigScenesStore().removeAll()
	},

	changeAspectRatio: function( field, newValue, oldValue ) {
		this.sendChangeToEngine( 'settings.setScreenMode', newValue === 0 ? 'fill' : 'fit' )
		this.sendChangeToEngine( 'settings.simulateScreenAspectRatio', { aspectRatio: newValue } )
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
			case this.TREE_ITEM_TYPE_SCENE:
				var app = this.application
				if( !app.isRenderedSceneLastSelectedScene() ) this.renderScene( app.getLastSelectedScene() )
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
			scene       = this.application.getLastSelectedScene(),
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

		if( sceneTab && !sceneEditor.isHidden() ) this.reloadScene( sceneTab.down( 'button' ) )
	},

	checkIfTreeColumnIsEditable: function( editor, e ) {
		return ( this.getTreeItemType( e.record ) === this.TREE_ITEM_TYPE_ENTITY )
	},

	setDefaultScene: function( scene ) {
		var project = this.application.getActiveProject(),
			tree    = this.getScenesTree()

		tree.getRootNode().eachChild( function( child ) { child.set( 'iconCls', "tree-scene-icon" ) } )

		tree.getStore().getById( scene.getId()).set( 'iconCls', "tree-default-scene-icon" )

		project.set( 'startScene', scene.getFullName() )
	},

	dispatchTreeNodeDrop: function(  node, data, overModel, dropPosition ) {
		var record = data.records[ 0 ]

		this.application.selectNode( this.getScenesTree(), record )

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

	dispatchTreeNodeBeforeDrop: function( node, data, overModel, dropPosition ) {
		var record = data.records[ 0 ]

		switch( this.getTreeItemType( record ) ){
			case this.TREE_ITEM_TYPE_SYSTEM_ITEM:
				var dstExecutionGroupId = overModel.parentNode.get( 'text' ),
					srcExecutionGroupId = record.parentNode.get( 'text' ),
					index               = overModel.get( 'index' )

				if( dropPosition === 'append' ) {
					dstExecutionGroupId = overModel.get( 'text' )
					index = overModel.childNodes.length
				} else {
					index = ( dropPosition === 'after' ) ? index + 1 : index
				}

				this.sendChangeToEngine(
					"system.move",
					{
						dstExecutionGroupId: dstExecutionGroupId,
						srcExecutionGroupId: srcExecutionGroupId,
						dstIndex: index,
						systemId: record.get( 'text' )
					}
				)

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
			case 'tree-scene-entity-linked-icon':
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
				this.application.fireEvent( 'showscenesystemslistcontextmenu', e, null )
				break
			case this.TREE_ITEM_TYPE_SYSTEM_FOLDER:
				this.application.fireEvent( 'showscenesystemslistcontextmenu', e, node )
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
				this.showSceneProperties()
				break
			case this.TREE_ITEM_TYPE_ENTITIES:
				this.getRightPanel().add( { xtype: 'label' , docString : '#!/guide/concepts_entities_components'} )
				break
			case this.TREE_ITEM_TYPE_ENTITY:
				this.application.fireEvent( 'showentityinfo', record.getId() )
				break
			case this.TREE_ITEM_TYPE_SYSTEM:
				var scene = this.application.getLastSelectedScene()
				if( scene ) {
					this.application.getController('Systems').refreshSceneSystemList( scene )
				}
				break
			case this.TREE_ITEM_TYPE_SYSTEM_ITEM:
				var template = Ext.getStore( 'template.Systems' ).getByTemplateId( record.get( 'text' ) )
				if( template ) this.application.fireEvent( 'showsystemtemplateconfig', template )
				break
			case this.TREE_ITEM_TYPE_SCRIPT:
				this.showSceneProperties()
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

	prepareSceneObject: function( config, noId ) {
		var Model   = this.getConfigSceneModel()

		if( !noId ) config.id = this.application.generateFileIdFromObject( config ) + '.json'

		var scene = new Model( config )
		scene.set( 'content', this.createInitialSceneScriptContent( scene ) )
		this.initScene( scene )

		return scene
	},

	createScene: function( values ) {
		var project = this.application.getActiveProject(),
			store   = this.getConfigScenesStore(),
			content = {
				name: values.name,
				namespace: ( values.namespace === 'root' ) ? '' : values.namespace.substring( 5 )
			},
			scene   = this.prepareSceneObject( content )

		store.add( scene )
		project.getScenes().add( scene )
		scene.setProject( project )

		scene.appendOnTreeNode( this.getScenesTree().getRootNode() )
		project.setDirty()
		scene.save()

		return scene
	},

	initScene: function( scene ) {
		var defaultSystems = this.getSystemDefaultsStore(),
			systemStore    = Ext.getStore( 'template.Systems' ),
			systems        = Ext.clone( scene.get( 'systems' ) )

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

		defaultSystems.each(
			function( item ) {
				var system       = systemStore.getByTemplateId( item.get('systemId') ),
					systemConfig = { id: system.getFullName(), config: system.getConfigForScene() }

				systems[ item.get('executionGroupId') ].push( systemConfig )
			}
		)

		scene.set( 'systems', systems )

		cameraComponent.setEntity( entity )
		entity.setScene( scene )
	},

	showListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showScenesListContextMenu( e )
	},

	deleteScene: function( scene ) {
		var project     = this.application.getActiveProject(),
			scenes      = project.getScenes()

		if( scenes.count() > 1 ) {
			scenes.remove( scene )

			if( scene.getFullName() === project.get( 'startScene' ) && scenes.first() ) {
				this.setDefaultScene( scenes.first() )
				this.reloadSceneKeyEvent()
			}

			project.setDirty()

			this.application.removeSelectedNode( this.getScenesTree() )
		} else {
			Spelled.MessageBox.alert( "Can't remove this scene", "You must at least have one scene in a project." )
		}
	},

	reloadScene: function( button ) {
		var panel   = button.up( 'panel' ),
			project = this.application.getActiveProject(),
			iframe  = panel.down( 'spellediframe' ),
			scene   = this.application.getRenderedScene()

		this.application.engineMessageBus.unInitialize( iframe.getId() )

		scene.updateDependencies()
		scene.checkForComponentChanges()

		var applicationModule = Ext.amdModules.createProjectInEngineFormat( project )
		applicationModule.startScene = scene.get( 'sceneId' )

		this.sendChangeToEngine(
			'application.addToCache', {
				cacheContent: this.generateSceneCacheContent( scene, { editorMode: true } )
			}
		)

		this.sendChangeToEngine(
			'application.startApplicationModule', {
				applicationModule: applicationModule
			}
		)

		this.sendChangeToEngine(
			'settings.drawCoordinateGrid',
			panel.down( '[action="toggleGrid"]' ).pressed
		)

		var aspectRatio = panel.down( '[name="aspectRatioSelector"]' ).getValue()

		this.sendChangeToEngine(
			'settings.setScreenMode',
			aspectRatio === 0 ? 'fill' : 'fit'
		)

		this.sendChangeToEngine(
			'settings.simulateScreenAspectRatio',
			{ aspectRatio : aspectRatio }
		)

		this.sendChangeToEngine(
			'settings.drawTitleSafeOutline',
			panel.down( '[action="toggleTitleSafe"]' ).pressed
		)

		iframe.reload()
	},

	generateUnsavedCacheContent: function() {
		var getStore     = Ext.getStore,
			stores       = this.application.getController( 'Projects' ).storesForSave,
			cacheContent = []

		var generateCacheContent = function( item ) {
			if( item.dirty === true ) {
				var tmp = Spelled.Converter.generateCacheContent( item )

				if( tmp.length > 0 ) cacheContent = Ext.Array.merge( cacheContent, tmp )
			}
		}

		Ext.each(
			stores,
			function( id ) {
				getStore( id ).each( generateCacheContent )
			}
		)

		return cacheContent
	},

	generateSceneCacheContent: function( scene, config ) {
		var withScript   = ( config && Ext.isObject( config ) && !!config.withScript ),
			editorMode   = ( config && Ext.isObject( config ) && !!config.editorMode ),
			relativeName = Spelled.Converter.libraryIdToRelativePath( scene.getFullName() ),
			toBeCached   = [{
				content : Ext.amdModules.sceneConverter.toEngineFormat( scene.getData( true ), { includeNamespace: true, includeEntityIds: true } ),
				filePath : relativeName + ".json"
			}]

		if( withScript ) toBeCached.push( { content : scene.get( 'content' ), filePath : relativeName + ".js" } )

		var cacheContent = Ext.amdModules.createCacheContent( Ext.Array.merge( toBeCached, this.generateUnsavedCacheContent() ) )

		if( editorMode ) {
			var isObject     = Ext.isObject,
				merge        = Ext.Array.merge

			Ext.Object.each(
				cacheContent,
				function( key, value ) {
					if( !isObject( value ) || value.type != "scene" ) return

					value.libraryIds = merge( value.libraryIds, scene.getStaticLibraryIds( true ) )
				}
			)
		}

		return cacheContent
	},

	updateRenderProgress: function( targetId, value ) {
		if( value >= 1 ) this.application.fireEvent( 'spellfinishedloading', targetId )
	},

	toggleDevCam: function( button, state ) {
		var system = Ext.getStore( 'template.Systems' ).getByTemplateId( 'spell.system.debug.camera' )

		this.application.fireEvent( 'updatescenesystem', 'update', system, { active: state } )

		this.getSpelledIframe().focus()
	},

	toggleEditScene: function( button, state ) {
		var scene           = this.application.getRenderedScene(),
			systemsStore    = Ext.getStore( 'template.Systems' ),
			editModeSystems = this.getSystemEditModeStore()


		if( scene ) {
			Ext.Object.each(
				scene.get( 'systems' ),
				function( key, value ){
					Ext.Array.each(
						value,
						function( sceneSystem ) {
							var system       = systemsStore.getByTemplateId( sceneSystem.id ),
								origConfig   = sceneSystem.config,
								active       = origConfig.active ? !state : false,
								systemConfig = Ext.merge( {}, system.getConfigForScene(), origConfig, { active: active } ),
								editSystem   = editModeSystems.findRecord( 'systemId', sceneSystem.id, null, null, null, true )

							if( editSystem ) {
								if( state )
									systemConfig = Ext.merge( systemConfig, editSystem.get( 'systemConfig' ) )
								else
									systemConfig.active = sceneSystem.config.active
							}

							this.application.fireEvent( 'updatescenesystem', key, system, systemConfig )
						},
						this
					)
				},
				this
			)
		}

		this.getSpelledIframe().focus()
	},

	toggleGrid: function( button, state ) {
		this.sendChangeToEngine( "settings.drawCoordinateGrid", state )
		this.getSpelledIframe().focus()
	},

	toggleTitleSafe: function( button, state ) {
		this.sendChangeToEngine( "settings.drawTitleSafeOutline", state )
		this.getSpelledIframe().focus()
	},

	activateFullscreen: function( button, state ) {
		var tab      = this.getSpelledIframe(),
			dom      = tab.el.dom

		if ( !Spelled.app.platform.enterFullScreen( dom ) ) {
			//inform the user if this function is not available
			Spelled.MessageBox.alert( 'Not supported', 'Sorry, the fullscreen function is not yet supported in your browser. Try using another browser.')
		}
	},

	activateDebug: function( button, state ) {
        var tab = this.getSpelledIframe()

		Spelled.app.platform.toggleDevTools( tab.getFrame().id )
	},

	createSpellTab: function( title, projectName, sceneId ) {
		var tab = Ext.widget( 'renderedscene', { title : title } )

		tab.add( Ext.widget( 'spellediframe', { projectName : projectName, sceneId : sceneId } ) )

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
					scene.getId()
				)

			tab = this.application.createTab( sceneEditor, newTab )
		}

		var sceneId = scene.get( 'sceneId' ),
			scene   = this.getConfigScenesStore().findRecord( 'sceneId', sceneId, 0, false, false, true )

		if( !scene ) {
			throw 'Error: Could not find scene "' + sceneId + '".'
		}

		this.switchScene( scene )
		this.reloadScene( tab.down( 'button' ) )
	},

	switchScene: function( scene ) {
		var tree = this.getScenesTree()

		tree.getRootNode().eachChild( function( child ) {
			if( child.getId() === scene.getId() ) {
				child.set( 'leaf', false )
				child.expand()
				child.expandChildren()

			} else {
				child.collapse( true )
				child.set( 'leaf', true )
			}
		} )

		this.application.setRenderedScene( scene )
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
				node.set( 'leaf', false )
				node.set( 'iconCls', 'tree-default-scene-icon' )
			}

		},this)
	},

	createInitialSceneScriptContent: function( scene ) {
		var parts = [
			"return {",
			"	/**",
			"	 * This function is executed after the entites contained in the scene configuration have been created. All initialization functionality specific to",
			"	 * the scene should be placed here.",
			"	 *",
			"	 * @param spell",
			"	 * @param sceneConfig",
			"	 */",
			"	init : function( spell, sceneConfig ) {},",
			"",
			"	/**",
			"	 * This function is executed before all entities are destroyed. Scene specific clean up should be performed here.",
			"	 *",
			"	 * @param spell",
			"	 * @param sceneConfig",
			"	 */",
			"	destroy : function( spell, sceneConfig ) {}",
			"}"
		]

		return this.application.getController( 'Scripts' ).createModuleHeader( scene.getFullName(), parts.join( '\n\t\t' ) )
	}
})
