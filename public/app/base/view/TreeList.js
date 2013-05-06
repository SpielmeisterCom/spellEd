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
					xtype: 'spelledactioncolumn',
					iconCls: 'x-hidden edit-action-icon'
				}
			]
		})


        me.callParent()
    }
});


