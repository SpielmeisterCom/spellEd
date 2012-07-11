Ext.define('Spelled.controller.templates.Systems', {
	extend: 'Ext.app.Controller',

	views: [
		'template.system.Edit',
		'template.system.Details',
		'template.system.Input',
		'template.system.input.Add',
		'template.system.input.ComboBox',
		'script.Editor'
	],

	models: [
		'template.System',
		'template.SystemInputDefinition',
		'Script'
	],

	stores: [
		'template.Systems',
		'template.SystemInputDefinitions',
		'script.Scripts'
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
			'systemtemplateinputlist': {
				editclick:       this.showInputListContextMenu,
				itemcontextmenu: this.showInputListContextMenu
			},
			'systemblueprintinputlist [action="editclick"]': {
				click:       this.showInputListContextMenu
			},

			'systemtemplateinputlist [action="showAddInput"]' : {
				click: this.showAddInput
			},
			'addinputtotemplate > form > treepanel': {
				select: this.unSelectOtherComponents
			},
			'addinputtotemplate button[action="addInput"]' : {
				click: this.addInput
			},
			'systemtemplateedit > panel button[action="saveTemplate"]' : {
				click: this.saveSystemTemplate
			},
			'systemtemplatedetails > combobox[name="scriptId"]' : {
				select: this.changeScript
			}
		})
	},

	unSelectOtherComponents: function( grid, node ) {
		if( node.get('checked') === true || node.isLeaf() || node.isRoot() ) return

		var root = node.parentNode
		root.eachChild(
			function( child ) {
				if( child.getId() !== node.getId() ) {
					child.set('checked', false)
				}
			}
		)
	},

	changeScript: function( combo, records ) {
		this.refreshScriptTab( combo.getValue() )
	},

	refreshScriptTab: function( scriptId ) {
		var tab	   = this.getTemplateEditor().getActiveTab(),
			editor = tab.down('scripteditor'),
			Script = this.getScriptModel()

		Script.load(
			scriptId, {
				scope: this,
				success: function( script ) {
					editor.setModel( script )
				}
			}
		)
	},

    showInputListContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showSystemTemplateInputListContextMenu( e )
    },

    addInput: function( button ) {
        var window     = button.up('window'),
            form       = window.down('form'),
            values     = form.getValues(),
            tree       = window.down('treepanel'),
            components = tree.getView().getChecked(),
            tab        = this.getTemplateEditor().getActiveTab(),
            componentTemplateStore = Ext.getStore('template.Components'),
            systemTemplate         = tab.template

        var inputDefinition = Ext.create(
            'Spelled.model.template.SystemInputDefinition',
            {
                name: values.name
            }
        )

        Ext.each(
            components,
            function( component ) {

                var componentTemplate = componentTemplateStore.getById( component.get('id') )

                if( componentTemplate ) {
					inputDefinition.set( 'templateId', componentTemplate.getFullName() )
                }
            }
        )

        systemTemplate.getInput().add( inputDefinition )

        this.refreshSystemTemplateInputList( tab )
        window.close()
    },

    removeSystemInputDefinition: function( id ) {
        var tab                = this.getTemplateEditor().getActiveTab(),
            systemTemplate    = tab.template,
            store              = Ext.getStore( 'template.SystemInputDefinitions' ),
            input              = store.getById( id )

        systemTemplate.getInput().remove( input )
        store.remove( input )

        this.refreshSystemTemplateInputList( tab )
    },

    removeSystemTemplate: function( id ) {
        var SystemTemplate = this.getTemplateSystemModel()

        SystemTemplate.load( id, {
            scope: this,
            success: this.application.getController('Templates').removeTemplateCallback
        })
    },

    openTemplate: function( systemTemplate ) {
		var templateEditor = this.getTemplateEditor()

        var editView = Ext.create( 'Spelled.view.template.system.Edit',  {
                title: systemTemplate.getFullName(),
                template : systemTemplate
            }
        )

        var form = editView.down( 'systemtemplatedetails' )
        form.loadRecord( systemTemplate )
        form.getForm().setValues( { tmpName: systemTemplate.getFullName() } )

        var tab = this.application.createTab( templateEditor, editView )

		if( systemTemplate.get('scriptId') ) {
			this.refreshScriptTab( systemTemplate.get('scriptId') )
		}

        this.refreshSystemTemplateInputList( tab )
    },

    refreshSystemTemplateInputList: function( tab ) {
        var systemTemplate  = tab.template,
            inputView       = tab.down( 'systemtemplateinputlist' )

		inputView.reconfigure( systemTemplate.getInput() )
    },

    showAddInput: function( ) {
        var View = this.getTemplateSystemInputAddView(),
            view = new View(),
            availableComponentsView  = view.down( 'treepanel' ),
            templateComponentsStore = Ext.getStore( 'template.Components' )


        var rootNode = availableComponentsView.getStore().setRootNode( {
                text: 'Components',
                expanded: true
            }
        )

        this.application.getController('templates.Entities').appendComponentsAttributesOnTreeNode( rootNode, templateComponentsStore )

        rootNode.eachChild(
            function( node ) {
                node.set('checked', false)
            }
        )
        view.show()
    },

    saveSystemTemplate: function( button ) {
        var panel  = button.up('panel'),
            form   = panel.down('form'),
            values = form.getValues(),
			grid   = panel.down('systemtemplateinputlist'),
            ownerModel = this.getTemplateEditor().getActiveTab().template

        ownerModel.set( values )

        if( !!ownerModel ) {
            ownerModel.save( )
			grid.getStore().commitChanges()
            this.application.getController('Templates').refreshTemplateStores()
        }

    }
});
