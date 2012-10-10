Ext.define('Spelled.controller.templates.Systems', {
	extend: 'Ext.app.Controller',

	views: [
		'template.system.Configuration',
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
			selector: '#SceneEditor'
		},
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref : 'SecondTabPanel',
			selector: '#SecondTabPanel'
		}
	],

	init: function() {
		this.control({
			'sceneeditor scripteditor': {
				scriptchange: Ext.bind( function(){
					var tab = this.getTemplateEditor().getActiveTab()
					if( tab.getXType() === 'scripteditor' && tab.template ) this.markSystemAsDirty( tab.template )
				},this)
			},
			'systemtemplateedit': {
				activate: Ext.bind( function( tab ) { this.refreshSystemConfiguration( tab.template ) }, this)
			},
			'systemtemplateinputlist': {
				edit: this.dirtyHelper,
				editclick:         this.showInputListContextMenu,
				itemcontextmenu:   this.showInputListContextMenu
			},
			'systemtemplateinputlist tool-documentation': {
				showDocumentation: this.showDocumentation
			},
			'systemblueprintinputlist [action="editclick"]': {
				click: this.showInputListContextMenu
			},

			'systemtemplateinputlist [action="showAddInput"]' : {
				click: this.showAddInput
			},
			'addinputtotemplate > form > treepanel': {
				select: this.unSelectOtherComponents
			},
			'addinputtotemplate button[action="addInput"]' : {
				click: this.addInput
			}
		})

		this.application.on( {
			showsystemtemplateconfig: this.refreshSystemConfiguration,
			globalsave: this.saveAllSystemScriptsInTabs,
			scope: this
		})
	},

	saveAllSystemScriptsInTabs: function() {
		this.getTemplateEditor().items.each(
			function( panel ) {
				if( panel.getXType() === 'systemtemplateedit' ) this.application.fireEvent( 'savescriptpanel', panel )
			},
			this
		)
	},

	dirtyHelper: function( editor, e ) {
		this.application.fireEvent( 'systemchange', e.record.getSystem() )
		this.markSystemAsDirty( e.record )
	},

	markSystemAsDirty: function( model ) {
		model.setDirty()
	},

	showDocumentation: function( docString ) {
		this.application.showDocumentation( docString )
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

	refreshScriptTab: function( tab, systemTemplate ) {
		tab.setModel( systemTemplate )
		tab.refreshContent()
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
            componentTemplateStore = Ext.getStore('template.Components'),
			systemTemplate         = this.getRightPanel().down( 'systemtemplatedetails').getForm().getRecord()

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
					inputDefinition.set( 'componentId', componentTemplate.getFullName() )
                }
            }
        )

        systemTemplate.getInput().add( inputDefinition )
		systemTemplate.setDirty()

		this.application.fireEvent( 'systemchange', systemTemplate )
        this.refreshSystemTemplateInputList()
        window.close()
    },

    removeSystemInputDefinition: function( id ) {
        var systemTemplate     = this.getRightPanel().down( 'systemtemplatedetails').getForm().getRecord(),
            store              = Ext.getStore( 'template.SystemInputDefinitions' ),
            input              = store.getById( id )

        systemTemplate.getInput().remove( input )
		systemTemplate.setDirty()
        store.remove( input )

		this.application.fireEvent( 'systemchange', systemTemplate )
        this.refreshSystemTemplateInputList()
    },

    removeSystemTemplate: function( id ) {
        var SystemTemplate = this.getTemplateSystemModel()

        SystemTemplate.load( id, {
            scope: this,
            success: this.application.getController('Templates').removeTemplateCallback
        })
    },

	prepareConfigurationView: function( view, systemTemplate ) {
		var form      = view.down( 'systemtemplatedetails' ),
			inputView = view.down( 'systemtemplateinputlist' )

		form.loadRecord( systemTemplate )
		form.getForm().setValues( { tmpName: systemTemplate.getFullName() } )

		if( systemTemplate.isReadonly() ) {
			view.disable()
			this.application.getController( 'Templates' ).addDisabledTemplateHeader( view )
		}
		inputView.reconfigure( systemTemplate.getInput() )
	},

	refreshSystemConfiguration: function( template ) {
		var configurationView = Ext.widget( 'systemtemplateconfiguration' )
		this.getRightPanel().removeAll()

		this.prepareConfigurationView( configurationView, template )
		this.getRightPanel().add( configurationView )
		this.refreshSystemTemplateInputList()
	},

    openTemplate: function( systemTemplate ) {
		var templateEditor    = this.getTemplateEditor(),
			configurationView = Ext.widget( 'systemtemplateconfiguration' )

        var editView = Ext.widget( 'systemtemplateedit',  {
                title: systemTemplate.getFullName(),
                template: systemTemplate
            }
        )

        var tab = this.application.createTab( templateEditor, editView )

		this.prepareConfigurationView( configurationView, systemTemplate )
		this.getRightPanel().add( configurationView )
        this.refreshSystemTemplateInputList()

		editView.aceEditor.setReadOnly( systemTemplate.isReadonly() )
		this.refreshScriptTab( tab, systemTemplate )
    },

    refreshSystemTemplateInputList: function() {
        var systemTemplate  = this.getRightPanel().down( 'systemtemplatedetails').getForm().getRecord(),
            inputView       = this.getRightPanel().down( 'systemtemplateinputlist' )

		inputView.reconfigure( systemTemplate.getInput() )
    },

    showAddInput: function( ) {
        var View = this.getTemplateSystemInputAddView(),
            view = new View(),
            availableComponentsView = view.down( 'treepanel' ),
            templateComponentsStore = Ext.getStore( 'template.Components' )


        var rootNode = availableComponentsView.getStore().setRootNode( {
                text: 'Components',
                expanded: true
            }
        )

        this.application.getController('Components').appendComponentsAttributesOnTreeNode( rootNode, templateComponentsStore )

        rootNode.eachChild(
            function( node ) {
                node.set('checked', false)
            }
        )
        view.show()
    }
});
