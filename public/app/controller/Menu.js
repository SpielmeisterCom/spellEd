Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',
	requires: [
		'Spelled.view.menu.Menu',
		'Spelled.view.menu.contextmenu.ScenesList',
		'Spelled.view.menu.contextmenu.EntitiesList',
		'Spelled.view.menu.contextmenu.EntitiesFolderList',
		'Spelled.view.menu.contextmenu.AssetsList',
		'Spelled.view.menu.contextmenu.ScriptsList',
		'Spelled.view.menu.contextmenu.SceneSystemsList',
		'Spelled.view.menu.contextmenu.TemplatesList',
		'Spelled.view.menu.contextmenu.templatesList.Entity',
		'Spelled.view.menu.contextmenu.ComponentTemplateAttributesList',
		'Spelled.view.menu.contextmenu.SystemTemplateInputList',
		'Spelled.view.menu.contextmenu.KeyToActionMapping',
		'Spelled.view.doc.Tool',
		'Spelled.view.ui.SpelledConsole',
		'Spelled.view.ui.SpelledRightPanel',
		'Spelled.view.ui.StartScreen'
	],

    views: [
        'menu.Menu',
        'menu.contextmenu.ScenesList',
        'menu.contextmenu.EntitiesList',
		'menu.contextmenu.EntitiesFolderList',
        'menu.contextmenu.AssetsList',
        'menu.contextmenu.ScriptsList',
		'menu.contextmenu.SceneSystemsList',
        'menu.contextmenu.TemplatesList',
		'menu.contextmenu.templatesList.Entity',
        'menu.contextmenu.ComponentTemplateAttributesList',
        'menu.contextmenu.SystemTemplateInputList',
		'menu.contextmenu.KeyToActionMapping',
		'doc.Tool',
        'ui.SpelledConsole',
		'ui.SpelledRightPanel',
        'ui.StartScreen'
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
            'spelledmenu [action="showCreateProject"]': {
                click: this.showCreateProject
            },
            'spelledmenu [action="showloadProject"]': {
                click: this.showLoadProject
            },
            'spelledmenu [action="saveProject"]': {
                click: this.saveProject
            },
			'spelledmenu button[action="exportProject"]': {
				click: this.exportProject
			},
			'spelledmenu tool-documentation': {
				showDocumentation: this.showEditorDocumentation
			},


			'scenesystemslistcontextmenu [action="remove"]': {
				click: this.removeSystemFromScene
			},
			'scenesystemslistcontextmenu [action="moveUp"]': {
				click: this.moveSystemNodeUp
			},
			'scenesystemslistcontextmenu [action="moveDown"]': {
				click: this.moveSystemNodeDown
			},
			'scenesystemslistcontextmenu [action="open"]': {
				click: this.showSceneSystem
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
			'assetslistcontextmenu [action="open"]': {
				click: this.openAsset
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


			'keytoactionmappingcontextmenu [action="remove"]': {
				click: this.removeKeyMapping
			}
        })

		this.application.on({
			'showkeymappingcontextmenu': this.showKeyToActionMappingContextMenu,
			scope: this
		})
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

	showSceneSystemsListContextMenu: function( e ) {
		this.createAndShowView(
			this.getMenuContextmenuSceneSystemsListView(),
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

        view.setEntity( entity )
    },

	showEntitiesFolderListContextMenu: function( e ) {
		this.createAndShowView(
			this.getMenuContextmenuEntitiesFolderListView(),
			e
		)
	},

    showScenesListContextMenu: function( e ) {
        this.createAndShowView(
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

	showKeyToActionMappingContextMenu: function( view, row, column, index, e, options ) {
		var contextMenu = this.createAndShowView(
			this.getMenuContextmenuKeyToActionMappingView(),
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
			this.application.fireEvent( 'removeFromLibrary', node, Ext.bind( controller.deleteTemplateAction, controller ) )
		}
    },

    removeScript: function( ) {
		var node = this.application.getLastSelectedNode( this.getScriptsTree() ) ,
			me   = this

        if( node && node.isLeaf() ) {
			this.application.fireEvent( 'removeFromLibrary', node,
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
			this.application.getController( 'Assets' ).showEditHelper( node.get('id') )
		}
	},

	openAsset: function( ) {
		var node = this.application.getLastSelectedNode( this.getAssetsTree() )

		if( node && node.isLeaf() ) {
			this.application.getController( 'Assets' ).openAsset( this.getAssetsTree(), node )
		}
	},

	removeAsset: function( ) {
		var node = this.application.getLastSelectedNode( this.getAssetsTree() ),
			me   = this

		if( node && node.isLeaf() ) {
			this.application.fireEvent( 'removeFromLibrary', node,
				function(){
					me.application.getController( 'Assets' ).removeAsset( node.get('id') )
					node.remove()
				}
			)
		}
	},

	showSceneSystem: function() {
		var treePanel = this.getRightPanel().down( 'systemlist' ),
			node      = this.application.getLastSelectedNode( treePanel )

		this.application.getController( 'Systems' ).showSystemItem( treePanel, node )
	},

	removeSystemFromScene: function() {
		var node = this.application.getLastSelectedNode( this.getRightPanel().down( 'systemlist' ) )

		if( node && node.isLeaf() && !node.isRoot() ) {
			this.application.getController( 'Systems' ).removeSceneSystem( node.get('text') )
			node.remove()
		}
	},

	moveSystemNodeUp: function() {
		var node = this.application.getLastSelectedNode( this.getRightPanel().down( 'systemlist' )  )

		if( node && !node.parentNode.isRoot() ) {
			this.application.getController( 'Systems' ).moveSystemNodeUp( node )
		}
	},

	moveSystemNodeDown: function() {
		var node = this.application.getLastSelectedNode( this.getRightPanel().down( 'systemlist' )  )

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
			tabPanel    = contextmenu.getTabPanel()

        var node = this.application.getLastSelectedNode( tabPanel.down( 'componenttemplateattributeslist' ) )

        if( node && node.isLeaf() ) {
            this.application.getController( 'templates.Components' ).removeComponentAttribute( tabPanel, node.get('id') )
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
			type             = scenesController.getClickedTreeItemType( node)

		var owner = ( type === scenesController.TREE_ITEM_TYPE_ENTITIES ) ?
			Ext.getStore( 'config.Scenes' ).getById( node.parentNode.getId() )
			:
			Ext.getStore( 'config.Entities' ).getById( node.getId() )

		this.application.getController( 'Entities').showCreateEntity( owner )
	},

	showRenameEntity: function( ) {
		var node = this.application.getLastSelectedNode( this.getScenesTree() )
		this.application.getController( 'Scenes' ).triggerRenameEntityEvent( node )
	},

    removeEntity: function( item ) {
		var view = item.up('entitieslistcontextmenu')

		var entity = view.getEntity()

		Ext.Msg.confirm(
			'Remove '+ entity.get('name'),
			'Should the Entity: "' + entity.get('name') + '" be removed?',
			function( button ) {
				if ( button === 'yes' ) {
					if( entity ) {
						this.application.getController( 'Entities' ).deleteEntity( entity )
						var node = this.application.getLastSelectedNode( this.getScenesTree() ),
							parentNode = node.parentNode

						node.remove()

						if( !parentNode.hasChildNodes() ) {
							parentNode.set( 'leaf', true )
						}
					}
				}
			},
			this
		)
    },

    removeScene: function( ) {
        var scene = this.application.getActiveScene()

        if( scene ) {
            this.application.getController( 'Scenes').deleteScene( scene )
			this.application.removeSelectedNode( this.getScenesTree() )
        }
    },


	setDefaultScene: function() {
		var scene = this.application.getActiveScene()

		if( scene ) {
			this.application.getController( 'Scenes' ).setDefaultScene( scene )
		}
	},

    renderScene: function( ) {
        var scene = this.application.getActiveScene()

        if( scene ) {
            this.application.getController( 'Scenes' ).renderScene( scene )
        }
    },

    showCreateProject: function() {
        this.application.getController('Projects').showCreateProject()
    },

    showLoadProject: function() {
        this.application.getController('Projects').showLoadProject()
    },

    saveProject: function() {
        this.application.fireEvent( 'globalsave' )
    },

	exportProject: function() {
		this.application.getController('Projects').exportActiveProject()
	}
});
