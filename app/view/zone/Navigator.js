Ext.define('Spelled.view.zone.Navigator', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.zonesnavigator',

    title: "Zones",
    items:[
        {
            id: "ZonesTree",
            xtype: 'zonetreelist',
            height: 200
        },
        {
            id: "EntityList",
            xtype: 'entiteslist',
            height: 200
        },
        {
            id: "ComponentProperty",
            xtype: 'componentproperties'
        }
    ]

});