Ext.define('Spelled.view.layout.Main', {
    extend: 'Ext.container.Container',
	alias: 'widget.mainlayout',

	layout: 'fit',
	items:[
		{
			flex:1,
			id: "SceneEditor",
			xtype: "sceneeditor",
			columnWidth: 0.5
		}
	]
})
