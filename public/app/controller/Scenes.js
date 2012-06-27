Ext.define('Spelled.controller.Scenes', {
    extend: 'Ext.app.Controller',

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

	TREE_ITEM_TYPE_SCENE  : 1,
	TREE_ITEM_TYPE_ENTITY : 2,
	TREE_ITEM_TYPE_SYSTEM : 3,
	TREE_ITEM_TYPE_SCRIPT : 4,

	BUILD_SERVER_ORIGIN : 'http://localhost:8080',

    init: function() {
		var me = this

        var dispatchPostMessages = function( event ) {

			switch ( event.data.action ) {
				case 'spell.initialized' :
					me.answerIframePostMessage( event, "run" )
					return
			}
        }

        window.addEventListener("message", dispatchPostMessages, false);

        this.control({
			'renderedscene': {
				show: function( panel ) {
					panel.down( 'spellediframe').focus()
				}
			},
			'renderedscene > toolbar button[action="saveScene"]': {
                click: me.saveScene
            },
            'renderedscene > toolbar button[action="reloadScene"]': {
                click: me.reloadScene
            },
            'renderedscene > toolbar button[action="toggleState"]': {
                click: me.toggleState
            },
            'scenetreelist': {
				select         : me.dispatchTreeClick,
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
            'createscene button[action="createScene"]' : {
                click: me.createScene
            },
            'scenesnavigator': {
                activate: me.showScenesEditor
            },
			'scenescript > combobox[name="scriptId"]' : {
				select: this.setSceneScript
			}
        })
    },

	getClickedTreeItemType: function( record ) {
		var type = undefined

		switch( record.get('iconCls') ) {
			case 'tree-scene-icon':
	            type = this.TREE_ITEM_TYPE_SCENE
				break
			case 'tree-scene-entity-icon':
				type = this.TREE_ITEM_TYPE_ENTITY
				break
			case 'tree-scene-system-icon':
				type = this.TREE_ITEM_TYPE_SYSTEM
				break
			case 'tree-scene-script-icon':
				type =  this.TREE_ITEM_TYPE_SCRIPT
				break
		}

		return type
	},

	dispatchTreeListContextMenu: function( gridView, list, columnIndex, rowIndex, e ) {
		var node = gridView.getRecord( gridView.findTargetByEvent(e) )

		switch( this.getClickedTreeItemType( node ) ) {
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
				var scene = this.getConfigScenesStore().getById( record.getId() )
				if( scene ) {
					this.application.setActiveScene( scene )
				}
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

	checkOrigin: function( event ) {
		if ( event.origin !== this.BUILD_SERVER_ORIGIN ){
			console.log( 'event.origin: ' + event.origin )
			console.log( 'Error: origin does not match.' )

			return false
		}

		return true
	},

	sendKeyEventToIframe: function( event ) {
		var data = {
			type: "keyEvent",
			payload: {
				type: event.type,
				keyCode: event.keyCode
			}
		}

		this.sendIframePostMessage( this.activeIframeId, "debug", data )
	},

	answerIframePostMessage: function( event, type, options ) {
		if( !this.checkOrigin( event ) ) return

		this.sendIframePostMessage( event.data.iframeId, type, options )
	},

	sendIframePostMessage: function( iFrameId, type, options ) {
		var cmp    = Ext.getCmp( iFrameId ),
			config = ( Ext.isObject( options ) ) ? options : {}

		if( !cmp ) return

		config.type 	= "spelled." + type
		config.iframeId = cmp.id

		cmp.el.dom.contentWindow.postMessage(
			config,
			this.BUILD_SERVER_ORIGIN
		)
	},

    showScenesEditor: function() {
		this.application.hideMainPanels()
		this.getRightPanel().show()

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
            scenes  = project.getScenes(),
			store  = this.getConfigScenesStore()

        record.set( values )

		store.add( record )
		scenes.add( record )
        this.showScenesList( scenes )

        window.close()
    },

    showListContextMenu: function( view, record, item, index, e, options ) {
		this.application.getController('Menu').showScenesListContextMenu( e )
    },

    deleteScene: function( scene ) {
        var project = this.application.getActiveProject(),
            scenes   = project.getScenes(),
			sceneEditor = Ext.getCmp('SceneEditor')

        scenes.remove( scene )
		this.application.closeOpenedTabs( sceneEditor, scene.getRenderTabTitle() )
		this.application.closeOpenedTabs( sceneEditor, scene.getSourceTabTitle() )
    },

    reloadScene: function( button ) {
        var panel   = button.up('panel'),
            project = this.application.getActiveProject(),
            iframe  = panel.down( 'spellediframe' )

		this.application.getController('Projects').saveActiveProject()

        SpellBuild.ProjectActions.executeCreateDebugBuild(
            "html5",
            project.get('name'),
            project.getConfigName(),
            function() {
                iframe.el.dom.src = iframe.el.dom.src
				iframe.focus()
			}
        )

    },

    toggleState: function( button ) {
        console.log( "should toggle play/pause")
    },

    saveScene: function( button ) {
        console.log( "Should save the content ")
    },

    renderScene: function( scene ) {
        var sceneEditor = Ext.getCmp( "SceneEditor"),
            title = scene.getRenderTabTitle()

        var foundTab = this.application.findActiveTabByTitle( sceneEditor, title )

        if( foundTab )
            return foundTab

        var spellTab = Ext.create( 'Spelled.view.ui.SpelledRendered', {
                title: title
            }
        )

        var project = this.application.getActiveProject()

        var createTab = function( provider, response ) {

            var iframe = Ext.create( 'Spelled.view.ui.SpelledIframe', {
                projectName: project.get('name'),
				sceneId: scene.getId()
            })

            spellTab.add( iframe )

            this.application.createTab( sceneEditor, spellTab )
		}

        SpellBuild.ProjectActions.executeCreateDebugBuild(
            "html5",
            project.get('name'),
            project.getConfigName(),
            Ext.bind( createTab, this )
        )

    },

    showScenesList: function( scenes ) {
        var tree     = Ext.ComponentManager.get( "ScenesTree"),
            rootNode = tree.getStore().getRootNode()
        rootNode.removeAll()

        scenes.each( function( scene ) {
            scene.appendOnTreeNode( rootNode )
        })
    }
});
