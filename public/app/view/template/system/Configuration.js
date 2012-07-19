Ext.define('Spelled.view.template.system.Configuration', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.systemtemplateconfiguration',

	layout: {
		align: 'stretch',
		padding: 5,
		type: 'vbox'
	},
	title: 'Configuration',
	items: [
		{
			xtype: "systemtemplatedetails",
			flex: 1
		},
		{
			xtype: 'systemtemplateinputlist',
			flex: 2
		}
	],
	buttons: [
		{
			text: 'Save',
			action: 'saveTemplate'
		},
		{
			text: 'Cancel',
			action: 'resetTemplate'
		}
	]

});
