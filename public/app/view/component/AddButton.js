Ext.define('Spelled.view.component.AddButton' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.addcomponentbutton',

	cls: 'add-component-border',
	border: false,
	padding: '15px',
	margin: '0 0 5',
	items:[
		{
			align: 'center',
			icon: 'images/icons/component-add.png',
			xtype: "button",
			text: "Add components to this entity",
			action: "showAddComponent"
		}
	]
});