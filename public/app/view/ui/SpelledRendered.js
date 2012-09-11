Ext.define('Spelled.view.ui.SpelledRendered', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.renderedscene',
    closable: true,

	initComponent: function() {
		var me = this

		var store = Ext.create('Ext.data.Store', {
			fields: ['aspectRatio', 'name'],

			data : [
				{
					"aspectRatio": 1.333333,
					"name":"4:3"
				},
				{
					"aspectRatio": 1.6,
					"name":"16:9"
				},
				{
					"aspectRatio": 1.7,
					"name":"16:10"
				}
			]
		});

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
				id: 'aspectRatioSelector',
				editable: false,
				value: 1.333333,
				xtype: 'combobox',
				store: store,
				displayField: 'name',
				valueField: 'aspectRatio',
				queryMode: 'local',
				triggerAction: 'all',
				selectOnFocus: true,
				iconCls: 'no-icon'
			}
		]

		me.callParent( arguments )
	}
});
