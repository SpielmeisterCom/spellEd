Ext.define('Spelled.controller.Blueprints', {
    extend: 'Ext.app.Controller',

    views: [
        'blueprint.Editor',
        'blueprint.Navigator',
        'blueprint.component.TreeList',
        'blueprint.component.Edit',
        'blueprint.component.Details',
        'blueprint.component.Attributes',
        'blueprint.entity.TreeList'
    ],

    models: [
        'blueprint.Component',
        'blueprint.Entity'
    ],

    stores: [
        'EntitiesBlueprintTree',
        'ComponentsBlueprintTree'
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
               itemclick: this.showAttributeConfig
            },
            '#ComponentsBlueprintTree': {
                itemclick: this.openComponentBlueprint
            }
        })
    },

    showAttributeConfig: function( treePanel, record ) {
        console.log( "show attribute")


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

                header.items.items[0].setValue( componentBlueprint.get('type') )
                header.items.items[1].setValue( componentBlueprint.getFullName() )


                var attributes = editView.down( 'componentblueprintattributeslist' )

                var children = []
                Ext.each( componentBlueprint.get('attributes'), function( attribute ) {
                    children.push( {
                        text      : attribute.name,
                        id        : attribute.name,
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