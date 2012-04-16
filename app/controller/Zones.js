Ext.define('Spelled.controller.Zones', {
    extend: 'Ext.app.Controller',

    stores: [
       'ZonesTree',
       'Zones'
    ],

    views: [
        'zone.TreeList'
    ],

    init: function() {
        this.control({
            '#ZonesTree': {
                render: this.onPanelRendered,
                itemdblclick: this.openZone
            }
        })
    },

    openZone: function( treePanel, record ) {

        console.log('Double clicked on ')
        console.log( record )

        var Zone = Ext.ModelManager.getModel('Spelled.model.Zone');
        Zone.load( record.internalId, {
            success: function( result )   {
                Ext.ComponentManager.get( "MainPanel" ).add(
                    Ext.create('Spelled.view.ui.SpelledEditor')
                )
                console.log( result )
            }
        })

    },

    onPanelRendered: function() {
        console.log('The panel was rendered')
    }
});