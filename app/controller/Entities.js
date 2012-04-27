Ext.define('Spelled.controller.Entities', {
    extend: 'Ext.app.Controller',

    models: [
        'config.Entity'
    ],

    stores: [
       'EntitiesTree',
       'config.Entities'
    ],

    views: [
        'entity.TreeList'
    ],

    init: function() {
        this.control({
            '#EntityList': {
                itemclick : this.handleEntityClick
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
       if( entity.data.leaf === true ) return

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

    handleEntityClick: function( treePanel, record ) {
        if( !record.data.leaf ) {
            this.getConfig( treePanel, record )
        } else {
            this.getComponentConfig( record )
        }
    },

    getConfig:  function( treePanel, record ) {
        if( record.data.leaf ) return

        console.log( "Maybe show a assets list?" )
    },

    getComponentConfig: function( record ) {
        if( !record.data.leaf ) return

        var component = Ext.getStore('config.Components').getById( record.internalId )

        if( component ) {
            var componentsController = this.application.getController('Spelled.controller.Components')
            componentsController.showConfig( component )
        }
    },

    showEntitylist: function( entities ) {

        var children = []
        Ext.each( entities.data.items, function( entity ) {
            var componentsAsChildren = []

            var configuration = entity.getComponents()
            Ext.each( configuration.data.items, function( component ) {

                componentsAsChildren.push( {
                        text         : component.get('blueprintId'),
                        leaf         : true,
                        id           : component.getId()
                    }
                )
            })

            children.push( {
                text      : entity.get('name'),
                id        : entity.getId(),
                leaf      : ( entities.data.items.length === 0 ) ? true : false,
                children  : componentsAsChildren
            } )
        })

        var rootNode = {
            text: "Entities",
            expanded: true,
            children: children
        };

        var entitiesPanel = Ext.ComponentManager.get( "EntityList" )
        entitiesPanel.getStore().setRootNode( rootNode )
    }
});