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
        'blueprint.entity.Components'
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

        var component = Ext.getStore('blueprint.ComponentAttributes').getById( record.internalId )

        if( component ) {

            var propertyView = Ext.getCmp("BlueprintEditor").getActiveTab().down( 'componentblueprintproperty' )
            propertyView.getForm().loadRecord( component )
        }
    },

    openEntityBlueprint: function( entityBlueprint ) {
        var blueprintEditor = Ext.getCmp("BlueprintEditor"),
            panels          = blueprintEditor.items.items,
            title           = entityBlueprint.getFullName()

        //looking for hidden tabs. returning if we found one
        for( var key in panels  ) {
            if( panels[ key ].title === title ) {
                return blueprintEditor.setActiveTab( panels[ key ] )
            }
        }

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

            var store = Ext.getStore( 'blueprint.Components' )
            var componentBlueprint = store.getByBlueprintId( component.get('blueprintId') )

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


        var editBlueprint  = blueprintEditor.add(
            editView
        )
        blueprintEditor.setActiveTab( editBlueprint )
    },

    openComponentBlueprint: function( componentBlueprint ) {
        var blueprintEditor = Ext.getCmp("BlueprintEditor"),
            panels          = blueprintEditor.items.items,
            title           = componentBlueprint.getFullName()

        //looking for hidden tabs. returning if we found one
        for( var key in panels  ) {
            if( panels[ key ].title === title ) {
                return blueprintEditor.setActiveTab( panels[ key ] )
            }
        }

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


        var editBlueprint  = blueprintEditor.add(
            editView
        )
        blueprintEditor.setActiveTab( editBlueprint )

    },

    showBlueprintEditor : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        Ext.getCmp('BlueprintEditor').show()
    }
});