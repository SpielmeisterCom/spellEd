Ext.define('Spelled.abstract.view.TreeList' ,{
    extend: 'Ext.tree.Panel',

    animate: false,
    animCollapse: false,

    hideHeaders: true,

    initComponent: function() {
        var me = this;

        me.columns = [
            {
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1
            },
            {
                xtype: 'actioncolumn',
                width: 30,
                icon: 'images/icons/wrench-arrow.png',
                iconCls: 'x-hidden edit-action-icon',
                tooltip: 'Edit',
                handler: Ext.bind(me.handleEditClick, me)
            }
        ];

        me.addEvents(
			'editclick'
        )

        me.callParent( arguments )
    },

	handleEditClick: function(gridView, rowIndex, colIndex, column, e, node) {
		this.getSelectionModel().select( node )
		this.fireEvent('editclick', gridView, rowIndex, colIndex, column, e);
    }
});


