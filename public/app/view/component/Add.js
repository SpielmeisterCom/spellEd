Ext.define('Spelled.view.component.Add' ,{
	extend: 'Ext.window.Window',
	alias: 'widget.addcomponent',

	title: "Add Components to the Entity",
	modal: true,
	closable: true,

	layout: 'fit',
	width : 550,
	height: 450,

	items: [
		{
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
					hidden: true,
					text: "Component group",
					dataIndex: 'group',
					sortable: true
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