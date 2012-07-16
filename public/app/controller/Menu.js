Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',

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
        'ui.SpelledConsole',
        'ui.StartScreen'
    ],

	refs: [
		{
			ref : 'MainPanel',
			selector: '#MainPanel'
		},
		{
			ref : 'TemplateEditor',
			selector: '#TemplateEditor'
		},
		{
			ref : 'TemplatesTree',
			selector: '#TemplatesTree'
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
			selector: '#ScriptsTree'
		},
		{
			ref: "AssetsTree",
			selector: '#AssetsTree'
		}
	],

    init: function() {
        this.control({
			'#RightPanel': {
				remove: function( panel ) {
					panel.setTitle( panel.defaultTitle )
				},
				hide: function( panel ) {
					panel.removeAll()
				}
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


			'scenesystemslistcontextmenu [action="remove"]': {
				click: this.removeSystemFromScene
			},
			'scenesystemslistcontextmenu [action="add"]': {
				click: this.addSystemToScene
			},
			'scenesystemslistcontextmenu [action="moveUp"]': {
				click: this.moveSystemNodeUp
			},
			'scenesystemslistcontextmenu [action="moveDown"]': {
				click: this.moveSystemNodeDown
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


            'scriptslistcontextmenu [action="create"]': {
                click: this.showCreateScript
            },
            'scriptslistcontextmenu [action="remove"]': {
                click: this.removeScript
            },


            'assetslistcontextmenu [action="create"]': {
                click: this.showCreateAsset
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


			'templateslistentitycontextmenu [action="create"]': {
				click: this.showCreateTemplate
			},
			'templateslistentitycontextmenu [action="add"]': {
				click: this.showAddEntityToTemplate
			},
			'templateslistentitycontextmenu [action="remove"]': {
				click: this.removeTemplate
			},


			'entitieslistcontextmenu [action="remove"]': {
                click: this.removeEntity
            },
			'entitieslistcontextmenu [action="create"]': {
				click: this.showCreateEntity
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

            },
            'sceneslistcontextmenu [action="render"]': {
                click: this.renderScene
            }
        })
    },

    createAndShowView: function( View, event ) {
        event.stopEvent()

        var view = new View()
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

    showComponentAttributesListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuComponentTemplateAttributesListView(),
            e
        )
    },

    showEntityTemplateComponentsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuEntityTemplateComponentsListView(),
            e
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

    showCreateTemplate: function( ) {
        this.application.getController( 'Templates').showCreateTemplate()
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
		var node = this.application.getLastSelectedNode( this.getTemplatesTree() )

        if( node ) {
			this.application.getController('Templates').deleteTemplateAction( node )
		}
    },

    showCreateScript: function( ) {
        this.application.getController( 'Scripts').showCreateScript( )
    },

    removeScript: function( ) {
		var node = this.application.getLastSelectedNode( this.getScriptsTree() )

        if( node && node.isLeaf() ) {
            this.application.getController( 'Scripts' ).removeScript( node.get('id') )
			node.remove()
		}
    },

    showCreateAsset: function( ) {
        this.application.getController( 'Assets').showCreateAsset( )
    },


	showEditAsset: function( ) {
		var node = this.application.getLastSelectedNode( this.getAssetsTree() )

		if( node && node.isLeaf() ) {
			this.application.getController( 'Assets' ).showEditHelper( node.get('id') )
		}
	},

	removeAsset: function( ) {
		var node = this.application.getLastSelectedNode( this.getAssetsTree() )

		if( node && node.isLeaf() ) {
			this.application.getController( 'Assets' ).removeAsset( node.get('id') )
			node.remove()
		}
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

	addSystemToScene: function() {
		this.application.getController('Systems').showAddSystem()
	},

    removeSystemInput: function( ) {
        var node = this.application.getLastSelectedNode( this.getTemplateEditor().getActiveTab().down( 'systemtemplateinputlist' ) )

        if( node ) {
            this.application.getController( 'templates.Systems' ).removeSystemInputDefinition( node.getId() )
		}
    },

    removeComponentAttribute: function( ) {
        var node = this.application.getLastSelectedNode( this.getTemplateEditor().getActiveTab().down( 'componenttemplateattributeslist' ) )

        if( node && node.isLeaf() ) {
            this.application.getController( 'templates.Components' ).removeComponentAttribute( node.get('id') )
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

    removeEntity: function( item ) {
        var view = item.up('entitieslistcontextmenu')

        var entity = view.getEntity()

        if( entity ) {
            this.application.getController( 'Entities' ).deleteEntity( entity )
			var node = this.application.getLastSelectedNode( this.getScenesTree() ),
				parentNode = node.parentNode

			node.remove()

			if( !parentNode.hasChildNodes() ) {
				parentNode.set( 'leaf', true )
			}
        }
    },

    removeScene: function( ) {
        var scene = this.application.getActiveScene()

        if( scene ) {
            this.application.getController( 'Scenes').deleteScene( scene )
			this.application.removeSelectedNode( this.getScenesTree() )
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
        this.application.getController('Projects').saveActiveProject()
    },

	exportProject: function() {
		this.application.getController('Projects').exportActiveProject()
	}
});
