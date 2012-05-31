Ext.define('Spelled.controller.blueprints.Entities', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.entity.Edit',
        'blueprint.entity.Details',
        'blueprint.entity.Components',
        'blueprint.entity.Property',
        'blueprint.entity.components.Add'
    ],

    models: [
        'blueprint.Entity'
    ],

    stores: [
        'blueprint.Entities'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({
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
            'entityblueprintcomponentslist': {
                select:          this.showEntityAttributeConfig,
                deleteclick:     this.deleteEntityComponentActionIconClick,
                itemcontextmenu: this.showComponentsListContextMenu,
                itemmouseenter:  this.application.showActionsOnFolder,
                itemmouseleave:  this.application.hideActions
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

    showComponentsListContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showEntityBlueprintComponentsListContextMenu( e )
    },

    removeEntityBlueprint: function( id ) {
        var EntityBlueprint = this.getBlueprintEntityModel()

        EntityBlueprint.load( id, {
            scope: this,
            success: this.application.getController('Blueprints').removeBlueprintCallback
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
            this.application.getController('Blueprints').refreshBlueprintStores()
        }

    },

    resetBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues()

        console.log( "Reset Blueprint" )
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

    showEntityAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('blueprint.ComponentAttributes').getById( record.getId() )

        if( attribute ) {

            var component = Ext.getStore('config.Components').getById( record.parentNode.getId() )

            var config = component.get('config')
            if( config[ attribute.get('name') ] ) {
                attribute.set('default', config[ attribute.get('name') ])
            }

            this.application.getController('blueprints.Components').fillAttributeConfigView( attribute )
        }
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
    }
});