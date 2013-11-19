Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.view.menu.Menu',
		'Spelled.view.menu.contextmenu.ScenesList',
		'Spelled.view.menu.contextmenu.EntitiesList',
		'Spelled.view.menu.contextmenu.EntitiesFolderList',
		'Spelled.view.menu.contextmenu.AssetsList',
		'Spelled.view.menu.contextmenu.ScriptsList',
		'Spelled.view.menu.contextmenu.SceneSystemsItemList',
		'Spelled.view.menu.contextmenu.TemplatesList',
		'Spelled.view.menu.contextmenu.templatesList.Entity',
		'Spelled.view.menu.contextmenu.templatesList.EntityComposite',
		'Spelled.view.menu.contextmenu.ComponentTemplateAttributesList',
		'Spelled.view.menu.contextmenu.SystemTemplateInputList',
		'Spelled.view.menu.contextmenu.InputMapping',
		'Spelled.view.doc.Tool',
		'Spelled.view.ui.SpelledConsole',
		'Spelled.view.ui.SpelledRightPanel',
		'Spelled.view.ui.StartScreen',
		'Spelled.view.ui.SpelledConfiguration'
	],

    views: [
        'menu.Menu',
        'menu.contextmenu.ScenesList',
        'menu.contextmenu.EntitiesList',
		'menu.contextmenu.EntitiesFolderList',
        'menu.contextmenu.AssetsList',
        'menu.contextmenu.ScriptsList',
		'menu.contextmenu.SceneSystemsItemList',
        'menu.contextmenu.TemplatesList',
		'menu.contextmenu.templatesList.Entity',
		'menu.contextmenu.templatesList.EntityComposite',
        'menu.contextmenu.ComponentTemplateAttributesList',
        'menu.contextmenu.SystemTemplateInputList',
		'menu.contextmenu.InputMapping',
		'doc.Tool',
        'ui.SpelledConsole',
		'ui.SpelledRightPanel',
        'ui.StartScreen',
		'ui.SpelledConfiguration'
    ],

	refs: [
		{
			ref : 'MainPanel',
			selector: '#MainPanel'
		},
		{
			ref : 'TemplateEditor',
			selector: '#SceneEditor'
		},
		{
			ref : 'TemplatesTree',
			selector: '#LibraryTree'
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
			ref : 'ScriptsTree',
			selector: '#LibraryTree'
		},
		{
			ref: "AssetsTree",
			selector: '#LibraryTree'
		}
	],

    init: function() {
        this.control({
			'#RightPanel': {
				remove: function( panel ) {
					panel.setTitle( panel.defaultTitle )
					panel.docString = ""
				},
				add: function( panel, item ) {
					panel.docString = ( !!item.docString ) ? item.docString : ''
				},
				hide: function( panel ) {
					panel.removeAll()
				}
			},
			'#RightPanel > header > tool-documentation': {
				showDocumentation: this.showDocumentation
			},

			'spelledmenu tool-documentation': {
				showDocumentation: this.showEditorDocumentation
			},


			'scenesystemsitemlistcontextmenu [action="remove"]': {
				click: this.removeSystemFromScene
			},
			'scenesystemsitemlistcontextmenu [action="moveUp"]': {
				click: this.moveSystemNodeUp
			},
			'scenesystemsitemlistcontextmenu [action="moveDown"]': {
				click: this.moveSystemNodeDown
			},
			'scenesystemsitemlistcontextmenu [action="open"]': {
				click: this.showSceneSystem
			},


            'systemtemplateinputcontextmenu [action="remove"]': {
                click: this.removeSystemInput
            },


            'scriptslistcontextmenu [action="remove"]': {
                click: this.removeScript
            },
			'scriptslistcontextmenu [action="edit"]': {
				click: this.showEditScript
			},


            'assetslistcontextmenu [action="remove"]': {
                click: this.removeAsset
            },
			'assetslistcontextmenu [action="edit"]': {
				click: this.showEditAsset
			},


            'templateslistcontextmenu [action="create"]': {
                click: this.showCreateTemplate
            },
            'templateslistcontextmenu [action="remove"]': {
                click: this.removeTemplate
            },
			'templateslistcontextmenu [action="open"]': {
				click: this.openTemplate
			},


			'templateslistentitycontextmenu [action="create"]': {
				click: this.showCreateTemplate
			},
			'templateslistentitycontextmenu [action="add"]': {
				click: this.showAddEntityToTemplate
			},
			'templateslistentitycontextmenu [action="remove"]': {
				click: this.removeTemplate
			},
			'templateslistentitycontextmenu [action="open"]': {
				click: this.openTemplate
			},


			'entitieslistcontextmenu [action="remove"]': {
                click: this.removeEntity
            },
			'entitieslistcontextmenu [action="create"]': {
				click: this.showCreateEntity
			},
			'entitieslistcontextmenu [action="rename"]': {
				click: this.showRenameEntity
			},
			'entitieslistcontextmenu [action="clone"]': {
				click: this.cloneEntity
			},


			'entitiesfolderlistcontextmenu [action="create"]': {
				click: this.showCreateEntity
			},


            'componenttemplateattributescontextmenu [action="remove"]': {
                click: this.removeComponentAttribute
            },


            'sceneslistcontextmenu [action="remove"]': {
                click: this.removeScene
            },
            'sceneslistcontextmenu [action="default"]': {
				click: this.setDefaultScene
            },
            'sceneslistcontextmenu [action="render"]': {
                click: this.renderScene
            },


			'inputmappingcontextmenu [action="remove"]': {
				click: this.removeKeyMapping
			},

			'spelledmenu [action="showAboutDialog"]': {
				click: this.showAboutDialog
			},
			'spelledmenu [action="showBugReportDialog"]': {
				click: this.showBugReportDialog
			},
			'spelledmenu [action="showFeedbackDialog"]': {
				click: this.showFeedbackDialog
			},
			nwtoolbar: {
				showAboutDialog : this.showAboutDialog,
				showBugReportDialog : this.showBugReportDialog,
				showFeedbackDialog : this.showFeedbackDialog
			}
        })

		this.application.on({
			showkeymappingcontextmenu: this.showInputMappingContextMenu,
			showcontextmenu: this.createAndShowView,
			scope: this
		})
    },

	showBugReportDialog : function() {
		window.open( 'error.html?type=manual', '_blank' )
	},

	showFeedbackDialog : function() {
		window.open( 'http://spelljs.com/contact-us', '_blank' )
	},

	showAboutDialog: function() {
		Ext.widget( 'spelledabout' )
	},

	showEditorDocumentation: function( docString ) {
		this.application.showDocumentation( docString )
	},

	showDocumentation: function( docString ) {
		var docString = docString || this.getRightPanel().docString || ""
		this.application.showDocumentation( docString )
	},

    createAndShowView: function( View, event, ownerView ) {
        event.stopEvent()

        var view = new View( { ownerView: ownerView} )
        view.showAt( event.getXY() )

        return view
    },

	showSceneSystemsItemListContextMenu: function( e ) {
		this.createAndShowView(
			this.getMenuContextmenuSceneSystemsItemListView(),
			e
		)
	},

    showScriptsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuScriptsListView(),
            e
        )
    },

    showSystemTemplateInputListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuSystemTemplateInputListView(),
            e
        )
    },

	showTemplatesListEntityContextMenu: function( e ) {
		this.createAndShowView(
			this.getMenuContextmenuTemplatesListEntityView(),
			e
		)
	},

	showTemplatesListEntityCompositeContextMenu: function( e ) {
		this.createAndShowView(
			this.getMenuContextmenuTemplatesListEntityCompositeView(),
			e
		)
	},

    showTemplatesListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuTemplatesListView(),
            e
        )
    },

    showComponentAttributesListContextMenu: function( view, e ) {
        this.createAndShowView(
            this.getMenuContextmenuComponentTemplateAttributesListView(),
            e,
			view
        )
    },

    showEntitiesListContextMenu: function( entity, e ) {

        var view = this.createAndShowView(
            this.getMenuContextmenuEntitiesListView(),
            e
        )

		if( !entity.isRemovable() ) {
			view.remove( view.down( '[action="showConvertEntity"]' ) )
			view.remove( view.down( '[action="rename"]' ) )
			view.remove( view.down( '[action="remove"]' ) )
		}

        view.setEntity( entity )
    },

	showEntitiesFolderListContextMenu: function( e ) {
		this.createAndShowView(
			this.getMenuContextmenuEntitiesFolderListView(),
			e
		)
	},

    showScenesListContextMenu: function( e ) {
        return this.createAndShowView(
            this.getMenuContextmenuScenesListView(),
            e
        )
    },

    showAssetsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuAssetsListView(),
            e
        )
    },

	showInputMappingContextMenu: function( view, row, column, index, e, options ) {
		var contextMenu = this.createAndShowView(
			this.getMenuContextmenuInputMappingView(),
			e
		)

		contextMenu.assetView   = view
		contextMenu.selectedRow = row
	},

    showCreateTemplate: function( ) {
        this.application.getController( 'Templates').showCreateTemplate()
    },

	openTemplate: function() {
		var node = this.application.getLastSelectedNode( this.getTemplatesTree() )

		this.application.getController( 'Templates').openTemplate( this.getTemplatesTree(), node  )
	},

	showAddEntityToTemplate: function( ) {
		var node  = this.application.getLastSelectedNode( this.getTemplatesTree()),
			owner = ( node.get('cls') === this.application.getController( 'Templates' ).TYPE_ENTITY_COMPOSITE ) ?
				Ext.getStore( 'config.Entities' ).getById( node.getId() )
				:
				Ext.getStore( 'template.Entities' ).getById( node.getId() )

		this.application.getController( 'templates.Entities').showAddEntity( owner )
	},

    removeTemplate: function( ) {
		var node       = this.application.getLastSelectedNode( this.getTemplatesTree() ) ,
			controller = this.application.getController('Templates')

        if( node ) {
			this.application.fireEvent( 'removefromlibrary', node, Ext.bind( controller.deleteTemplateAction, controller ) )
		}
    },

    removeScript: function( ) {
		var node = this.application.getLastSelectedNode( this.getScriptsTree() ) ,
			me   = this

        if( node && node.isLeaf() ) {
			this.application.fireEvent( 'removefromlibrary', node,
				function(){
					me.application.getController( 'Scripts' ).removeScript( node.get('id') )
					node.remove()
				}
			)
		}
    },

	showEditScript: function( ) {
		var node = this.application.getLastSelectedNode( this.getScriptsTree() )

		if( node && node.isLeaf() ) {
			this.application.getController( 'Scripts' ).openScript( node.get('id') )
		}
	},

	showEditAsset: function( ) {
		var node = this.application.getLastSelectedNode( this.getAssetsTree() )

		if( node && node.isLeaf() ) {
			this.application.getController( 'Assets' ).showEditHelper( node.get('id'), node )
		}
	},

	removeAsset: function( ) {
		var node = this.application.getLastSelectedNode( this.getAssetsTree() ),
			me   = this

		if( node && node.isLeaf() ) {
			this.application.fireEvent( 'removefromlibrary', node,
				function(){
					me.application.getController( 'Assets' ).removeAsset( node.get('id'), node.get('cls') )
					node.remove()
				}
			)
		}
	},

	showSceneSystem: function() {
		var treePanel = this.getScenesTree(),
			node      = this.application.getLastSelectedNode( treePanel )

		this.application.getController( 'Systems' ).showSystemItem( treePanel, node )
	},

	removeSystemFromScene: function() {
		var node = this.application.getLastSelectedNode( this.getScenesTree() )

		if( node && node.isLeaf() && !node.isRoot() ) {
			this.application.getController( 'Systems' ).removeSceneSystem( node.get('text'), node.parentNode.get( 'text' ) )
			node.remove()
		}
	},

	moveSystemNodeUp: function() {
		var node = this.application.getLastSelectedNode( this.getScenesTree() )

		if( node && !node.parentNode.isRoot() ) {
			this.application.getController( 'Systems' ).moveSystemNodeUp( node )
		}
	},

	moveSystemNodeDown: function() {
		var node = this.application.getLastSelectedNode( this.getScenesTree() )

		if( node && !node.parentNode.isRoot() ) {
			this.application.getController( 'Systems' ).moveSystemNodeDown( node )
		}
	},

    removeSystemInput: function( ) {
        var node = this.application.getLastSelectedNode( this.getRightPanel().down( 'systemtemplateinputlist' ) )

        if( node ) {
            this.application.getController( 'templates.Systems' ).removeSystemInputDefinition( node.getId() )
		}
    },

	removeKeyMapping: function( menu ) {
		var view = menu.parentMenu
		this.application.fireEvent( "removekeymapping", view.assetView, view.selectedRow )
	},

    removeComponentAttribute: function( button ) {
		var contextmenu = button.ownerCt,
			panel       = contextmenu.getOwnerView().up( 'componenttemplateedit' )

        var node = this.application.getLastSelectedNode( panel.down( 'componenttemplateattributeslist' ) )

        if( node && node.isLeaf() ) {
            this.application.getController( 'templates.Components' ).removeComponentAttribute( panel, node.get('id') )
			node.remove()
        }
    },

    removeComponent: function( ) {
        var node = this.application.getLastSelectedNode( this.getTemplateEditor().getActiveTab().down( 'entitytemplatecomponentslist' ) )

        if( node && !node.isLeaf() && !node.isRoot() ) {
            this.application.getController('templates.Entities').removeEntityComponent( node.get('id') )
			node.remove()
        }
    },

	showCreateEntity: function( ) {
		var node             = this.application.getLastSelectedNode( this.getScenesTree() ),
			scenesController = this.application.getController('Scenes'),
			type             = scenesController.getTreeItemType( node)

		var owner = ( type === scenesController.TREE_ITEM_TYPE_ENTITIES ) ?
			Ext.getStore( 'config.Scenes' ).getById( node.parentNode.getId() )
			:
			Ext.getStore( 'config.Entities' ).getById( node.getId() )

		this.application.getController( 'Entities').showCreateEntity( owner )
	},

	showRenameEntity: function( ) {
		var node = this.application.getLastSelectedNode( this.getScenesTree() )
		this.application.fireEvent( 'triggerrenamingentity', node )
	},

	cloneEntity: function( ) {
		var node = this.application.getLastSelectedNode( this.getScenesTree() )
		this.application.fireEvent( 'cloneconfigentity', node.getId(), node )
	},

    removeEntity: function( item ) {
		var view = item.up('entitieslistcontextmenu'),
			entity = view.getEntity()

		if( !entity.isRemovable() )
			this.application.fireEvent( 'showentityremovealert', entity )
		else
			this.application.fireEvent( 'removeentity', entity )
    },

    removeScene: function( ) {
		var scene = this.application.getLastSelectedScene(),
			name  = scene.get( 'name' )

		Ext.Msg.confirm(
			'Remove '+ name,
			'Should the Scene: "' + name + '" be removed?',
			function( button ) {
				if ( button === 'yes' ) {
					this.application.fireEvent( 'deletescene', scene )
				}
			},
			this
		)
    },

	setDefaultScene: function() {
		var scene = this.application.getLastSelectedScene()

		if( scene ) {
			this.application.getController( 'Scenes' ).setDefaultScene( scene )
		}
	},

    renderScene: function( ) {
		var scene = this.application.getLastSelectedScene()

        if( scene ) {
            this.application.getController( 'Scenes' ).renderScene( scene )
        }
    }
});
