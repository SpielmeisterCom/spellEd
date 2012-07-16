Ext.define('Spelled.controller.Templates', {
    extend: 'Ext.app.Controller',

    TEMPLATE_TYPE_COMPONENT: 'componentTemplate',
	TEMPLATE_TYPE_ENTITY   : 'entityTemplate',
	TEMPLATE_TYPE_SYSTEM   : 'systemTemplate',
	TYPE_ENTITY_COMPOSITE  : 'templateEntityComposite',

    views: [
        'template.Editor',
        'template.Navigator',
        'template.TreeList',
        'template.Create',
        'template.FolderPicker'
    ],

    models: [
        'template.Component',
        'template.Entity',
        'template.System'
    ],

    stores: [
        'TemplatesTree',
        'template.Types',
        'template.FoldersTree',
        'template.Components',
        'template.Entities',
        'template.Systems'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        },
		{
			ref : 'RightPanel',
			selector: '#RightPanel'
		},
		{
			ref : 'TemplateEditor',
			selector: '#TemplateEditor'
		},
		{
			ref: 'TemplatesTree',
			selector: '#TemplatesTree'
		}
    ],

    init: function() {
        this.control({
            'templatesnavigator': {
                activate: this.showTemplateEditor
            },
			'templatestreelist button[action="showCreateTemplate"]': {
				click: this.showCreateTemplate
			},
            'templatestreelist': {
                editclick:       this.showTemplatesContextMenu,
                itemcontextmenu: this.showTemplatesContextMenu,
                itemdblclick:    this.openTemplate,
				select:          this.showConfig,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
            'createtemplate button[action="createTemplate"]' : {
                click: this.createTemplate
            },
            'createtemplate > form > combobox[name="type"]' : {
                select: this.changeTemplateCreationType
            }
        })
    },

	showConfig: function( treeGrid, record ) {
		this.getRightPanel().removeAll()

		switch( record.get('cls') ) {
			case this.TEMPLATE_TYPE_ENTITY:
				this.application.getController('templates.Entities').showEntityTemplateComponentsListHelper( record.getId() )
				break
			case this.TYPE_ENTITY_COMPOSITE:
				this.application.getController('templates.Entities').showEntityCompositeComponentsListHelper( record )
				break
			default:
				return
		}

	},

    deleteTemplateAction: function( node ) {
        if( !node ) return

        switch( node.get('cls') ) {
            case this.TEMPLATE_TYPE_COMPONENT:
				if( !node.isLeaf() ) return
				this.application.getController('templates.Components').removeComponentTemplate( node.get('id') )
                break
            case this.TEMPLATE_TYPE_ENTITY:
                this.application.getController('templates.Entities').removeEntityTemplate( node.get('id') )
                break
			case this.TYPE_ENTITY_COMPOSITE:
				this.application.getController('templates.Entities').removeEntityCompositeNode( node )
				break
            case this.TEMPLATE_TYPE_SYSTEM:
				if( !node.isLeaf() ) return
                this.application.getController('templates.Systems').removeSystemTemplate( node.get('id') )
                break
            default:
                return
        }
    },

    showTemplatesContextMenu: function( view, record, item, index, e, options ) {

		switch( record.get('cls') ) {
			case this.TEMPLATE_TYPE_ENTITY:
			case this.TYPE_ENTITY_COMPOSITE:
				this.application.getController('Menu').showTemplatesListEntityContextMenu( e )
				break
			default:
				this.application.getController('Menu').showTemplatesListContextMenu( e )
		}
    },

    changeTemplateCreationType: function( combo, records ) {

    },

    showCreateTemplate: function() {
        var View = this.getTemplateCreateView()
        var view = new View( )
        view.show()
    },

    openTemplate: function( treeGrid, record ) {
        if( !record.data.leaf ) return

        var Model      = undefined,
            Controller = undefined


        switch( record.get('cls') ) {
            case this.TEMPLATE_TYPE_COMPONENT:
                Model = this.getTemplateComponentModel()
                Controller = this.application.getController('templates.Components')
                break
            case this.TEMPLATE_TYPE_SYSTEM:
                Model = this.getTemplateSystemModel()
                Controller = this.application.getController('templates.Systems')
                break
            default:
                return
        }

        Model.load( record.getId(), {
            scope: this,
            success: function( template ) {
				var foundTab = this.application.findActiveTabByTitle( this.getTemplateEditor(), template.getFullName() )
				if( foundTab ) return foundTab

                Controller.openTemplate( template )
			}
        })
    },

    removeTemplateCallback: function( template ) {

        if( !this.application.getController('Templates').checkForReferences( template ) ) {
            this.application.getController('Templates').removeTemplate( template )
			this.application.removeSelectedNode( Ext.getCmp( 'TemplatesTree' ) )
        } else {
            Ext.Msg.alert( 'Error', 'The Template "' + template.getFullName() + '" is used in this Project and can not be deleted.' +
                '<br>Remove all references to this Template first!')
        }
    },

    removeTemplate: function( template ) {
        this.closeOpenedTabs( template )

        template.destroy()
        this.refreshStores()
    },

    closeOpenedTabs: function( template ) {
        var editorTab = this.getTemplateEditor()

        editorTab.items.each(
            function( tab ) {
                if( !!tab.template && template.get('id') === tab.template.get('id') ) {
                    tab.destroy()
                }
            }
        )
    },

	checkForReferences: function( template ) {
		var found = false

		var checkFunc = function( storeId ) {
			var store  = Ext.getStore( storeId )

			store.each(
				function( item ) {
					if( item.get('templateId') === template.getFullName() ) {
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

    createTemplate: function( button ) {
        var form    = button.up('form').getForm(),
            window  = button.up( 'window' ),
            project = this.application.getActiveProject()

        if( form.isValid() ){

            form.submit(
                {
                    params: {
                        projectName: project.get('name')
                    },
                    waitMsg: 'Creating a new Template',
                    success:
                        Ext.bind(
                            function( form, action ) {
                                Ext.Msg.alert('Success', 'Your template "' + action.result.data.name + '" has been created.')

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

    refreshTemplateStores: function() {
      var projectName = this.application.getActiveProject().get('name')

      this.loadTemplateStores( projectName )
    },

    loadTemplateStores: function( projectName ) {
        Spelled.TemplatesActions.getAllEntitiesTemplates( projectName, function( provider, response ) {
            var store = Ext.getStore('template.Entities')
            store.removeAll()
            store.loadDataViaReader( response.result )
        })

        Spelled.TemplatesActions.getAllComponentsTemplates( projectName, function( provider, response ) {
            var store = Ext.getStore('template.Components')
            store.removeAll()
            store.loadDataViaReader( response.result )
        })

		Spelled.TemplatesActions.getAllSystemsTemplates( projectName, function( provider, response ) {
			var store = Ext.getStore('template.Systems')
			store.removeAll()
			store.loadDataViaReader( response.result )
		})
    },

	refreshStoresAndTreeStores: function() {
		this.refreshTemplateStores()

		this.loadTrees()
	},

    loadTrees: function() {
        this.getTemplatesTreeStore().load()
        this.getTemplateFoldersTreeStore().load( )
    },

    refreshStores: function() {
        this.refreshTemplateStores()
    },

    showTemplateEditor : function( ) {
		this.application.hideMainPanels()
		this.getRightPanel().show()
        this.loadTrees()

		this.getTemplateEditor().show()

    }
});
