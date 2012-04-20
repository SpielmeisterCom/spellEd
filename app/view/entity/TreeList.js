Ext.define('Spelled.view.entity.TreeList' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.entiteslist',
    animate: false,
    animCollapse: false,

    rootVisible: false,

    title: "Assets & Entities",
    store: "EntitiesTree",

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
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                alert("Edit " + rec.get('name'));
            }
        },{
            icon: '/images/icons/cog_edit.png',
            tooltip: 'Edit',
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                alert("Edit " + rec.get('name'));
            }
        },{
            icon: '/images/icons/delete.png',
            tooltip: 'Delete',
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                alert("Terminate " + rec.get('name'));
            }
        }]

    }]
});