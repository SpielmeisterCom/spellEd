Ext.define('Spelled.view.component.Add' ,{
	extend: 'Ext.window.Window',
	alias: 'widget.addcomponent',

	requires: [ 'Ext.grid.feature.Grouping' ],

	title: "Add Components to the Entity",
	modal: true,
	closable: true,

	layout: 'fit',
	width : 550,
	height: 450,

	items: [
		{
			features: [
				{
					ftype:'grouping'
				}
			],
			hideHeaders: true,
			xtype: 'groupedtree',
			title: 'Available Components',
			singleExpand: true,
			columns: [
				{
					xtype: 'treecolumn',
					flex: 1,
					sortable: false,
					dataIndex: 'text'
				},
				{
					xtype: 'templatecolumn',
					hidden: true,
					text: "Component group",
					tpl: '({group})',
					dataIndex: 'group',
					sortable: false
				}
			],
			rootVisible: false
		}
	],

	buttons: [
		{
			text: 'Add',
			action: 'addComponent'
		}
	]

});