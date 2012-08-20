Ext.define('Spelled.view.scene.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scenetreelist',

    animate: false,
    animCollapse: false,
    store : 'ScenesTree',

    rootVisible: false,

	toggleOnDblClick: false,

	plugins:[
		Ext.create('Ext.grid.plugin.CellEditing', {
			triggerEvent: 'celldblclick'
		})
	],

    tbar: [
        {
            text: "Add new scene",
            action: "showCreateScene",
	        icon: 'images/icons/scene-add.png'
        }
	]
});
