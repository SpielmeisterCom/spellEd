Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',

    stores: [
       'EntitiesTree'
    ],

    models: [
        'Entity'
    ],

    views: [
        'entity.TreeList'
    ],

    init: function() {
        this.control({
            '#EntityList': {
                itemclick: this.showConfig
            }
        })
    },

    showConfig:  function( treePanel, record ) {
        console.log( "clicked on" )
        console.log( record )
    },

    showEntitylist: function( entities ) {

        var children = []
        Ext.each( entities, function( entity, index ) {

            var componentsAsChildren = []
            Ext.each( entity.get('components'), function( component ) {
                componentsAsChildren.push( {
                        text         : component.get('name'),
                        leaf         : true,
                        id           : component.id
                    }
                )
            })

            children.push( {
                text      : entity.get('name'),
                id        : entity.id,
                leaf      : ( entity.get('components').length === 0 ) ? true : false,
                children  : componentsAsChildren
            } )
        })

        var rootNode = {
            text: "Entities",
            expanded: true,
            children: [
                {
                    text    : 'Entities',
                    expanded  : true,
                    children: children
                },
                {
                    text    : 'Assets',
                    leaf    : true
                },
                {
                    text    : 'Scripts',
                    leaf    : true
                }
            ]
        };

        var entitiesPanel = Ext.ComponentManager.get( "EntityList" )
        entitiesPanel.getStore().setRootNode( rootNode )
    }
});