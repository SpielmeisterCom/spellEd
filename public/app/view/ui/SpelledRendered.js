Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.renderedzone',
    closable: true,

	tbar: [
		{
			text: "Reload",
			action: "reloadZone",
			tooltip: {
				text:'Reload and Render Zone',
				title:'Reload'
			}
		},
		{
			text: "Save",
			action: "saveZone",
			tooltip: {
				text:'Saves settings as default configuration',
				title:'Save'
			}
		},
		{
			iconCls: 'play',
			action: "toggleState",
			enableToggle: true,
			pressed: true,
			tooltip: {
				text:'Run or Hold the Spelled Tab',
				title:'Run & Hold'
			}
		}
	]
});