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
					text:'Reload and Render Scene',
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
			}
		]

		me.callParent( arguments )
	}
});
