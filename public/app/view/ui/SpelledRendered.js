Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.renderedscene',
    closable: true,

	initComponent: function() {
		var me = this

		me.tbar = [
			{
				text: "Reload",
				action: "reloadScene",
				tooltip: {
					text:'Reload and render scene (shortcut CTRL+R/CMD+R)',
					title:'Reload'
				}
			},
			{
				iconCls: 'grid-icon',
				action: "toggleGrid",
				enableToggle: true,
				pressed: me.showGrid,
				tooltip: {
					text:'Render the SpellJS Grid on the Canvas',
					title:'Show Grid'
				}
			},
			{
				iconCls: 'fullscreen-icon',
				action: "fullscreen",
				tooltip: {
					text:'Render the current scene in fullscreen',
					title:'Fullscreen'
				}
			}
		]

		me.callParent( arguments )
	}
});
