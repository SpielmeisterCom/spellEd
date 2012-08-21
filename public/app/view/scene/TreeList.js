Ext.define('Spelled.view.scene.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scenetreelist',

	title: "Scene - Navigator",
	header: false,

    animate: false,
    animCollapse: false,
    store : 'ScenesTree',

    rootVisible: false,

    tbar: [
        {
            text: "Add new scene",
            action: "showCreateScene",
	        icon: 'images/icons/scene-add.png'
        }
	],

	initComponent: function() {
		var me = this,
			cellEditor = Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 4,
				pluginId:'renameEntityPlugin'
			})

		Ext.applyIf( me, {
				plugins:[
					cellEditor
				],
				listeners: {
					afterrender: function() {
						cellEditor.removeManagedListener( cellEditor.view, 'celldblclick' )
					}
				}
			}
		)

		me.callParent()
	}
});
