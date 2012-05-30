Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    BLUEPRINT_TYPE_COMPONENT: 'componentBlueprint',
    BLUEPRINT_TYPE_ENTITY: 'entityBlueprint',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator',
        'blueprint.TreeList',
        'blueprint.Create',
        'blueprint.FolderPicker',
        'blueprint.component.Edit',
        'blueprint.component.Details',
        'blueprint.component.Attributes',
        'blueprint.component.Property',
        'blueprint.entity.Edit',
        'blueprint.entity.Details',
        'blueprint.entity.Components',
        'blueprint.entity.Property',
        'blueprint.entity.components.Add'
    ],

    models: [
        'blueprint.Component',
        'blueprint.ComponentAttribute',
        'blueprint.Entity'
    ],

    stores: [
        'BlueprintsTree',
        'blueprint.ComponentAttributes',
        'blueprint.Components',
        'blueprint.Entities',
        'blueprint.Types',
        'blueprint.FoldersTree'
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
            'componentblueprintproperty button[action="save"]' : {
                click: this.saveComponentBlueprint
            },
            'componentblueprintproperty button[action="reset"]' : {
                click: this.resetBlueprint
            },
            'componentblueprintproperty > field' : {
                change: function() {
                    console.log("change!")
                }
            },
            'entityblueprintproperty button[action="save"]' : {
                click: this.saveEntityBlueprint
            },
            'entityblueprintproperty button[action="reset"]' : {
                click: this.resetBlueprint
            },
            'entityblueprintproperty > field' : {
                change: function() {
                    console.log("change!")
                }
            },
            'componentblueprintattributeslist [action="addAttribute"]' : {
                click: this.addAttribute
            },
            'componentblueprintattributeslist': {
                select:          this.showAttributeConfig,
                deleteclick:     this.deleteAttributeActionIconClick,
                itemcontextmenu: this.showAttributesListContextMenu,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
            'entityblueprintcomponentslist': {
                select:          this.showEntityAttributeConfig,
                deleteclick:     this.deleteEntityComponentActionIconClick,
                itemcontextmenu: this.showComponentsListContextMenu,
                itemmouseenter:  this.application.showActionsOnFolder,
                itemmouseleave:  this.application.hideActions
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
            },
            'entityblueprintcomponentslist [action="showAddComponent"]' : {
                click: this.showAddComponent
            },
            'addcomponenttoblueprint button[action="addComponent"]' : {
                click: this.addComponent
            }
        })
    },

    deleteEntityComponentActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        this.removeEntityComponent( node.get('id') )
    },

    deleteAttributeActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        this.removeComponentAttribute( node.get('id') )
    },


    deleteBlueprintActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        if( node.get('cls') === this.BLUEPRINT_TYPE_COMPONENT ) {
            this.removeComponentBlueprint( node.get('id') )
        } else {
            this.removeEntityBlueprint( node.get('id') )
        }
    },

    showBlueprintsContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showBlueprintsListContextMenu( e )
    },

    showComponentsListContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showEntityBlueprintComponentsListContextMenu( e )
    },

    showAttributesListContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showComponentAttributesListContextMenu( e )
    },

    addAttribute: function() {
        var tab        = Ext.getCmp("BlueprintEditor").getActiveTab(),
            ownerModel = tab.blueprint

        var newAttribute = Ext.create(
            'Spelled.model.blueprint.ComponentAttribute',
            {
                type: "string",
                name: "newAttribute",
                default: "defaultValue"
            }
        )

        ownerModel.getAttributes().add( newAttribute )

        this.refreshComponentBlueprintAttributesList( tab )
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

        if( record.get('cls') === this.BLUEPRINT_TYPE_COMPONENT ) {
            var ComponentBlueprint = this.getBlueprintComponentModel()

            ComponentBlueprint.load( record.getId(), {
                scope: this,
                success: function( componentBlueprint ) {
                    this.openComponentBlueprint( componentBlueprint )
                }
            })

        } else {
            var EntityBlueprint = this.getBlueprintEntityModel()

            EntityBlueprint.load( record.getId(), {
                scope: this,
                success: function( entityBlueprint ) {
                    this.openEntityBlueprint( entityBlueprint )
                }
            })
        }
    },

    removeBlueprintCallback: function( blueprint ) {
        if( !this.checkForReferences( blueprint ) ) {
            this.removeBlueprint( blueprint )
        } else {
            Ext.Msg.alert( 'Error', 'The Blueprint "' + blueprint.getFullName() + '" is used in this Project and can not be deleted.' +
                '<br>Remove all references to this Blueprint first!')
        }
    },

    removeComponentBlueprint: function( id ) {
        var ComponentBlueprint = this.getBlueprintComponentModel()

        ComponentBlueprint.load( id, {
            scope: this,
            success: this.removeBlueprintCallback
        })
    },

    removeEntityBlueprint: function( id ) {
        var EntityBlueprint = this.getBlueprintEntityModel()

        EntityBlueprint.load( id, {
            scope: this,
            success: this.removeBlueprintCallback
        })
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

    saveEntityBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues(),
            ownerModel = Ext.getCmp("BlueprintEditor").getActiveTab().blueprint

        if( record ) {
            var componentBlueprint = Ext.getStore( 'blueprint.Components').getById( record.get('spelled.model.blueprint.component_id') )

            var componentConfig = {
                blueprintId: componentBlueprint.getFullName(),
                config: componentBlueprint.mergeComponentConfig( values )
            }

            //Set the new configuration on the specified component
            ownerModel.getComponents().each(
                function( component ) {
                    if( component.get('blueprintId') === componentConfig.blueprintId ) {
                        component.set('config', componentConfig.config )
                    }
                }
            )

        }

        if( !!ownerModel ) {
            ownerModel.save( )
            this.refreshBlueprintStores()
        }

    },

    saveComponentBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues(),
            tab    = Ext.getCmp("BlueprintEditor").getActiveTab()

        var ownerModel = tab.blueprint

        record.set( values )

        if( !!ownerModel ) {
            ownerModel.save( )
            this.refreshBlueprintStores()
            this.refreshComponentBlueprintAttributesList( tab )
        }
    },

    resetBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues()

        console.log( "Reset Blueprint" )
    },

    removeComponentAttribute: function( id ) {
        var tab                = Ext.getCmp("BlueprintEditor").getActiveTab(),
            componentBlueprint = tab.blueprint,
            store              = Ext.getStore( 'blueprint.ComponentAttributes' ),
            attribute          = store.getById( id )

        componentBlueprint.getAttributes().remove( attribute )
        store.remove( attribute )

        this.refreshComponentBlueprintAttributesList( tab )
    },

    removeEntityComponent: function( id ) {
        var tab                = Ext.getCmp("BlueprintEditor").getActiveTab(),
            entityBlueprint    = tab.blueprint,
            store              = Ext.getStore( 'config.Components' ),
            component          = store.getById( id )

        entityBlueprint.getComponents().remove( component )
        store.remove( component )

        this.refreshEntityBlueprintComponentsList( tab )
    },

    showAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('blueprint.ComponentAttributes').getById( record.getId() )

        if( attribute ) {
            this.fillAttributeConfigView( attribute )
        }
    },

    showEntityAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('blueprint.ComponentAttributes').getById( record.getId() )

        if( attribute ) {

            var component = Ext.getStore('config.Components').getById( record.parentNode.getId() )

            var config = component.get('config')
            if( config[ attribute.get('name') ] ) {
                attribute.set('default', config[ attribute.get('name') ])
            }

            this.fillAttributeConfigView( attribute )
        }
    },

    fillAttributeConfigView: function( attribute ) {
        var propertyView = Ext.getCmp("BlueprintEditor").getActiveTab().down( 'form' )
        propertyView.getForm().loadRecord( attribute )
    },

    openEntityBlueprint: function( entityBlueprint ) {
        var blueprintEditor = Ext.getCmp("BlueprintEditor"),
            title           = entityBlueprint.getFullName()

        var foundTab = this.application.findActiveTabByTitle( blueprintEditor, title )

        if( foundTab )
            return foundTab

        var editView = Ext.create( 'Spelled.view.blueprint.entity.Edit',  {
                title: title,
                blueprint : entityBlueprint
            }
        )

        var header = editView.down( 'entityblueprintdetails' )

        //TODO: find a better solution for setting the details
        header.items.items[0].setValue( entityBlueprint.get('type') )
        header.items.items[1].setValue( entityBlueprint.getFullName() )

        var tab = this.application.createTab( blueprintEditor, editView )

        this.refreshEntityBlueprintComponentsList( tab )
    },

    refreshEntityBlueprintComponentsList: function( tab ) {
        var entityBlueprint = tab.blueprint,
            componentsView  = tab.down( 'entityblueprintcomponentslist' )

        var rootNode = componentsView.getStore().setRootNode( {
                text: entityBlueprint.getFullName(),
                expanded: true
            }
        )

        this.appendComponentsAttributesOnTreeNode( rootNode, entityBlueprint.getComponents() )
    },

    addComponent: function( button ) {
        var window    = button.up('window'),
            tree      = window.down('treepanel'),
            records   = tree.getView().getChecked(),
            tab       = Ext.getCmp("BlueprintEditor").getActiveTab(),
            componentBlueprintStore = Ext.getStore('blueprint.Components'),
            entityBlueprint         = tab.blueprint

        Ext.each(
            records,
            function( record ) {

                var componentBlueprint = componentBlueprintStore.getById( record.get('id') )

                if( componentBlueprint ) {
                    var configComponent = Ext.create( 'Spelled.model.config.Component', {
                        blueprintId : componentBlueprint.getFullName()
                    })

                    entityBlueprint.getComponents().add( configComponent )
                }
            }
        )

        this.refreshEntityBlueprintComponentsList( tab )
        window.close()
    },

    showAddComponent: function( ) {
        var View = this.getBlueprintEntityComponentsAddView(),
            view = new View(),
            entityBlueprint          = Ext.getCmp("BlueprintEditor").getActiveTab().blueprint,
            availableComponentsView  = view.down( 'treepanel' ),
            blueprintComponentsStore = Ext.getStore( 'blueprint.Components' )


        var rootNode = availableComponentsView.getStore().setRootNode( {
                text: 'Components',
                expanded: true
            }
        )

        var notAssignedComponents = Ext.create( 'Ext.util.MixedCollection' )

        blueprintComponentsStore.each(
            function( record ) {
                var found = entityBlueprint.getComponents().find( 'blueprintId', record.getFullName() )

                if( found === -1 ) {
                    notAssignedComponents.add( record )
                }
            }
        )

        this.appendComponentsAttributesOnTreeNode( rootNode, notAssignedComponents )

        rootNode.eachChild(
            function( node ) {
                node.set('checked', false)
            }
        )
        view.show()
    },

    appendComponentsAttributesOnTreeNode: function( node, components ) {

        components.each(
            function( component ) {

                var componentBlueprint = ( !component.get('blueprintId') ) ?
                    component :
                    Ext.getStore( 'blueprint.Components' ).getByBlueprintId( component.get('blueprintId') )

                if( componentBlueprint ) {
                    var newNode = node.createNode ( {
                        text      : componentBlueprint.getFullName(),
                        id        : component.getId(),
                        expanded  : true,
                        leaf      : false
                    } )

                    componentBlueprint.appendOnTreeNode( newNode )

                    node.appendChild( newNode )
                }
            }
        )

        return node
    },

    openComponentBlueprint: function( componentBlueprint ) {
        var blueprintEditor = Ext.getCmp("BlueprintEditor"),
            title           = componentBlueprint.getFullName()


        var foundTab = this.application.findActiveTabByTitle( blueprintEditor, title )

        if( foundTab )
            return foundTab

        var editView = Ext.create( 'Spelled.view.blueprint.component.Edit',  {
                title: title,
                blueprint : componentBlueprint
            }
        )

        var header = editView.down( 'componentblueprintdetails' )

        //TODO: find a better solution for setting the details
        header.items.items[0].setValue( componentBlueprint.get('type') )
        header.items.items[1].setValue( componentBlueprint.getFullName() )


        var tab = this.application.createTab( blueprintEditor, editView )
        this.refreshComponentBlueprintAttributesList( tab )
    },

    refreshComponentBlueprintAttributesList: function( tab ) {
        var componentBlueprint = tab.blueprint,
            attributesView  = tab.down( 'componentblueprintattributeslist' )

        var rootNode = attributesView.getStore().setRootNode( {
                text: componentBlueprint.getFullName(),
                expanded: true
            }
        )

        componentBlueprint.appendOnTreeNode( rootNode )
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