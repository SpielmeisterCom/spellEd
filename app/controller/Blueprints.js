Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator',
        'blueprint.component.TreeList',
        'blueprint.component.Edit',
        'blueprint.component.Details',
        'blueprint.component.Attributes',
        'blueprint.component.Property',
        'blueprint.entity.TreeList'
    ],

    models: [
        'blueprint.Component',
        'blueprint.ComponentAttribute',
        'blueprint.Entity'
    ],

    stores: [
        'EntitiesBlueprintTree',
        'ComponentsBlueprintTree',
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
            '#EntitiesBlueprintTree': {
                itemdblclick: this.openEntityBlueprint
            },
            'componentblueprintattributeslist': {
                select: this.showAttributeConfig
            },
            '#ComponentsBlueprintTree': {
                itemdblclick: this.openComponentBlueprint
            }
        })
    },

    showAttributeConfig: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var component = Ext.getStore('blueprint.ComponentAttributes').getById( record.internalId )

        if( component ) {

            var propertyView = Ext.getCmp("BlueprintEditor").getActiveTab().down( 'componentblueprintproperty' )
            propertyView.getForm().loadRecord( component )
        }
    },

    openEntityBlueprint: function( treePanel, record ) {
        if( !record.data.leaf ) return

        console.log("show Entity blueprint")
    },

    openComponentBlueprint: function( treePanel, record ) {
        if( !record.data.leaf ) return

        var blueprintEditor = Ext.getCmp("BlueprintEditor")

        var ComponentBlueprint = this.getBlueprintComponentModel()

        ComponentBlueprint.load( record.data.id, {
            success: function( componentBlueprint ) {
                var panels = blueprintEditor.items.items
                var title = componentBlueprint.getFullName()

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
            }
        })

    },

    showBlueprintEditor : function( ) {
        var mainPanel = this.getMainPanel()

        Ext.each( mainPanel.items.items, function( panel ) {
            panel.hide()
        })

        Ext.getCmp('BlueprintEditor').show()
    }
});