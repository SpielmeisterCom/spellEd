Ext.define('Spelled.view.layout.Split', {
    extend: 'Ext.container.Container',
	alias: 'widget.splitlayout',

	layout: {
		type: 'hbox',
		align:'stretch'
	},

	items:[
		{
			id: "SecondTabPanel",
			xtype: "tabpanel",
			columnWidth: 0.5,
			flex:1
		}
	]
})
