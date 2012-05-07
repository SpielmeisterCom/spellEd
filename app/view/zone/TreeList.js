Ext.define('Spelled.view.zone.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.zonetreelist',

    animate: false,
    animCollapse: false,
    title : 'All Zones',
    store : 'ZonesTree',

    tbar: [
        {
            text: "Create",
            action: "showCreateZone",
            tooltip: {
                text:'Create a new Zone',
                title:'Create'
            }
        }
    ]
});