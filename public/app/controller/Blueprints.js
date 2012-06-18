Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    BLUEPRINT_TYPE_COMPONENT: 'componentBlueprint',
    BLUEPRINT_TYPE_ENTITY: 'entityBlueprint',
    BLUEPRINT_TYPE_SYSTEM: 'systemBlueprint',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator',
        'blueprint.TreeList',
        'blueprint.Create',
        'blueprint.FolderPicker'
    ],

    models: [
        'blueprint.Component',
        'blueprint.Entity',
        'blueprint.System'
    ],

    stores: [
        'BlueprintsTree',
        'blueprint.Types',
        'blueprint.FoldersTree',
        'blueprint.Components',
        'blueprint.Entities',
        'blueprint.Systems'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'BlueprintEditor',
			selector: '#BlueprintEditor'
		},
		{
			ref: 'BlueprintsTree',
			selector: '#BlueprintsTree'
		}
    ],

    //TODO: Blueprint components get overwritten from entityconfig. strange problem! need to fix ASAP

    init: function() {
        this.control({
            'blueprintsnavigator': {
                activate: this.showBlueprintEditor
            },
            'blueprintstreelist': {
                deleteclick:     this.deleteBlueprintActionIconClick,
                itemcontextmenu: this.showBlueprintsContextMenu,
                itemdblclick:    this.openBlueprint,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
			'blueprinteditor' : {
				tabchange: this.expandPathOnTabChange
			},
            'blueprinteditor [action="showCreateBlueprint"]' : {
                click: this.showCreateBlueprint
            },
            'createblueprint button[action="createBlueprint"]' : {
                click: this.createBlueprint
            },
            'createblueprint > form > combobox[name="type"]' : {
                select: this.changeBlueprintCreationType
            }
        })
    },

	expandPathOnTabChange: function( tabpanel, tab ) {
		var treePanel = this.getBlueprintsTree()
		//works only if title == namespace of the blueprint
		treePanel.selectPath( ".Root." + tab.title, 'text', '.' )
		treePanel.expandPath( ".Root." + tab.title, 'text', '.' )

	},

    deleteBlueprintActionIconClick: function( gridView, rowIndex, colIndex, column, e ) {
        var node = gridView.getRecord( gridView.findTargetByEvent(e) )

        if( !node ) return

        switch( node.get('cls') ) {
            case this.BLUEPRINT_TYPE_COMPONENT:
                this.application.getController('blueprints.Components').removeComponentBlueprint( node.get('id') )
                break
            case this.BLUEPRINT_TYPE_ENTITY:
                this.application.getController('blueprints.Entities').removeEntityBlueprint( node.get('id') )
                break
            case this.BLUEPRINT_TYPE_SYSTEM:
                this.application.getController('blueprints.Systems').removeSystemBlueprint( node.get('id') )
                break
            default:
                return
        }
    },

    showBlueprintsContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showBlueprintsListContextMenu( e )
    },

    changeBlueprintCreationType: function( combo, records ) {

    },

    showCreateBlueprint: function() {
        var View = this.getBlueprintCreateView()
        var view = new View( )
        view.show()
    },

    openBlueprint: function( treeGrid, record ) {
        if( !record.data.leaf ) return

        var Model      = undefined,
            Controller = undefined


        switch( record.get('cls') ) {
            case this.BLUEPRINT_TYPE_COMPONENT:
                Model = this.getBlueprintComponentModel()
                Controller = this.application.getController('blueprints.Components')
                break
            case this.BLUEPRINT_TYPE_ENTITY:
                Model = this.getBlueprintEntityModel()
                Controller = this.application.getController('blueprints.Entities')
                break
            case this.BLUEPRINT_TYPE_SYSTEM:
                Model = this.getBlueprintSystemModel()
                Controller = this.application.getController('blueprints.Systems')
                break
            default:
                return
        }

        Model.load( record.getId(), {
            scope: this,
            success: function( blueprint ) {
				var foundTab = this.application.findActiveTabByTitle( this.getBlueprintEditor(), blueprint.getFullName() )
				if( foundTab ) return foundTab

                Controller.openBlueprint( blueprint )
			}
        })
    },

    removeBlueprintCallback: function( blueprint ) {

        if( !this.application.getController('Blueprints').checkForReferences( blueprint ) ) {
            this.application.getController('Blueprints').removeBlueprint( blueprint )
        } else {
            Ext.Msg.alert( 'Error', 'The Blueprint "' + blueprint.getFullName() + '" is used in this Project and can not be deleted.' +
                '<br>Remove all references to this Blueprint first!')
        }
    },

    removeBlueprint: function( blueprint ) {
        this.closeOpenedTabs( blueprint )

        blueprint.destroy()
        this.refreshStoresAndTreeStores()
    },

    closeOpenedTabs: function( blueprint ) {
        var editorTab = this.getBlueprintEditor()

        editorTab.items.each(
            function( tab ) {
                if( blueprint.get('id') === tab.blueprint.get('id') ) {
                    tab.destroy()
                }
            }
        )
    },

	checkForReferences: function( blueprint ) {
		var found = false

		var checkFunc = function( storeId ) {
			var store  = Ext.getStore( storeId )

			store.each(
				function( item ) {
					if( item.get('blueprintId') === blueprint.getFullName() ) {
						found = true
						return false
					}
				}
			)
		}

		Ext.each(
			[
				'config.Components',
				'config.Entities'
			],
			checkFunc
		)

		return found
	},

    createBlueprint: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
            project = this.application.getActiveProject()

        if( form.isValid() ){

            form.submit(
                {
                    params: {
                        projectName: project.get('name')
                    },
                    waitMsg: 'Creating a new Blueprint',
                    success:
                        Ext.bind(
                            function( form, action ) {
                                Ext.Msg.alert('Success', 'Your blueprint "' + action.result.data.name + '" has been created.')

                                this.refreshStoresAndTreeStores()

                                window.close()
                            },
                            this
                        ),
                    failure: function( form, action ) {
                        Ext.Msg.alert('Failed', action.result)
                    }
                }
            )
        }
    },

    refreshBlueprintStores: function() {
      var projectName = this.application.getActiveProject().get('name')

      this.loadBlueprintStores( projectName )
    },

    loadBlueprintStores: function( projectName ) {
        Spelled.BlueprintsActions.getAllEntitiesBlueprints( projectName, function( provider, response ) {
            var store = Ext.getStore('blueprint.Entities')
            store.removeAll()
            store.loadDataViaReader( response.result )
        })

        Spelled.BlueprintsActions.getAllComponentsBlueprints( projectName, function( provider, response ) {
            var store = Ext.getStore('blueprint.Components')
            store.removeAll()
            store.loadDataViaReader( response.result )
        })

		Spelled.BlueprintsActions.getAllSystemsBlueprints( projectName, function( provider, response ) {
			var store = Ext.getStore('blueprint.Systems')
			store.removeAll()
			store.loadDataViaReader( response.result )
		})
    },

	refreshStoresAndTreeStores: function() {
		this.refreshBlueprintStores()

		this.loadTrees()
	},

    loadTrees: function() {
        this.getBlueprintsTreeStore().load( )
        this.getBlueprintFoldersTreeStore().load( )
    },

    refreshStores: function() {
        this.refreshBlueprintStores()
    },

    showBlueprintEditor : function( ) {
		this.application.hideMainPanels()
        this.loadTrees()

		this.getBlueprintEditor().show()

    }
});