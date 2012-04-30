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
            flex: 2,
            xtype: 'zonetreelist'
        },
        {
            id: "EntityList",
            flex: 2,
            xtype: 'entiteslist'
        },
        {
            id: "ComponentProperty",
            flex: 1,
            xtype: 'componentproperties'
        }
    ]

});