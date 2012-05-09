Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator',
        'blueprint.TreeList',
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
        'blueprint.ComponentAttributes'
    ],

    refs: [
        {
            ref : 'MainPanel',
            selector: '#MainPanel'
        }
    ],

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
                select: this.showAttributeConfig
            },
            'blueprintstreelist': {
                itemdblclick: this.openBlueprint
            }
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
            config: {}
        }

        //Overwrite only the submitted attribute
        Ext.each(
            componentBlueprint.getAttributes().data.items,
            function( attribute ) {
                //TODO: Converting types and only insert keys and changes
                if( values.default != attribute.get('default') ) {
                    componentConfig.config[ attribute.get('name') ] = ( attribute.get('name') === values.name ) ? values.default : attribute.get('default')
                }
            }
        )

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

        if( record.get('cls') === "componentBlueprint" ) {
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

        var attribute = Ext.getStore('blueprint.ComponentAttributes').getById( record.internalId )

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

        var children = []

        Ext.each( entityBlueprint.getComponents().data.items, function( component ) {

            var componentBlueprint = Ext.getStore( 'blueprint.Components' ).getByBlueprintId( component.get('blueprintId') )

            //TODO: merge config of entitycomponents with blueprints components
            var attributes = []
            Ext.each( componentBlueprint.getAttributes().data.items, function( attribute ) {
                attributes.push( {
                    text      : attribute.get('name'),
                    id        : attribute.getId(),
                    expanded  : true,
                    leaf      : true
                } )
            })

            children.push( {
                text      : component.get('blueprintId'),
                children  : attributes,
                id        : component.getId(),
                expanded  : true,
                leaf      : false
            } )
        })

        var rootNode = {
            text: entityBlueprint.getFullName(),
            expanded: true,
            children: children
        }

        components.getStore().setRootNode( rootNode )

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

        var children = []
        Ext.each( componentBlueprint.getAttributes().data.items, function( attribute ) {
            children.push( {
                text      : attribute.get('name'),
                id        : attribute.getId(),
                expanded  : true,
                leaf      : true
            } )
        })

        var rootNode = {
            text: componentBlueprint.getFullName(),
            expanded: true,
            children: children
        }

        attributes.getStore().setRootNode( rootNode )

        var tab = this.application.createTab( blueprintEditor, editView )
        tab.blueprint = componentBlueprint
    },

    showBlueprintEditor : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        Ext.getCmp('BlueprintEditor').show()
    }
});