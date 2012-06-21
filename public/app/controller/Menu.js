Ext.define('Spelled.controller.Menu', {
    extend: 'Ext.app.Controller',

    views: [
        'menu.Menu',
        'menu.contextmenu.ZonesList',
        'menu.contextmenu.EntitiesList',
        'menu.contextmenu.AssetsList',
        'menu.contextmenu.ScriptsList',
        'menu.contextmenu.BlueprintsList',
        'menu.contextmenu.ComponentBlueprintAttributesList',
        'menu.contextmenu.EntityBlueprintComponentsList',
        'menu.contextmenu.SystemBlueprintInputList',
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


            'systemblueprintinputcontextmenu [action="remove"]': {
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


            'blueprintslistcontextmenu [action="create"]': {
                click: this.showCreateBlueprint
            },
            'blueprintslistcontextmenu [action="remove"]': {
                click: this.removeBlueprint
            },


            'entitieslistcontextmenu [action="remove"]': {
                click: this.removeEntity
            },


            'componentblueprintattributescontextmenu [action="remove"]': {
                click: this.removeComponentAttribute
            },


            'entityblueprintcomponentscontextmenu [action="remove"]': {
                click: this.removeComponent
            },


            'zoneslistcontextmenu [action="remove"]': {
                click: this.removeZone
            },
            'zoneslistcontextmenu [action="default"]': {

            },
            'zoneslistcontextmenu [action="render"]': {
                click: this.renderZone
            }
        })
    },

    createAndShowView: function( View, event ) {
        event.stopEvent()

        var view = new View()
        view.showAt( event.getXY() )

        return view
    },

    showScriptsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuScriptsListView(),
            e
        )
    },

    showSystemBlueprintInputListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuSystemBlueprintInputListView(),
            e
        )
    },

    showBlueprintsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuBlueprintsListView(),
            e
        )
    },

    showComponentAttributesListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuComponentBlueprintAttributesListView(),
            e
        )
    },

    showEntityBlueprintComponentsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuEntityBlueprintComponentsListView(),
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

    showZonesListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuZonesListView(),
            e
        )
    },

    showAssetsListContextMenu: function( e ) {
        this.createAndShowView(
            this.getMenuContextmenuAssetsListView(),
            e
        )
    },

    showComponentContextMenu: function( component, e ) {
        e.stopEvent()
    },

    showCreateBlueprint: function( ) {
        this.application.getController( 'Blueprints').showCreateBlueprint()
    },

    removeBlueprint: function( ) {
        var tree = Ext.getCmp( 'BlueprintsTree'),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
			this.application.getController('Blueprints').deleteBlueprintAction( node )
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
        }
    },

    removeSystemInput: function( ) {
        var tab = Ext.getCmp("BlueprintEditor").getActiveTab(),
            tree = tab.down( 'systemblueprintinputlist' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && !node.isLeaf() && !node.isRoot() ) {
            this.application.getController( 'blueprints.Systems' ).removeSystemInputDefinition( node.get('id') )
        }
    },

    removeComponentAttribute: function( ) {
        var tab = Ext.getCmp("BlueprintEditor").getActiveTab(),
            tree = tab.down( 'componentblueprintattributeslist' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && node.isLeaf() ) {
            this.application.getController( 'blueprints.Components' ).removeComponentAttribute( node.get('id') )
        }
    },

    removeComponent: function( ) {
        var tab = Ext.getCmp("BlueprintEditor").getActiveTab(),
            tree = tab.down( 'entityblueprintcomponentslist' ),
            node = tree.getSelectionModel().getLastSelected()

        if( node && !node.isLeaf() && !node.isRoot() ) {
            this.application.getController('blueprints.Entities').removeEntityComponent( node.get('id') )
        }
    },

    removeEntity: function( item ) {
        var view = item.up('entitieslistcontextmenu')

        var entity = view.getEntity()

        if( entity ) {
            this.application.getController( 'Entities' ).deleteEntity( entity )
        }
    },

    removeZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            this.application.getController( 'Zones').deleteZone( zone )
        }
    },

    renderZone: function( ) {
        var zone = this.application.getActiveZone()

        if( zone ) {
            this.application.getController( 'Zones' ).renderZone( zone )
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