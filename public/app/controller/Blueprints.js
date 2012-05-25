Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator',
        'blueprint.TreeList',
        'blueprint.Create',
        'blueprint.FolderPicker',
        'blueprint.component.Edit',
        'blueprint.component.Details',
        'blueprint.component.Attributes',
        'blueprint.component.Property',
        'blueprint.entity.Edit',
        'blueprint.entity.Details',
        'blueprint.entity.Components',
        'blueprint.entity.Property'
    ],

    models: [
        'blueprint.Component',
        'blueprint.ComponentAttribute',
        'blueprint.Entity'
    ],

    stores: [
        'BlueprintsTree',
        'blueprint.ComponentAttributes',
        'blueprint.Components',
        'blueprint.Entities',
        'blueprint.Types',
        'blueprint.FoldersTree'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

    //TODO: Blueprint components get overwritten from entityconfig. strange problem! need to fix ASAP

    init: function() {
        this.control({
            'blueprintsnavigator': {
                activate: this.showBlueprintEditor
            },
            'componentblueprintproperty button[action="save"]' : {
                click: this.saveComponentBlueprint
            },
            'componentblueprintproperty button[action="reset"]' : {
                click: this.resetBlueprint
            },
            'componentblueprintproperty > field' : {
                change: function() {
                    console.log("change!")
                }
            },
            'entityblueprintproperty button[action="save"]' : {
                click: this.saveEntityBlueprint
            },
            'entityblueprintproperty button[action="reset"]' : {
                click: this.resetBlueprint
            },
            'entityblueprintproperty > field' : {
                change: function() {
                    console.log("change!")
                }
            },
            'componentblueprintattributeslist': {
                select: this.showAttributeConfig
            },
            'entityblueprintcomponentslist': {
                select: this.showEntityAttributeConfig
            },
            'blueprintstreelist': {
                itemdblclick: this.openBlueprint
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

    changeBlueprintCreationType: function( combo, records ) {

    },

    showCreateBlueprint: function() {
        var View = this.getBlueprintCreateView()
        var view = new View( )
        view.show()
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

                                this.refreshStores()

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
    },

    saveEntityBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues()

        var ownerModel = Ext.getCmp("BlueprintEditor").getActiveTab().blueprint

        var componentBlueprint = Ext.getStore( 'blueprint.Components').getById( record.get('spelled.model.blueprint.component_id') )

        var componentConfig = {
            blueprintId: componentBlueprint.getFullName(),
            config: componentBlueprint.mergeComponentConfig( values )
        }

        //Set the new configuration on the specified component
        Ext.each(
            ownerModel.getComponents().data.items,
            function( component ) {
                if( component.get('blueprintId') === componentConfig.blueprintId ) {
                    component.set('config', componentConfig.config )
                }
            }
        )

        if( !!ownerModel ) {
            ownerModel.save( )
            this.refreshBlueprintStores()
        }

    },

    saveComponentBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues()

        var ownerModel = Ext.getCmp("BlueprintEditor").getActiveTab().blueprint

        record.set( values )

        if( !!ownerModel ) {
            ownerModel.save( )
            this.refreshBlueprintStores()
        }
    },

    resetBlueprint: function( button, event, record ) {
        var form = button.up('form'),
            record = form.getRecord(),
            values = form.getValues()

        console.log( "Reset Blueprint" )
    },

    openBlueprint: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var me = this

        if( record.get('cls') === Spelled.model.blueprint.Component.BLUEPRINT_TYPE ) {
            var ComponentBlueprint = this.getBlueprintComponentModel()

            ComponentBlueprint.load( record.getId(), {
                success: function( componentBlueprint ) {
                    me.openComponentBlueprint( componentBlueprint )
                }
            })

        } else {
            var EntityBlueprint = this.getBlueprintEntityModel()

            EntityBlueprint.load( record.getId(), {
                success: function( entityBlueprint ) {
                    me.openEntityBlueprint( entityBlueprint )
                }
            })
        }
    },

    showAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('blueprint.ComponentAttributes').getById( record.getId() )

        if( attribute ) {
            this.fillAttributeConfigView( attribute )
        }
    },

    showEntityAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var attribute = Ext.getStore('blueprint.ComponentAttributes').getById( record.getId() )

        if( attribute ) {

            var component = Ext.getStore('config.Components').getById( record.parentNode.getId() )

            var config = component.get('config')
            if( config[ attribute.get('name') ] ) {
                attribute.set('default', config[ attribute.get('name') ])
            }

            this.fillAttributeConfigView( attribute )
        }
    },

    fillAttributeConfigView: function( attribute ) {
        var propertyView = Ext.getCmp("BlueprintEditor").getActiveTab().down( 'form' )
        propertyView.getForm().loadRecord( attribute )
    },

    openEntityBlueprint: function( entityBlueprint ) {
        var blueprintEditor = Ext.getCmp("BlueprintEditor"),
            title           = entityBlueprint.getFullName()

        var foundTab = this.application.findActiveTabByTitle( blueprintEditor, title )

        if( foundTab )
            return blueprintEditor.setActiveTab( foundTab )

        var editView = Ext.create( 'Spelled.view.blueprint.entity.Edit',  {
                title: title
            }
        )

        var header = editView.down( 'entityblueprintdetails' )

        //TODO: find a better solution for setting the details
        header.items.items[0].setValue( entityBlueprint.get('type') )
        header.items.items[1].setValue( entityBlueprint.getFullName() )


        var components = editView.down( 'entityblueprintcomponentslist' )

        var rootNode = components.getStore().setRootNode( {
                text: entityBlueprint.getFullName(),
                expanded: true
            }
        )

        Ext.each( entityBlueprint.getComponents().data.items, function( component ) {

            var node = rootNode.createNode ( {
                text      : component.get('blueprintId'),
                id        : component.getId(),
                expanded  : true,
                leaf      : false
            } )

            var componentBlueprint = Ext.getStore( 'blueprint.Components' ).getByBlueprintId( component.get('blueprintId') )

            //TODO: merge config of entitycomponents with blueprints components
            Ext.each( componentBlueprint.getAttributes().data.items, function( attribute ) {

                node.appendChild(
                    node.createNode( {
                            text      : attribute.get('name'),
                            id        : attribute.getId(),
                            expanded  : true,
                            leaf      : true
                        }
                    )
                )

            })

            rootNode.appendChild(
                node
            )

        })

        var tab = this.application.createTab( blueprintEditor, editView )
        tab.blueprint = entityBlueprint
    },

    openComponentBlueprint: function( componentBlueprint ) {
        var blueprintEditor = Ext.getCmp("BlueprintEditor"),
            title           = componentBlueprint.getFullName()


        var foundTab = this.application.findActiveTabByTitle( blueprintEditor, title )

        if( foundTab )
            return blueprintEditor.setActiveTab( foundTab )

        var editView = Ext.create( 'Spelled.view.blueprint.component.Edit',  {
                title: title
            }
        )

        var header = editView.down( 'componentblueprintdetails' )

        //TODO: find a better solution for setting the details
        header.items.items[0].setValue( componentBlueprint.get('type') )
        header.items.items[1].setValue( componentBlueprint.getFullName() )


        var attributes = editView.down( 'componentblueprintattributeslist' )

        var rootNode = attributes.getStore().setRootNode( {
                text: componentBlueprint.getFullName(),
                expanded: true
            }
        )

        Ext.each( componentBlueprint.getAttributes().data.items, function( attribute ) {
            rootNode.appendChild(
                rootNode.createNode ( {
                    text      : attribute.get('name'),
                    id        : attribute.getId(),
                    expanded  : true,
                    leaf      : true
                } )
            )
        })

        var tab = this.application.createTab( blueprintEditor, editView )
        tab.blueprint = componentBlueprint
    },

    loadTrees: function() {
        var projectName = this.application.getActiveProject().get('name')

        this.getBlueprintsTreeStore().load( {
            params: {
                projectName: projectName
            }
        } )

        this.getBlueprintFoldersTreeStore().load( {
            params: {
                projectName: projectName
            }
        } )
    },

    refreshStores: function() {
        this.loadTrees()

        Ext.getStore( 'blueprint.Components' ).load()
        Ext.getStore( 'blueprint.Entities' ).load()
    },

    showBlueprintEditor : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        this.loadTrees()

        Ext.getCmp('BlueprintEditor').show()

    }
});