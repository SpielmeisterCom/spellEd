Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',

    models: [
        'Entity'
    ],

    stores: [
       'EntitiesTree',
       'Entities'
    ],

    views: [
        'entity.TreeList'
    ],

    init: function() {
        this.control({
            '#EntityList': {
                itemdblclick: this.showConfig
            },
            '#EntityList actioncolumn': {
                click: this.handleActionColumnClick
            }
        })
    },

    handleActionColumnClick: function( view, cell, rowIndex, colIndex, e ) {
        var m = e.getTarget().className.match(/\bact-(\w+)\b/)
        if (m === null || m === undefined) {
            return
        }

        var entity = view.store.data.items[ rowIndex ]
       if( entity.data.leaf === false ) return

        var action = m[1];
        switch ( action ) {
            case 'create':
                this.createEntity( entity )
                break;
            case 'delete':
                this.deleteEntity( entity )
                break;
            case 'edit':
                this.editEntity( entity )
                break;
        }

    },

    createEntity: function ( entity ) {
        console.log( "Create"  )
        console.log( entity )
    },

    deleteEntity: function ( entity ) {
        console.log( "deleteEntity"  )
        console.log( entity )
    },

    editEntity: function ( entity ) {
        console.log( "editEntity"  )
        console.log( entity )
    },

    showConfig:  function( treePanel, record ) {
        if( !record.data.leaf ) return

        var mainPanel = Ext.ComponentManager.get( "MainPanel" )

        var title = record.internalId

        var spellEditTab = Ext.create( 'Spelled.view.ui.SpelledEditor', {
                title: title,
                html:  JSON.stringify(record.data, null, "\t")
            }
        )

        var editZone  = mainPanel.add(
            spellEditTab
        )


        mainPanel.setActiveTab( editZone )
        console.log( "clicked on" )
        console.log( record )
    },

    showEntitylist: function( entities ) {

        var children = []
        Ext.each( entities.data.items, function( entity ) {
            var componentsAsChildren = []

            var configuration = entity.getComponents()
            Ext.each( configuration.data.items, function( component ) {
                componentsAsChildren.push( {
                        text         : component.getId(),
                        leaf         : true,
                        id           : component.getId()
                    }
                )
            })

            children.push( {
                text      : entity.getId(),
                id        : entity.getId(),
                leaf      : ( entities.data.items.length === 0 ) ? true : false,
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