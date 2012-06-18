Ext.define('Spelled.controller.blueprints.Systems', {
	extend: 'Ext.app.Controller',

	views: [
		'blueprint.system.Edit',
		'blueprint.system.Details',
		'blueprint.system.Input',
		'blueprint.system.input.Add',
		'script.Editor'
	],

	models: [
		'blueprint.System',
		'blueprint.SystemInputDefinition',
		'Script'
	],

	stores: [
		'blueprint.Systems',
		'blueprint.SystemInputDefinitions',
		'script.Scripts'
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
			'systemblueprintinputlist': {
				deleteclick:     this.deleteInputActionIconClick,
				itemcontextmenu: this.showInputListContextMenu,
				itemmouseenter:  this.application.showActionsOnFolder,
				itemmouseleave:  this.application.hideActions
			},

			'systemblueprintinputlist [action="showAddInput"]' : {
				click: this.showAddInput
			},
			'addinputtoblueprint > form > treepanel': {
				select: this.unSelectOtherComponents
			},
			'addinputtoblueprint button[action="addInput"]' : {
				click: this.addInput
			},
			'systemblueprintedit > panel button[action="saveBlueprint"]' : {
				click: this.saveSystemBlueprint
			},
			'systemblueprintdetails > combobox[name="scriptId"]' : {
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
		var tab	   = this.getBlueprintEditor().getActiveTab(),
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
        this.application.getController('Menu').showSystemBlueprintInputListContextMenu( e )
    },

    addInput: function( button ) {
        var window     = button.up('window'),
            form       = window.down('form'),
            values     = form.getValues(),
            tree       = window.down('treepanel'),
            components = tree.getView().getChecked(),
            tab        = this.getBlueprintEditor().getActiveTab(),
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
					inputDefinition.set( 'blueprintId', componentBlueprint.getFullName() )
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

        this.removeSystemInputDefinition( node.get('id') )
    },

    removeSystemInputDefinition: function( id ) {
        var tab                = this.getBlueprintEditor().getActiveTab(),
            systemBlueprint    = tab.blueprint,
            store              = Ext.getStore( 'blueprint.SystemInputDefinitions' ),
            input              = store.getById( id )

        systemBlueprint.getInput().remove( input )
        store.remove( input )

        this.refreshSystemBlueprintInputList( tab )
    },

    removeSystemBlueprint: function( id ) {
        var SystemBlueprint = this.getBlueprintSystemModel()

        SystemBlueprint.load( id, {
            scope: this,
            success: this.application.getController('Blueprints').removeBlueprintCallback
        })
    },

    openBlueprint: function( systemBlueprint ) {
		var blueprintEditor = this.getBlueprintEditor()

        var editView = Ext.create( 'Spelled.view.blueprint.system.Edit',  {
                title: systemBlueprint.getFullName(),
                blueprint : systemBlueprint
            }
        )

        var form = editView.down( 'systemblueprintdetails' )
        form.loadRecord( systemBlueprint )
        form.getForm().setValues( { tmpName: systemBlueprint.getFullName() } )

        var tab = this.application.createTab( blueprintEditor, editView )

		if( systemBlueprint.get('scriptId') ) {
			this.refreshScriptTab( systemBlueprint.get('scriptId') )
		}

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
    },

    saveSystemBlueprint: function( button ) {
        var panel  = button.up('panel'),
            form   = panel.down('form'),
            values = form.getValues(),
            ownerModel = this.getBlueprintEditor().getActiveTab().blueprint

        ownerModel.set( values )

        if( !!ownerModel ) {
            ownerModel.save( )
            this.application.getController('Blueprints').refreshBlueprintStores()
        }

    }
});