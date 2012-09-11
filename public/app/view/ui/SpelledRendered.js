Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.renderedscene',
    closable: true,

	initComponent: function() {
		var me = this

		me.tbar = [
			{
				iconCls: 'reload-icon',
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
			},{
				name: 'aspectRatioSelector',
				editable: false,
				value: 0,
				xtype: 'combobox',
				store: 'AspectRatios',
				displayField: 'name',
				valueField: 'aspectRatio',
				queryMode: 'local',
				triggerAction: 'all',
				iconCls: 'no-icon'
			}
		]

		me.callParent( arguments )
	}
});
