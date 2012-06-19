Ext.define('Spelled.view.zone.Navigator', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.zonesnavigator',

    title: "Zones",
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    items:[
        {
            id: "ZonesTree",
			flex: 1,
            xtype: 'zonetreelist'
        }
    ]

});