Ext.define('Spelled.view.scene.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.scenetreelist',

	requires: ['Spelled.view.scene.plugin.CellEditing'],

    store : 'ScenesTree',

	viewConfig: {
		plugins: {
			ptype: 'scenetreedragdrop'
		}
	},

    rootVisible: false,

    tbar: [
        {
            text: "Add new scene",
            action: "showCreateScene",
	        icon: 'images/icons/scene-add.png'
        }
	],

	initComponent: function() {
		var me         = this,
			cellEditor = Ext.create( 'Spelled.view.scene.plugin.CellEditing' )

		Ext.applyIf( me, {
				plugins:[ cellEditor ],
				listeners: {
					afterrender: function() {
						cellEditor.removeManagedListener( cellEditor.view, 'celldblclick' )
					},
					validateedit: function( editor, e ) {
						if( !cellEditor.isConfigEntityCompliant( e.value ) ){
							Ext.MessageBox.alert( 'Error', "Usage of invalid characters. No: '.' or '/' allowed" )
							return false
						}
					}
				}
			}
		)

		me.callParent()
	}
});
