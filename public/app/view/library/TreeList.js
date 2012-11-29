Ext.define('Spelled.view.library.TreeList' ,{
    extend: 'Spelled.abstract.view.TreeList',
    alias : 'widget.librarytreelist',

	requires: [
		'Ext.container.ButtonGroup'
	],

    animate: false,
    animCollapse: false,
    store : 'Library',

    rootVisible: false,

	tbar: [
		{
			text: 'Create',
			icon: 'images/icons/add.png',
			menu: { xtype: 'librarymenu' }
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
						if( !cellEditor.isJavaScriptCompliant( e.value ) ){
							Ext.MessageBox.alert( 'Error', "Usage of invalid characters. No: '.' or '/' allowed" )
							return false
						}
					}
				}
			}
		)

		me.callParent( arguments )
	}
});