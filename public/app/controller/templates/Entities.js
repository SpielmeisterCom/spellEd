Ext.define('Spelled.controller.templates.Entities', {
    extend: 'Ext.app.Controller',

    views: [
        'template.entity.Edit',
        'template.entity.Details',
        'template.entity.Components',
        'template.entity.Property',
        'template.entity.components.Add'
    ],

    models: [
        'template.Entity'
    ],

    stores: [
        'template.Entities'
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
            'entitytemplateproperty button[action="save"]' : {
                click: this.saveEntityTemplate
            },
            'entitytemplateproperty button[action="reset"]' : {
                click: this.resetTemplate
            },
            'entitytemplateproperty > field' : {
                change: function() {
                    console.log("change!")
                }
            },
            'entitytemplatecomponentslist': {
                select:          this.showEntityAttributeConfig,
                editclick:       this.showComponentsListContextMenu,
                itemcontextmenu: this.showComponentsListContextMenu,
                itemmouseenter:  this.application.showActionsOnFolder,
                itemmouseleave:  this.application.hideActions
            },
            'entitytemplatecomponentslist [action="showAddComponent"]' : {
                click: this.showAddComponent
            },
            'addcomponenttotemplate button[action="addComponent"]' : {
                click: this.addComponent
            }
        })
    },

    showComponentsListContextMenu: function( view, record, item, index, e, options ) {
        var menuController = this.application.getController('Menu')
        menuController.showEntityTemplateComponentsListContextMenu( e )
    },

    removeEntityTemplate: function( id ) {
        var EntityTemplate = this.getTemplateEntityModel()

        EntityTemplate.load( id, {
            scope: this,
            success: this.application.getController('Templates').removeTemplateCallback
        })
    },

    saveEntityTemplate: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues(),
            ownerModel = this.getTemplateEditor().getActiveTab().template

        if( record ) {
            var componentTemplate = Ext.getStore( 'template.Components').getById( record.get('spelled.model.template.component_id') )

            var componentConfig = {
                templateId: componentTemplate.getFullName(),
                config: componentTemplate.mergeComponentConfig( values )
            }

            //Set the new configuration on the specified component
            ownerModel.getComponents().each(
                function( component ) {
                    if( component.get('templateId') === componentConfig.templateId ) {
                        component.set('config', componentConfig.config )
                    }
                }
            )

        }

        if( !!ownerModel ) {
            ownerModel.save( )
            this.application.getController('Templates').refreshTemplateStores()
        }

    },

    resetTemplate: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues()

        console.log( "Reset Template" )
    },

    removeEntityComponent: function( id ) {
        var tab                = this.getTemplateEditor().getActiveTab(),
            entityTemplate    = tab.template,
            store              = Ext.getStore( 'config.Components' ),
            component          = store.getById( id )

        entityTemplate.getComponents().remove( component )
        store.remove( component )

        this.refreshEntityTemplateComponentsList( tab )
    },

    showEntityAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('template.ComponentAttributes').getById( record.getId() )

        if( attribute ) {

            var component = Ext.getStore('config.Components').getById( record.parentNode.getId() )

            var config = component.get('config')
            if( config[ attribute.get('name') ] ) {
                attribute.set('default', config[ attribute.get('name') ])
            }

            var view = this.getTemplateEditor().getActiveTab().down( 'entitytemplateproperty' )
            this.application.getController('templates.Components').fillAttributeConfigView( view, attribute )
        }
    },

    openTemplate: function( entityTemplate ) {
        var templateEditor = this.getTemplateEditor()

        var editView = Ext.create( 'Spelled.view.template.entity.Edit',  {
                title: entityTemplate.getFullName(),
                template : entityTemplate
            }
        )

        var form = editView.down( 'entitytemplatedetails' )
        form.loadRecord( entityTemplate )
        form.getForm().setValues( { tmpName: entityTemplate.getFullName() } )

        var tab = this.application.createTab( templateEditor, editView )

        this.refreshEntityTemplateComponentsList( tab )
    },

    refreshEntityTemplateComponentsList: function( tab ) {
        var entityTemplate = tab.template,
            componentsView  = tab.down( 'entitytemplatecomponentslist' )

        var rootNode = componentsView.getStore().setRootNode( {
                text: entityTemplate.getFullName(),
                expanded: true
            }
        )

        this.appendComponentsAttributesOnTreeNode( rootNode, entityTemplate.getComponents() )
    },

    addComponent: function( button ) {
        var window    = button.up('window'),
            tree      = window.down('treepanel'),
            records   = tree.getView().getChecked(),
            tab       = this.getTemplateEditor().getActiveTab(),
            componentTemplateStore = Ext.getStore('template.Components'),
            entityTemplate         = tab.template

        Ext.each(
            records,
            function( record ) {

                var componentTemplate = componentTemplateStore.getById( record.get('id') )

                if( componentTemplate ) {
                    var configComponent = Ext.create( 'Spelled.model.config.Component', {
                        templateId : componentTemplate.getFullName()
                    })

                    entityTemplate.getComponents().add( configComponent )
                }
            }
        )

        this.refreshEntityTemplateComponentsList( tab )
        window.close()
    },

    showAddComponent: function( ) {
        var View = this.getTemplateEntityComponentsAddView(),
            view = new View(),
            entityTemplate          = this.getTemplateEditor().getActiveTab().template,
            availableComponentsView = view.down( 'treepanel' ),
            templateComponentsStore = Ext.getStore( 'template.Components' )


        var rootNode = availableComponentsView.getStore().setRootNode( {
                text: 'Components',
                expanded: true
            }
        )

        var notAssignedComponents = Ext.create( 'Ext.util.MixedCollection' )

        templateComponentsStore.each(
            function( record ) {
                var found = entityTemplate.getComponents().find( 'templateId', record.getFullName() )

                if( found === -1 ) {
                    notAssignedComponents.add( record )
                }
            }
        )

        this.appendComponentsAttributesOnTreeNode( rootNode, notAssignedComponents )

        rootNode.eachChild(
            function( node ) {
                node.set('checked', false)
            }
        )
        view.show()
    },

    appendComponentsAttributesOnTreeNode: function( node, components ) {

        components.each(
            function( component ) {

                var componentTemplate = ( !component.get('templateId') ) ?
                    component :
                    Ext.getStore( 'template.Components' ).getByTemplateId( component.get('templateId') )

                if( componentTemplate ) {
                    var newNode = node.createNode ( {
                        text      : componentTemplate.getFullName(),
                        id        : component.getId(),
                        expanded  : true,
                        leaf      : false
                    } )

                    componentTemplate.appendOnTreeNode( newNode )

                    node.appendChild( newNode )
                }
            }
        )

        return node
    }
});
