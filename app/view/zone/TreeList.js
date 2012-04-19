Ext.define('Spelled.view.zone.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.zonetreelist',

    animate: false,
    animCollapse: false,
    title : 'All Zones',
    store : 'ZonesTree'
});