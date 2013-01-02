Ext.define('Spelled.controller.templates.Components', {
    extend: 'Ext.app.Controller',

	requires: [
		'Spelled.view.template.component.Edit',
		'Spelled.view.template.component.Details',
		'Spelled.view.template.component.Attributes',
		'Spelled.view.template.component.Property',
		'Spelled.view.template.component.attribute.Object',
		'Spelled.view.template.component.attribute.Vec2',
		'Spelled.view.template.component.attribute.Vec3',
		'Spelled.view.template.component.attribute.Vec4',
		'Spelled.view.template.component.attribute.String',
		'Spelled.view.template.component.attribute.Number',
		'Spelled.view.template.component.attribute.List',
		'Spelled.view.template.component.attribute.Integer',
		'Spelled.view.template.component.attribute.Boolean',
		'Spelled.view.template.component.attribute.Appearance',
		'Spelled.view.template.component.attribute.AnimatedAppearance',
		'Spelled.view.template.component.attribute.KeyFrameAnimation',
		'Spelled.view.template.component.attribute.TextAppearance',
		'Spelled.view.template.component.attribute.Sound',
        'Spelled.view.template.component.attribute.Script',
		'Spelled.view.template.component.attribute.KeyToActionMap',
		'Spelled.view.template.component.attribute.TileMap',
		'Spelled.view.template.component.attribute.Enum',

		'Spelled.model.template.Component',
		'Spelled.model.template.ComponentAttribute',

		'Spelled.store.template.component.Attributes',
		'Spelled.store.template.component.AttributeTypes',
		'Spelled.store.template.Components'

	],

    views: [
        'template.component.Edit',
        'template.component.Details',
        'template.component.Attributes',
        'template.component.Property',
		'template.component.attribute.Object',
		'template.component.attribute.Vec2',
		'template.component.attribute.Vec3',
		'template.component.attribute.Vec4',
		'template.component.attribute.String',
		'template.component.attribute.Number',
		'template.component.attribute.List',
		'template.component.attribute.Integer',
		'template.component.attribute.Boolean',
		'template.component.attribute.Appearance',
		'template.component.attribute.AnimatedAppearance',
		'template.component.attribute.KeyFrameAnimation',
		'template.component.attribute.TextAppearance',
		'template.component.attribute.Sound',
        'template.component.attribute.Script',
		'template.component.attribute.KeyToActionMap',
	    'template.component.attribute.TileMap',
		'template.component.attribute.Enum'
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

			if( values['default'] ) values['default'] = Spelled.Converter.decodeFieldValue( values['default'], record.get( 'type' ) )

			record.set( values )
			if( tab ) this.refreshComponentTemplateAttributesList( tab )
		}
	},

    showAttributesListContextMenu: function( view, record, item, index, e, options ) {
		if( !view.panel.down( 'actioncolumn').isHidden() )
        	this.application.getController('Menu').showComponentAttributesListContextMenu( view, e )
		else
			e.preventDefault()
    },

    addAttribute: function( button ) {
        var tab        = button.up('tabpanel').getActiveTab(),
            ownerModel = tab.template

        var newAttribute = Ext.create(
            'Spelled.model.template.ComponentAttribute',
            {
                type: "string",
                name: "newAttribute"
            }
        )

		newAttribute.setComponent( ownerModel )
        ownerModel.getAttributes().add( newAttribute )
		newAttribute.setDirty()

        this.refreshComponentTemplateAttributesList( tab )
    },

    removeComponentTemplate: function( id ) {
        var component = this.getTemplateComponentsStore().getById( id )

        this.application.getController('Templates').removeTemplateCallback( component )
    },

    removeComponentAttribute: function( tabPanel, id ) {
        var tab                = tabPanel.getActiveTab(),
            componentTemplate  = tab.template,
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
            this.fillAttributeConfigView( treePanel.view.up('tabpanel').getActiveTab().down( 'componenttemplateproperty' ), attribute )
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
		if( propertyView.down('[name="values"]') ) propertyView.remove( propertyView.down('[name="values"]') )

		var defaultValueField = {
			xtype: attributeType.get('type'),
			name: 'default',
			allowBlank:false,
			fieldLabel: 'Default value',
			matchFieldWidth: true
		}

		if( attributeType.get('type') === 'spelledenumfield') {
			propertyView.add({
				xtype: 'spelledlistfield',
				name: 'values',
				allowBlank: false,
				fieldLabel: 'Values',
				listeners: {
					change: function( field ) {
						var value    = field.getValue(),
							combobox = this.up( 'componenttemplateproperty' ).down( attributeType.get('type') ),
							store    = ( Ext.isString( value ) ) ? value.split(',') : []

						if( value ) {
							combobox.bindStore( store )
						}
					}
				}
			})

			defaultValueField.store = attribute.get( 'values' )
		}

		var field = propertyView.add( defaultValueField )

		propertyView.showConfig()
        propertyView.getForm().loadRecord( attribute )

		if( field.isValid() ) attribute.set( 'default', field.getValue() )
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
