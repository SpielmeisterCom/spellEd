Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.renderedscene',
    closable: false,

	initComponent: function() {
		var me = this

		me.tbar = [
			{
				iconCls: 'reload-icon',
				action: "reloadScene",
				tooltip: {
					text:'Reload and render scene (CTRL+R/CMD+R)',
					title:'Reload'
				}
			},
			{
				iconCls: 'fullscreen-icon',
				action: "fullscreen",
				tooltip: {
					text:'Render the current scene in fullscreen',
					title:'Activate Fullscreen (CTRL+F/CMD+F)'
				}
			},
			{
				iconCls: 'grid-icon',
				action: "toggleGrid",
				enableToggle: true,
				tooltip: {
					text: 'Shows the world coordinate grid overlay',
					title: 'Show Grid (CTRL+G/CMD+G)'
				}
			},
			{
				iconCls: 'camera-marker-icon',
				action: 'toggleTitleSafe',
				enableToggle: true,
				tooltip: {
					text: 'Highlights the title safe area of the currently selected camera',
					title: 'Show Title Safe Area (CTRL+C/CMD+C)'
				}
			},
			{
				iconCls: 'development-camera-icon',
				action: 'toggleDevCam',
				enableToggle: true,
				tooltip: {
					text: 'When activated: use mouse-drag to drag the camera and mouse-wheel up/down to zoom in/zoom out. If the scene view lost it\'s focus, left click in the scene to restore the focus.',
					title: 'Activate development camera'
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
			}

		]

		me.callParent( arguments )
	}
})
