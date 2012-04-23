Ext.define('Spelled.view.zone.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.zonetreelist',

    animate: false,
    animCollapse: false,
    title : 'All Zones',
    store : 'ZonesTree',

    columns: [{
        xtype: 'treecolumn', //this is so we know which column will show the tree
        text: 'Name',
        sortable: false,
        menuDisabled: true,
        flex: 2,
        dataIndex: 'text'
    },{
        xtype: 'actioncolumn',
        menuDisabled: true,
        sortable: false,
        flex: 1,
        items: [{
            icon: '/images/icons/add.png',
            tooltip: 'New',
            iconCls: 'act-newZone'
        },{
            icon: '/images/icons/cog_edit.png',
            tooltip: 'Edit',
            iconCls: 'act-editZone'
        },{
            icon: '/images/icons/delete.png',
            tooltip: 'Delete',
            iconCls: 'act-deleteZone'
        }]

    }]
});