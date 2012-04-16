Ext.define('Spelled.controller.Zones', {
    extend: 'Ext.app.Controller',

    stores: [
       'ZonesTree',
       'Zones'
    ],

    views: [
        'zone.TreeList',
        'zone.Edit'
    ],

    init: function() {
        this.control({
            '#ZonesTree': {
                itemdblclick: this.openZone
            }
        })
    },

    openZone: function( treePanel, record ) {

        var mainPanel = Ext.ComponentManager.get( "MainPanel" )
        var entitiesController = this.application.getController('Spelled.controller.Entities')

        var Zone = Ext.ModelManager.getModel('Spelled.model.Zone')

        Zone.load( record.internalId, {
            success: function( result )   {


                entitiesController.showEntitylist()

                var panels = mainPanel.items.items

                //looking for hidden tabs
                for( var key in panels  ) {
                    if( panels[ key ].title === result.get('name') ) {
                        return mainPanel.setActiveTab( panels[ key ] )
                    }
                }

                var editZone  = mainPanel.add(
                    Ext.create( 'Spelled.view.zone.Edit',  {
                            title: result.get('name'),
                            html:  JSON.stringify( result.get('content') )
                        }
                    )
                )
                mainPanel.setActiveTab( editZone )
            }
        } )

    }
});