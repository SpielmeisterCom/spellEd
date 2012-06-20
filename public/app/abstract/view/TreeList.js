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
				width: 24,
				icon: 'images/icons/application_go.png',
				iconCls: 'x-hidden render-action-icon',
				tooltip: 'Render',
				handler: Ext.bind(me.handleRenderClick, me)
			},
            {
                xtype: 'actioncolumn',
                width: 24,
                icon: 'images/icons/cog.png',
                iconCls: 'x-hidden edit-action-icon',
                tooltip: 'Edit',
                handler: Ext.bind(me.handleEditClick, me)
            },
			{
				xtype: 'actioncolumn',
				width: 24,
				icon: 'images/icons/add.png',
				iconCls: 'x-hidden add-action-icon',
				tooltip: 'Add',
				handler: Ext.bind(me.handleAddClick, me)
			},
			{
				xtype: 'actioncolumn',
				width: 24,
				icon: 'images/icons/delete.png',
				iconCls: 'x-hidden delete-action-icon',
				tooltip: 'Delete',
				handler: Ext.bind(me.handleDeleteClick, me)
			}
        ];

        me.addEvents(
            'deleteclick',
			'addclick',
			'renderclick',
			'editclick'
        )

        me.callParent(arguments);
    },

	handleAddClick: function(gridView, rowIndex, colIndex, column, e) {
		this.fireEvent('addclick', gridView, rowIndex, colIndex, column, e);
	},


	handleEditClick: function(gridView, rowIndex, colIndex, column, e) {
        this.fireEvent('editclick', gridView, rowIndex, colIndex, column, e);
    },

	handleDeleteClick: function(gridView, rowIndex, colIndex, column, e) {
		this.fireEvent('deleteclick', gridView, rowIndex, colIndex, column, e);
	},

	handleRenderClick: function(gridView, rowIndex, colIndex, column, e) {
		this.fireEvent('renderclick', gridView, rowIndex, colIndex, column, e);
	}

});


