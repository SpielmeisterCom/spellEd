Ext.define('Spelled.controller.Zones', {
    extend: 'Ext.app.Controller',

    stores: [
       'Zones'
    ],

//    models: [
//        'Zone'
//    ],

    views: [
        'zone.TreeList'
    ],

    init: function() {
        this.control({
            '#ZonesTree': {
                render: this.onPanelRendered,
                itemdblclick: this.editZone
            }
        });
    },

    editZone: function( treePanel, record ) {

        console.log('Double clicked on ' + record.get('name'));
    },

    onPanelRendered: function() {
        console.log('The panel was rendered');
    }
});