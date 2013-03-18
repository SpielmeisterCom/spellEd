Ext.define('Spelled.base.view.TreeList' ,{
    extend: 'Ext.tree.Panel',
	requires: [
		'widget.treecolumn',
		'widget.actioncolumn'
	],
    animate: false,
    animCollapse: false,

    hideHeaders: true,

	initComponent: function() {
		var me = this

		Ext.applyIf( me, {
			columns : [
				{
					xtype: 'treecolumn',
					dataIndex: 'text',
					flex: 1,
					editor:{
						xtype:'textfield'
					}
				},
				{
					xtype: 'actioncolumn',
					width: 30,
					icon: 'resources/images/icons/wrench-arrow.png',
					iconCls: 'x-hidden edit-action-icon',
					handler: Ext.bind(me.handleEditClick, me)
				}
			]
		})


        me.addEvents(
			'editclick'
        )

        me.callParent()
    },

	handleEditClick: function(gridView, rowIndex, colIndex, column, e, node) {
		this.getSelectionModel().select( node )
		this.fireEvent('editclick', gridView, rowIndex, colIndex, column, e);
    }
});


