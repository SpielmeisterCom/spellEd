Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',

    views: [
        'menu.Menu',
        'menu.contextmenu.ScenesList',
        'menu.contextmenu.EntitiesList',
        'menu.contextmenu.AssetsList',
        'menu.contextmenu.ScriptsList',
		'menu.contextmenu.SceneSystemsList',
        'menu.contextmenu.TemplatesList',
        'menu.contextmenu.ComponentTemplateAttributesList',
        'menu.contextmenu.EntityTemplateComponentsList',
        'menu.contextmenu.SystemTemplateInputList',
        'ui.SpelledConsole',
        'ui.StartScreen'
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


			'scenesystemslistcontextmenu [action="remove"]': {
				click: this.removeSystemFromScene
			},
			'scenesystemslistcontextmenu [action="add"]': {
				click: this.addSystemToScene
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


            'templateslistcontextmenu [action="create"]': {
                click: this.showCreateTemplate
            },
            'templateslistcontextmenu [action="remove"]': {
                click: this.removeTemplate
            },


            'entitieslistcontextmenu [action="remove"]': {
                click: this.removeEntity
            },


            'componenttemplateattributescontextmenu [action="remove"]': {
                click: this.removeComponentAttribute
            },


            'entitytemplatecomponentscontextmenu [action="remove"]': {
                click: this.removeComponent
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

	showSceneSystemsListContextMenu: function( e) {
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

    removeTemplate: function( ) {
        var tree = Ext.getCmp( 'TemplatesTree'),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
			this.application.getController('Templates').deleteTemplateAction( node )
		}
    },

    showCreateScript: function( ) {
        this.application.getController( 'Scripts').showCreateScript( )
    },

    removeScript: function( ) {
        var tree = Ext.getCmp( 'ScriptsTree'),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
            this.application.getController( 'Scripts' ).removeScript( node.get('id') )
			this.application.removeSelectedNode( tree )
		}
    },

    showCreateAsset: function( ) {
        this.application.getController( 'Assets').showCreateAsset( )
    },

    removeAsset: function( ) {
        var tree = Ext.getCmp( 'AssetsTree'),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
            this.application.getController( 'Assets' ).removeAsset( node.get('id') )
			this.application.removeSelectedNode( tree )
		}
    },

	removeSystemFromScene: function() {
		var panel = Ext.getCmp("RightPanel"),
			tree  = panel.down( 'systemlist' ),
			node  = tree.getSelectionModel().getLastSelected()

		if( node && node.isLeaf() && !node.isRoot() ) {
			this.application.getController( 'Systems' ).removeSceneSystem( node.get('text') )
			this.application.removeSelectedNode( tree )
		}

	},

	addSystemToScene: function() {
		this.application.getController('Systems').showAddSystem()
	},

    removeSystemInput: function( ) {
        var tab = Ext.getCmp("TemplateEditor").getActiveTab(),
            tree = tab.down( 'systemtemplateinputlist' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && !node.isLeaf() && !node.isRoot() ) {
            this.application.getController( 'templates.Systems' ).removeSystemInputDefinition( node.get('id') )
			this.application.removeSelectedNode( tree )
		}
    },

    removeComponentAttribute: function( ) {
        var tab = Ext.getCmp("TemplateEditor").getActiveTab(),
            tree = tab.down( 'componenttemplateattributeslist' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
            this.application.getController( 'templates.Components' ).removeComponentAttribute( node.get('id') )
			this.application.removeSelectedNode( tree )
        }
    },

    removeComponent: function( ) {
        var tab = Ext.getCmp("TemplateEditor").getActiveTab(),
            tree = tab.down( 'entitytemplatecomponentslist' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && !node.isLeaf() && !node.isRoot() ) {
            this.application.getController('templates.Entities').removeEntityComponent( node.get('id') )
			this.application.removeSelectedNode( tree )
        }
    },

    removeEntity: function( item ) {
        var view = item.up('entitieslistcontextmenu')

        var entity = view.getEntity()

        if( entity ) {
            this.application.getController( 'Entities' ).deleteEntity( entity )
			this.application.removeSelectedNode( Ext.getCmp("ScenesTree") )
        }
    },

    removeScene: function( ) {
        var scene = this.application.getActiveScene()

        if( scene ) {
            this.application.getController( 'Scenes').deleteScene( scene )
			this.application.removeSelectedNode( Ext.getCmp("ScenesTree") )
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
    }
});
