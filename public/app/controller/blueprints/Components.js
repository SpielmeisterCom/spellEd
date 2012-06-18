Ext.define('Spelled.controller.blueprints.Components', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.component.Edit',
        'blueprint.component.Details',
        'blueprint.component.Attributes',
        'blueprint.component.Property'
    ],

    models: [
        'blueprint.Component',
        'blueprint.ComponentAttribute'
    ],

    stores: [
        'blueprint.ComponentAttributes',
        'blueprint.Components'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'BlueprintEditor',
			selector: '#BlueprintEditor'
		}
    ],

    init: function() {
        this.control({
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
            'componentblueprintattributeslist [action="addAttribute"]' : {
                click: this.addAttribute
            },
            'componentblueprintattributeslist': {
                select:          this.showAttributeConfig,
                deleteclick:     this.deleteAttributeActionIconClick,
                itemcontextmenu: this.showAttributesListContextMenu,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            }
        })
    },

    deleteAttributeActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        this.removeComponentAttribute( node.get('id') )
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
        var tab        = this.getBlueprintEditor().getActiveTab(),
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

    removeComponentBlueprint: function( id ) {
        var ComponentBlueprint = this.getBlueprintComponentModel()

        ComponentBlueprint.load( id, {
            scope: this,
            success: this.application.getController('Blueprints').removeBlueprintCallback
        })
    },

    saveComponentBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues(),
            tab    = this.getBlueprintEditor().getActiveTab()

        var ownerModel = tab.blueprint

        record.set( values )

        if( !!ownerModel ) {
            ownerModel.save( )
            this.application.getController('Blueprints').refreshBlueprintStores()
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
        var tab                = this.getBlueprintEditor().getActiveTab(),
            componentBlueprint = tab.blueprint,
            store              = Ext.getStore( 'blueprint.ComponentAttributes' ),
            attribute          = store.getById( id )

        componentBlueprint.getAttributes().remove( attribute )
        store.remove( attribute )

        this.refreshComponentBlueprintAttributesList( tab )
    },

    showAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('blueprint.ComponentAttributes').getById( record.getId() )

        if( attribute ) {
            this.fillAttributeConfigView( this.getBlueprintEditor().getActiveTab().down( 'componentblueprintproperty' ), attribute )
        }
    },

    fillAttributeConfigView: function( propertyView, attribute ) {
        propertyView.getForm().loadRecord( attribute )
    },

    openBlueprint: function( componentBlueprint ) {
        var blueprintEditor = this.getBlueprintEditor()

        var editView = Ext.create( 'Spelled.view.blueprint.component.Edit',  {
                title: componentBlueprint.getFullName(),
                blueprint : componentBlueprint
            }
        )

        var form = editView.down( 'componentblueprintdetails' )
        form.loadRecord( componentBlueprint )
        form.getForm().setValues( { tmpName: componentBlueprint.getFullName() } )

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
    }
});