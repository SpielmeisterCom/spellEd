Ext.define('Spelled.view.template.system.Configuration', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.systemtemplateconfiguration',

	layout: {
		align: 'stretch',
		padding: 5,
		type: 'vbox'
	},
	items: [
		{
			xtype: "systemtemplatedetails",
			hidden: true,
			flex: 1
		},
		{
			xtype: 'systemtemplateinputlist',
			flex: 2
		}
	]
});
