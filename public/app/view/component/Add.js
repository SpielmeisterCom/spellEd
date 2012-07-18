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
			xtype: 'treepanel',
			title: 'Available Components',
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