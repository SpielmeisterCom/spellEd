Ext.define('Spelled.view.entity.ComponentsList' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.entitycomponentslist',

	padding: '5px',

	border: false,

	autoScroll: true,

	buttonAlign:'left',

	buttons: [
		{
			xtype: 'button',
			text: 'Add new Component',
			action: 'showAddComponent'
		}
	]
});