Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.renderedscene',
    closable: true,

	tbar: [
		{
			text: "Reload",
			action: "reloadScene",
			tooltip: {
				text:'Reload and Render Scene',
				title:'Reload'
			}
		}
//		,{
//			text: "Save",
//			action: "saveScene",
//			tooltip: {
//				text:'Saves settings as default configuration',
//				title:'Save'
//			}
//		},
//		{
//			iconCls: 'play',
//			action: "toggleState",
//			enableToggle: true,
//			pressed: true,
//			tooltip: {
//				text:'Run or Hold the Spelled Tab',
//				title:'Run & Hold'
//			}
//		}
	]
});
