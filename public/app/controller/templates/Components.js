Ext.define('Spelled.controller.templates.Components', {
    extend: 'Ext.app.Controller',

    views: [
        'template.component.Edit',
        'template.component.Details',
        'template.component.Attributes',
        'template.component.Property'
    ],

    models: [
        'template.Component',
        'template.ComponentAttribute'
    ],

    stores: [
        'template.ComponentAttributes',
        'template.Components'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'TemplateEditor',
			selector: '#TemplateEditor'
		}
    ],

    init: function() {
        this.control({
            'componenttemplateproperty button[action="save"]' : {
                click: this.saveComponentTemplate
            },
            'componenttemplateproperty button[action="reset"]' : {
                click: this.resetTemplate
            },
            'componenttemplateproperty > field' : {
                change: function() {
                    console.log("change!")
                }
            },
            'componenttemplateattributeslist [action="addAttribute"]' : {
                click: this.addAttribute
            },
            'componenttemplateattributeslist': {
                select:          this.showAttributeConfig,
                editclick:       this.showAttributesListContextMenu,
                itemcontextmenu: this.showAttributesListContextMenu,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            }
        })
    },

    showComponentsListContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showEntityTemplateComponentsListContextMenu( e )
    },

    showAttributesListContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showComponentAttributesListContextMenu( e )
    },

    addAttribute: function() {
        var tab        = this.getTemplateEditor().getActiveTab(),
            ownerModel = tab.template

        var newAttribute = Ext.create(
            'Spelled.model.template.ComponentAttribute',
            {
                type: "string",
                name: "newAttribute",
                default: "defaultValue"
            }
        )

        ownerModel.getAttributes().add( newAttribute )

        this.refreshComponentTemplateAttributesList( tab )
    },

    removeComponentTemplate: function( id ) {
        var ComponentTemplate = this.getTemplateComponentModel()

        ComponentTemplate.load( id, {
            scope: this,
            success: this.application.getController('Templates').removeTemplateCallback
        })
    },

    saveComponentTemplate: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues(),
            tab    = this.getTemplateEditor().getActiveTab()

        var ownerModel = tab.template

        record.set( values )

        if( !!ownerModel ) {
            ownerModel.save( )
            this.application.getController('Templates').refreshTemplateStores()
            this.refreshComponentTemplateAttributesList( tab )
        }
    },

    resetTemplate: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues()

        console.log( "Reset Template" )
    },

    removeComponentAttribute: function( id ) {
        var tab                = this.getTemplateEditor().getActiveTab(),
            componentTemplate = tab.template,
            store              = Ext.getStore( 'template.ComponentAttributes' ),
            attribute          = store.getById( id )

        componentTemplate.getAttributes().remove( attribute )
        store.remove( attribute )

        this.refreshComponentTemplateAttributesList( tab )
    },

    showAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('template.ComponentAttributes').getById( record.getId() )

        if( attribute ) {
            this.fillAttributeConfigView( this.getTemplateEditor().getActiveTab().down( 'componenttemplateproperty' ), attribute )
        }
    },

    fillAttributeConfigView: function( propertyView, attribute ) {
        propertyView.getForm().loadRecord( attribute )
    },

    openTemplate: function( componentTemplate ) {
        var templateEditor = this.getTemplateEditor()

        var editView = Ext.create( 'Spelled.view.template.component.Edit',  {
                title: componentTemplate.getFullName(),
                template : componentTemplate
            }
        )

        var form = editView.down( 'componenttemplatedetails' )
        form.loadRecord( componentTemplate )
        form.getForm().setValues( { tmpName: componentTemplate.getFullName() } )

        var tab = this.application.createTab( templateEditor, editView )
        this.refreshComponentTemplateAttributesList( tab )
    },

    refreshComponentTemplateAttributesList: function( tab ) {
        var componentTemplate = tab.template,
            attributesView  = tab.down( 'componenttemplateattributeslist' )

        var rootNode = attributesView.getStore().setRootNode( {
                text: componentTemplate.getFullName(),
                expanded: true
            }
        )

        componentTemplate.appendOnTreeNode( rootNode )
    }
});
