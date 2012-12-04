Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.renderedscene',
    closable: false,

	initComponent: function() {
		var me           = this,
			dismissDelay = 1000000 //should be 0, this is a workaround because there is a bug in ext

		me.tbar = [
			{
				iconCls: 'reload-icon',
				action: "reloadScene",
				tooltip: {
					text:'Reload and render scene (CTRL+R/CMD+R)',
					title:'Reload',
					dismissDelay: dismissDelay
				}
			},
			{
				iconCls: 'fullscreen-icon',
				action: "fullscreen",
				tooltip: {
					text:'Render the current scene in fullscreen',
					title:'Activate Fullscreen (CTRL+F/CMD+F)',
					dismissDelay: dismissDelay
				}
			},
			{
				iconCls: 'grid-icon',
				action: "toggleGrid",
				enableToggle: true,
				tooltip: {
					text: 'Shows the world coordinate grid overlay',
					title: 'Show Grid (CTRL+G/CMD+G)',
					dismissDelay: dismissDelay
				}
			},
			{
				iconCls: 'camera-marker-icon',
				action: 'toggleTitleSafe',
				enableToggle: true,
				tooltip: {
					text: 'Highlights the title safe area of the currently selected camera',
					title: 'Show Title Safe Area (CTRL+C/CMD+C)',
					dismissDelay: dismissDelay
				}
			},
			{
				iconCls: 'pause-icon',
				action: "toggleEdit",
				enableToggle: true,
				tooltip: {
					text: 'Pauses the scene for editing',
					title: 'Pause',
					dismissDelay: dismissDelay
				}
			},
			{
				iconCls: 'edit-icon',
				action: 'toggleDevCam',
				enableToggle: true,
				tooltip: {
					text: 'When activated the following input bindings will be available:<ul>'
					+ '<li><strong>right-mouse-drag</strong> to drag the camera</li>'
					+ '<li><strong>mouse-wheel up/down</strong> to zoom in/zoom out</li>'
					+ '<li><strong>left-mouse-click</strong> to select entity</li>'
					+ '<li><strong>tab key</strong> to toggle between differenct entities that matches for the cursorposition</li>'
					+ '<li><strong>left-mouse-drag</strong> to move an entity</li>'
					+ '<li><strong>crtl + left-mouse-drag</strong> to clone and move an entity</li>'
					+ '<li><strong>delete or backspace key</strong> to remove the selected entity</li>'
					+ '</ul><strong>If the scene view lost it\'s focus, left click in the scene to restore the focus.</strong>',
					title: 'Activate development mode',
					dismissDelay: dismissDelay
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
