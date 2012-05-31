Ext.define('Spelled.controller.blueprints.Systems', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.system.Edit',
        'blueprint.system.Details',
        'blueprint.system.Input'
    ],

    models: [
        'blueprint.System'
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
            'systemblueprintinputlist [action="addInput"]' : {
                click: this.showAddInput
            }
        })
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
    }
});