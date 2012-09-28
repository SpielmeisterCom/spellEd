Ext.define('Spelled.controller.templates.Components', {
    extend: 'Ext.app.Controller',

    views: [
        'template.component.Edit',
        'template.component.Details',
        'template.component.Attributes',
        'template.component.Property',
		'template.component.attribute.Object',
		'template.component.attribute.Vec2',
		'template.component.attribute.String',
		'template.component.attribute.Number',
		'template.component.attribute.List',
		'template.component.attribute.Integer',
		'template.component.attribute.Boolean',
		'template.component.attribute.Appearance',
		'template.component.attribute.AnimatedAppearance',
		'template.component.attribute.TextAppearance',
		'template.component.attribute.Sound',
		'template.component.attribute.KeyToActionMap'
    ],

    models: [
        'template.Component',
        'template.ComponentAttribute'
    ],

    stores: [
        'template.component.Attributes',
		'template.component.AttributeTypes',
        'template.Components'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'TemplateEditor',
			selector: '#SceneEditor'
		}
    ],

    init: function() {
        this.control({
			'componenttemplateedit form field': {
				change: this.updateComponent
			},
            'componenttemplateproperty > combobox[name="type"]' : {
                change: this.changedAttributeType
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

	updateComponent: function( field, newValue ) {
		var form   = field.up( 'form' ).getForm(),
			record = form.getRecord(),
			values = field.getModelData(),
			tab    = this.getTemplateEditor().getActiveTab()

		if( Ext.isDefined( record.data[ field.getName() ] ) && newValue != record.get( field.getName()) ){
			record.setDirty()

			record.set( values )
			if( tab ) this.refreshComponentTemplateAttributesList( tab )
		}
	},

    showAttributesListContextMenu: function( view, record, item, index, e, options ) {
		if( !view.panel.down( 'actioncolumn').isHidden() )
        	this.application.getController('Menu').showComponentAttributesListContextMenu( e )
		else
			e.preventDefault()
    },

    addAttribute: function() {
        var tab        = this.getTemplateEditor().getActiveTab(),
            ownerModel = tab.template

        var newAttribute = Ext.create(
            'Spelled.model.template.ComponentAttribute',
            {
                type: "string",
                name: "newAttribute",
                "default": "defaultValue"
            }
        )

		newAttribute.setComponent( ownerModel )
        ownerModel.getAttributes().add( newAttribute )
		newAttribute.setDirty()

        this.refreshComponentTemplateAttributesList( tab )
    },

    removeComponentTemplate: function( id ) {
        var ComponentTemplate = this.getTemplateComponentModel()

        ComponentTemplate.load( id, {
            scope: this,
            success: this.application.getController('Templates').removeTemplateCallback
        })
    },

    removeComponentAttribute: function( id ) {
        var tab                = this.getTemplateEditor().getActiveTab(),
            componentTemplate = tab.template,
            store              = Ext.getStore( 'template.component.Attributes' ),
            attribute          = store.getById( id )

        componentTemplate.getAttributes().remove( attribute )
        store.remove( attribute )

        this.refreshComponentTemplateAttributesList( tab )
    },

    showAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

		var attribute = Ext.getStore('template.component.Attributes').getById( record.getId() )

        if( attribute ) {
            this.fillAttributeConfigView( this.getTemplateEditor().getActiveTab().down( 'componenttemplateproperty' ), attribute )
        }
    },

	changedAttributeType: function( combobox, value ) {
		var propertyView = combobox.up( 'componenttemplateproperty'),
			attribute    = propertyView.getRecord()

		attribute.set( 'type', value )

		this.fillAttributeConfigView( propertyView, attribute )
	},

    fillAttributeConfigView: function( propertyView, attribute ) {
		var attributeType = this.getTemplateComponentAttributeTypesStore().findRecord( 'name', attribute.get('type') )

		if( propertyView.down('[name="default"]') ) propertyView.remove( propertyView.down('[name="default"]') )

		propertyView.add({
			xtype: attributeType.get('type'),
			name: 'default',
			allowBlank:false,
			fieldLabel: 'Default value'
		})

		propertyView.showConfig()
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

		if( componentTemplate.isReadonly() ) {
			this.application.getController( 'Templates' ).addDisabledTemplateHeader( editView )

			editView.down('componenttemplatedetails').disable()
			editView.down('componenttemplateproperty').disable()
			editView.down('componenttemplateattributeslist').setReadonly()
		}

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
