Ext.define('Spelled.controller.Templates', {
    extend: 'Ext.app.Controller',

    TEMPLATE_TYPE_COMPONENT: 'component',
	TEMPLATE_TYPE_ENTITY   : 'entity',
	TEMPLATE_TYPE_SYSTEM   : 'system',
	TYPE_ENTITY_COMPOSITE  : 'templateEntityComposite',

    views: [
        'template.Create',
        'template.FolderPicker',
		'template.ReadOnly'
    ],

    models: [
        'template.Component',
        'template.Entity',
        'template.System'
    ],

    stores: [
        'template.Types',
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
			selector: '#LibraryTabPanel'
		},
		{
			ref: 'TemplatesTree',
			selector: '#LibraryTree'
		}
    ],

    init: function() {
        this.control({
			'librarytreelist button[action="showCreateTemplate"]': {
				click: this.showCreateTemplate
			},
            'createtemplate button[action="createTemplate"]' : {
                click: this.createTemplate
            }
        })

		this.application.on({
			templatecontextmenu: this.showTemplatesContextMenu,
			templatedblclick:    this.openTemplate,
			templatebeforeclose: this.checkIfTemplateIsDirty,
			templatetabchange:  this.openTabTemplate,
			scope: this
		})
    },

	checkIfTemplateIsDirty: function( panel ) {
		var template = panel.template
		if( template.isDirty() ) {
			var callback =  Ext.bind(
				function( button ) {
					if ( button === 'yes') this.closeTemplateTab( panel )
				},
				this
			)

			this.application.dirtySaveAlert( template, callback )
			return false
		} else {
			return this.closeTemplateTab( panel )
		}
	},

	closeTemplateTab: function( panel ) {
		panel.destroy()
		this.getRightPanel().removeAll()
	},

	addDisabledTemplateHeader: function( view ) {
		view.insert( 0,{
				xtype: 'readonlytemplateheader'
			}
		)
	},

	openTabTemplate: function( tabPanel, newCard ) {
		var tree = this.getTemplatesTree(),
			node = tree.getRootNode().findChild( 'id', newCard.template.getId(), true )

		tree.expandPath( node.getPath() )
		tree.getSelectionModel().select( node )

		this.getRightPanel().removeAll()

		this.openTemplate( tree, node )
	},

	showConfig: function( treeGrid, record ) {
		switch( record.get('cls') ) {
			case this.TEMPLATE_TYPE_ENTITY:
				this.getRightPanel().removeAll()
				this.application.fireEvent( 'showtemplatecomponents', record.getId() )
				break
			case this.TYPE_ENTITY_COMPOSITE:
				this.getRightPanel().removeAll()
				this.application.fireEvent( 'showcompositecomponents', record )
				break
			case this.TEMPLATE_TYPE_SYSTEM:
				this.getRightPanel().removeAll()
				var template = this.getTemplateSystemsStore().getById( record.getId() )
				if( !template ) return

				var tab = this.application.findActiveTabByTitle( this.getTemplateEditor(), template.getFullName() )
				if( tab ) {
					this.application.fireEvent( 'showsystemtemplateconfig', tab )
				}

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
		var node = this.application.getLastSelectedNode( this.getTemplatesTree() )

		switch( node.get('cls') ) {
			case this.TEMPLATE_TYPE_ENTITY:
			case this.TYPE_ENTITY_COMPOSITE:
				this.application.getController('Menu').showTemplatesListEntityContextMenu( e )
				break
			default:
				this.application.getController('Menu').showTemplatesListContextMenu( e )
		}
    },

    showCreateTemplate: function( button ) {
        var View = this.getTemplateCreateView(),
        	view = new View(),
			combo = view.down('combobox[name="type"]')

		combo.setValue( button.type )

        view.show()
    },

    openTemplate: function( treeGrid, record ) {
		this.showConfig( treeGrid, record )

        var Model      = undefined,
            Controller = undefined,
			store      = undefined

        switch( record.get('cls') ) {
            case this.TEMPLATE_TYPE_COMPONENT:
                Model = this.getTemplateComponentModel()
                Controller = this.application.getController('templates.Components')
				store = this.getTemplateComponentsStore()
                break
            case this.TEMPLATE_TYPE_SYSTEM:
                Model = this.getTemplateSystemModel()
                Controller = this.application.getController('templates.Systems')
				store = this.getTemplateSystemsStore()
                break
			case this.TEMPLATE_TYPE_ENTITY:
				Model = this.getTemplateEntityModel()
				Controller = this.application.getController('templates.Entities')
				store = this.getTemplateEntitiesStore()
				break
			case this.TYPE_ENTITY_COMPOSITE:
				//composites show owner entity as preview
				Model = this.getTemplateEntityModel()
				Controller = this.application.getController('templates.Entities')
				store = this.getTemplateEntitiesStore()
				record = Controller.getOwnerNode( record )
				break
            default:
                return
        }

		var template = store.getById( record.getId() ),
			foundTab = this.application.findActiveTabByTitle( this.getTemplateEditor(), template.getFullName() )

		if( foundTab ) return foundTab

		Controller.openTemplate( template )
    },

    removeTemplateCallback: function( template ) {

        if( !this.application.getController('Templates').checkForReferences( template ) ) {
            this.application.getController('Templates').removeTemplate( template )
			this.application.removeSelectedNode( Ext.getCmp( 'LibraryTree' ) )
        } else {
            Ext.Msg.alert( 'Error', 'The Template "' + template.getFullName() + '" is used in this Project and can not be deleted.' +
                '<br>Remove all references to this Template first!')
        }
    },

    removeTemplate: function( template ) {
        this.closeOpenedTabs( template )

        template.destroy({
			callback: this.refreshStores,
			scope: this
		})

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
			values  = form.getValues(),
			Model   = undefined,
			content = {
				name: values.name,
				namespace: ( values.namespace === 'root' ) ? '' : values.namespace.substring( 5 ),
				subtype: values.type
			}

		switch( values.type ) {
			case this.TEMPLATE_TYPE_COMPONENT:
				Model = this.getTemplateComponentModel()
				break
			case this.TEMPLATE_TYPE_SYSTEM:
				Model = this.getTemplateSystemModel()
				break
			case this.TEMPLATE_TYPE_ENTITY:
				Model = this.getTemplateEntityModel()
				break
		}

		if( form.isValid() ){
			content.id = this.application.generateFileIdFromObject( content ) + '.json'
			var model = Model.create( content )
			model.save({
				success: function( result ) {
					Ext.Msg.alert('Success', 'Your Template "' + result.get( 'templateId' ) + '" has been created.')
					this.refreshStores()

					window.close()
				},
				scope: this
			})
		}
    },

    loadTemplateStores: function( callback, force ) {
		var finished = 0,
			stores   = [
				'template.Entities',
				'template.Components',
				'template.Systems'
			],
			called   = function() {
				if( ++finished >= stores.length && !!callback ) callback()
			}

		Ext.each(
			stores,
			function( storeName ) {
				Ext.getStore( storeName ).load( { callback: called, scope: this } )
			}
		)
    },

    refreshStores: function() {
        this.loadTemplateStores()
    }
});
