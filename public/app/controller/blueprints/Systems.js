Ext.define('Spelled.controller.blueprints.Systems', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.system.Edit',
        'blueprint.system.Details',
        'blueprint.system.Input',
        'blueprint.system.input.Add'
    ],

    models: [
        'blueprint.System',
        'blueprint.SystemInputDefinition'
    ],

    stores: [
        'blueprint.Systems',
        'blueprint.SystemInputDefinitions'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    init: function() {
        this.control({
            'systemblueprintinputlist': {
                deleteclick:     this.deleteInputActionIconClick,
                itemcontextmenu: this.showAttributesListContextMenu,
                itemmouseenter:  this.application.showActionsOnFolder,
                itemmouseleave:  this.application.hideActions
            },
            'systemblueprintinputlist [action="showAddInput"]' : {
                click: this.showAddInput
            },
            'addinputtoblueprint button[action="addInput"]' : {
                click: this.addInput
            }
        })
    },

    addInput: function( button ) {
        var window    = button.up('window'),
            form      = window.down('form'),
            record    = form.getRecord(),
            values    = form.getValues(),
            tree      = window.down('treepanel'),
            components   = tree.getView().getChecked(),
            tab       = Ext.getCmp("BlueprintEditor").getActiveTab(),
            componentBlueprintStore = Ext.getStore('blueprint.Components'),
            systemBlueprint         = tab.blueprint

        var inputDefinition = Ext.create(
            'Spelled.model.blueprint.SystemInputDefinition',
            {
                name: values.name
            }
        )

        Ext.each(
            components,
            function( component ) {

                var componentBlueprint = componentBlueprintStore.getById( component.get('id') )

                if( componentBlueprint ) {
                    inputDefinition.get('components').push( componentBlueprint.getFullName() )
                }
            }
        )

        systemBlueprint.getInput().add( inputDefinition )

        this.refreshSystemBlueprintInputList( tab )
        window.close()
    },

    deleteInputActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        this.SystemInputDefinition( node.get('id') )
    },

    removeSystemInputDefinition: function( id ) {
        var tab                = Ext.getCmp("BlueprintEditor").getActiveTab(),
            systemBlueprint    = tab.blueprint,
            store              = Ext.getStore( 'blueprint.SystemInputDefinitions' ),
            input              = store.getById( id )

        systemBlueprint.getInput().remove( input )
        store.remove( input )

        this.refreshSystemBlueprintInputList( tab )
    },

    openSystemBlueprint: function( systemBlueprint ) {
        var blueprintEditor = Ext.getCmp("BlueprintEditor"),
            title           = systemBlueprint.getFullName()

        var foundTab = this.application.findActiveTabByTitle( blueprintEditor, title )

        if( foundTab )
            return foundTab

        var editView = Ext.create( 'Spelled.view.blueprint.system.Edit',  {
                title: title,
                blueprint : systemBlueprint
            }
        )

        var header = editView.down( 'systemblueprintdetails' )

        //TODO: find a better solution for setting the details
        header.items.items[0].setValue( systemBlueprint.get('type') )
        header.items.items[1].setValue( systemBlueprint.getFullName() )
        header.items.items[2].setValue( systemBlueprint.get('scriptId') )

        var tab = this.application.createTab( blueprintEditor, editView )

        this.refreshSystemBlueprintInputList( tab )
    },

    refreshSystemBlueprintInputList: function( tab ) {
        var systemBlueprint = tab.blueprint,
            inputView       = tab.down( 'systemblueprintinputlist' )

        var rootNode = inputView.getStore().setRootNode( {
                text: systemBlueprint.getFullName(),
                expanded: true
            }
        )

        systemBlueprint.appendOnTreeNode( rootNode )
    },

    showAddInput: function( ) {
        var View = this.getBlueprintSystemInputAddView(),
            view = new View(),
            availableComponentsView  = view.down( 'treepanel' ),
            blueprintComponentsStore = Ext.getStore( 'blueprint.Components' )


        var rootNode = availableComponentsView.getStore().setRootNode( {
                text: 'Components',
                expanded: true
            }
        )

        this.application.getController('blueprints.Entities').appendComponentsAttributesOnTreeNode( rootNode, blueprintComponentsStore )

        rootNode.eachChild(
            function( node ) {
                node.set('checked', false)
            }
        )
        view.show()
    }
});