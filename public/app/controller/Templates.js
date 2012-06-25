Ext.define('Spelled.controller.Templates', {
    extend: 'Ext.app.Controller',

    TEMPLATE_TYPE_COMPONENT: 'componentTemplate',
	TEMPLATE_TYPE_ENTITY   : 'entityTemplate',
	TEMPLATE_TYPE_SYSTEM   : 'systemTemplate',

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
			ref : 'TemplateEditor',
			selector: '#TemplateEditor'
		},
		{
			ref: 'TemplatesTree',
			selector: '#TemplatesTree'
		}
    ],

    //TODO: Template components get overwritten from entityconfig. strange problem! need to fix ASAP

    init: function() {
        this.control({
            'templatesnavigator': {
                activate: this.showTemplateEditor
            },
            'templatestreelist': {
                editclick:       this.showTemplatesContextMenu,
                itemcontextmenu: this.showTemplatesContextMenu,
                itemdblclick:    this.openTemplate,
                itemmouseenter:  this.application.showActionsOnLeaf,
                itemmouseleave:  this.application.hideActions
            },
			'templateeditor' : {
				tabchange: this.expandPathOnTabChange
			},
            'templateeditor [action="showCreateTemplate"]' : {
                click: this.showCreateTemplate
            },
            'createtemplate button[action="createTemplate"]' : {
                click: this.createTemplate
            },
            'createtemplate > form > combobox[name="type"]' : {
                select: this.changeTemplateCreationType
            }
        })
    },

	expandPathOnTabChange: function( tabpanel, tab ) {
		var treePanel = this.getTemplatesTree()
		//works only if title == namespace of the template
		treePanel.selectPath( ".Root." + tab.title, 'text', '.' )
		treePanel.expandPath( ".Root." + tab.title, 'text', '.' )

	},

    deleteTemplateAction: function( node ) {
        if( !node ) return

        switch( node.get('cls') ) {
            case this.TEMPLATE_TYPE_COMPONENT:
                this.application.getController('templates.Components').removeComponentTemplate( node.get('id') )
                break
            case this.TEMPLATE_TYPE_ENTITY:
                this.application.getController('templates.Entities').removeEntityTemplate( node.get('id') )
                break
            case this.TEMPLATE_TYPE_SYSTEM:
                this.application.getController('templates.Systems').removeSystemTemplate( node.get('id') )
                break
            default:
                return
        }
    },

    showTemplatesContextMenu: function( view, record, item, index, e, options ) {
        this.application.getController('Menu').showTemplatesListContextMenu( e )
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
            case this.TEMPLATE_TYPE_ENTITY:
                Model = this.getTemplateEntityModel()
                Controller = this.application.getController('templates.Entities')
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
                if( template.get('id') === tab.template.get('id') ) {
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
        this.getTemplatesTreeStore().load( )
        this.getTemplateFoldersTreeStore().load( )
    },

    refreshStores: function() {
        this.refreshTemplateStores()
    },

    showTemplateEditor : function( ) {
		this.application.hideMainPanels()
        this.loadTrees()

		this.getTemplateEditor().show()

    }
});
