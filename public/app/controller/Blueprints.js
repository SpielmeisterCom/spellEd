Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    BLUEPRINT_TYPE_COMPONENT: 'componentBlueprint',
    BLUEPRINT_TYPE_ENTITY: 'entityBlueprint',
    BLUEPRINT_TYPE_SYSTEM: 'systemBlueprint',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator',
        'blueprint.TreeList',
        'blueprint.Create',
        'blueprint.FolderPicker'
    ],

    models: [
        'blueprint.Component',
        'blueprint.Entity',
        'blueprint.System'
    ],

    stores: [
        'BlueprintsTree',
        'blueprint.Types',
        'blueprint.FoldersTree',
        'blueprint.Components',
        'blueprint.Entities',
        'blueprint.Systems'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    //TODO: Blueprint components get overwritten from entityconfig. strange problem! need to fix ASAP

    init: function() {
        this.control({
            'blueprintsnavigator': {
                activate: this.showBlueprintEditor
            },
            'blueprintstreelist': {
                deleteclick:     this.deleteBlueprintActionIconClick,
                itemcontextmenu: this.showBlueprintsContextMenu,
                itemdblclick:    this.openBlueprint,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
            'blueprinteditor [action="showCreateBlueprint"]' : {
                click: this.showCreateBlueprint
            },
            'createblueprint button[action="createBlueprint"]' : {
                click: this.createBlueprint
            },
            'createblueprint > form > combobox[name="type"]' : {
                select: this.changeBlueprintCreationType
            }
        })
    },

    deleteBlueprintActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        if( node.get('cls') === this.BLUEPRINT_TYPE_COMPONENT ) {
            this.application.getController('blueprints.Components').removeComponentBlueprint( node.get('id') )
        } else {
            this.application.getController('blueprints.Entities').removeEntityBlueprint( node.get('id') )
        }
    },

    showBlueprintsContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showBlueprintsListContextMenu( e )
    },

    changeBlueprintCreationType: function( combo, records ) {

    },

    showCreateBlueprint: function() {
        var View = this.getBlueprintCreateView()
        var view = new View( )
        view.show()
    },

    openBlueprint: function( treePanel, record ) {
        if( !record.data.leaf ) return

        switch( record.get('cls') ) {
            case this.BLUEPRINT_TYPE_COMPONENT:
                var ComponentBlueprint = this.getBlueprintComponentModel()

                ComponentBlueprint.load( record.getId(), {
                    scope: this,
                    success: function( componentBlueprint ) {
                        this.application.getController('blueprints.Components').openComponentBlueprint( componentBlueprint )
                    }
                })
                break
            case this.BLUEPRINT_TYPE_ENTITY:
                var EntityBlueprint = this.getBlueprintEntityModel()

                EntityBlueprint.load( record.getId(), {
                    scope: this,
                    success: function( entityBlueprint ) {
                        this.application.getController('blueprints.Entities').openEntityBlueprint( entityBlueprint )
                    }
                })
                break
            case this.BLUEPRINT_TYPE_SYSTEM:
                var SystemBlueprint = this.getBlueprintSystemModel()

                SystemBlueprint.load( record.getId(), {
                    scope: this,
                    success: function( systemBlueprint ) {
                        this.application.getController('blueprints.Systems').openSystemBlueprint( systemBlueprint )
                    }
                })
                break
            default:
                return
        }
    },

    removeBlueprintCallback: function( blueprint ) {

        if( !this.application.getController('Blueprints').checkForReferences( blueprint ) ) {
            this.application.getController('Blueprints').removeBlueprint( blueprint )
        } else {
            Ext.Msg.alert( 'Error', 'The Blueprint "' + blueprint.getFullName() + '" is used in this Project and can not be deleted.' +
                '<br>Remove all references to this Blueprint first!')
        }
    },

    removeBlueprint: function( blueprint ) {
        this.closeOpenedTabs( blueprint )

        blueprint.destroy()
        this.refreshStores()
    },

    closeOpenedTabs: function( blueprint ) {
        var editorTab = Ext.getCmp("BlueprintEditor")

        editorTab.items.each(
            function( tab ) {
                if( blueprint.get('id') === tab.blueprint.get('id') ) {
                    tab.destroy()
                }
            }
        )
    },

    checkForReferences: function( blueprint ) {
        var entitiesStore   = Ext.getStore( 'config.Entities'),
            componentsStore = Ext.getStore( 'config.Components'),
            found = false


        var checkFunc = function( item ) {
            if( item.get('blueprintId') === blueprint.getFullName() ) {
                found = true
                return false
            }
        }

        entitiesStore.each( checkFunc )
        if( found === true ) return found

        componentsStore.each( checkFunc )
        return found
    },

    createBlueprint: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
            project = this.application.getActiveProject()

        if( form.isValid() ){

            form.submit(
                {
                    params: {
                        projectName: project.get('name')
                    },
                    waitMsg: 'Creating a new Blueprint',
                    success:
                        Ext.bind(
                            function( form, action ) {
                                Ext.Msg.alert('Success', 'Your blueprint "' + action.result.data.name + '" has been created.')

                                this.refreshStores()

                                window.close()
                            },
                            this
                        ),
                    failure: function( form, action ) {
                        Ext.Msg.alert('Failed', action.result)
                    }
                }
            )
        }
    },

    refreshBlueprintStores: function() {
      var projectName = this.application.getActiveProject().get('name')

      this.loadBlueprintStores( projectName )
    },

    loadBlueprintStores: function( projectName ) {
        Spelled.BlueprintsActions.getAllEntitiesBlueprints( projectName, function( provider, response ) {
            var store = Ext.getStore('blueprint.Entities')
            store.removeAll()
            store.loadDataViaReader( response.result )
        })

        Spelled.BlueprintsActions.getAllComponentsBlueprints( projectName, function( provider, response ) {
            var store = Ext.getStore('blueprint.Components')
            store.removeAll()
            store.loadDataViaReader( response.result )
        })
    },

    loadTrees: function() {
        var projectName = this.application.getActiveProject().get('name')

        this.getBlueprintsTreeStore().load( {
            params: {
                projectName: projectName
            }
        } )

        this.getBlueprintFoldersTreeStore().load( {
            params: {
                projectName: projectName
            }
        } )
    },

    refreshStores: function() {
        this.refreshBlueprintStores()

        this.loadTrees()
    },

    showBlueprintEditor : function( ) {
        this.getMainPanel().items.each(
            function( panel ) {
                panel.hide()
            }
        )

        this.loadTrees()

        Ext.getCmp('BlueprintEditor').show()

    }
});