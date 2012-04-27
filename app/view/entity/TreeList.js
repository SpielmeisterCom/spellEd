Ext.define('Spelled.view.entity.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entiteslist',
    animate: false,
    animCollapse: false,

    rootVisible: false,

    title: "Default Entities",
    store: "EntitiesTree",

    columns: [
        {
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Name',
            sortable: false,
            menuDisabled: true,
            flex: 2,
            dataIndex: 'text'
        },
        {
            xtype: 'actioncolumn',
            menuDisabled: true,
            sortable: false,
            flex: 1,
            items: [{
                icon: '/images/icons/add.png',
                tooltip: 'New',
                iconCls: 'act-create'
            },{
                icon: '/images/icons/cog_edit.png',
                tooltip: 'Edit',
                iconCls: 'act-edit'
            },{
                icon: '/images/icons/delete.png',
                tooltip: 'Delete',
                iconCls: 'act-delete'
            }]
        }
    ]
});