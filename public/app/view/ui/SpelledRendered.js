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
					text: 'Shows the world coordinate grid overlay',
					title: 'Show Grid'
				}
			},
			{
				iconCls: 'fullscreen-icon',
				action: "fullscreen",
				tooltip: {
					text:'Render the current scene in fullscreen',
					title:'Fullscreen'
				}
			},
			{
				name: 'aspectRatioSelector',
				width: 400,
				editable: false,
				value: 0,
				xtype: 'combobox',
				store: 'AspectRatios',
				displayField: 'name',
				valueField: 'aspectRatio',
				queryMode: 'local',
				triggerAction: 'all',
				iconCls: 'no-icon'
			},
			{
				iconCls: 'camera-marker-icon',
				action: 'toggleTitleSafe',
				enableToggle: true,
				pressed: me.showTitleSafe,
				tooltip: {
					text: 'Highlights the title safe area of the currently selected camera',
					title: 'Show Title Safe Area'
				}
			}
		]

		me.callParent( arguments )
	}
});
