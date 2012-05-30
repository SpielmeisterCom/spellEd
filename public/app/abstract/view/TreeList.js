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
                icon: 'images/icons/delete.png',
                iconCls: 'x-hidden',
                tooltip: 'Delete',
                handler: Ext.bind(me.handleDeleteClick, me)
            }
        ];

        me.addEvents(
            /**
             * @event deleteclick
             * Fires when the delete icon is clicked
             * @param {Ext.grid.View} gridView
             * @param {Number} rowIndex
             * @param {Number} colIndex
             * @param {Ext.grid.column.Action} column
             * @param {EventObject} e
             */
            'deleteclick'
        )

        me.callParent(arguments);
    },

    /**
     * Handles a click on a delete icon
     * @private
     * @param {Ext.tree.View} treeView
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * @param {Ext.grid.column.Action} column
     * @param {EventObject} e
     */
    handleDeleteClick: function(gridView, rowIndex, colIndex, column, e) {
        // Fire a "deleteclick" event with all the same args as this handler
        this.fireEvent('deleteclick', gridView, rowIndex, colIndex, column, e);
    }
});


