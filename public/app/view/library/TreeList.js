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

	setNodeVisible: function( node, visible ) {
		var el = Ext.fly( this.getView().getNodeByRecord( node ) )

		if ( el != null ) {
			el.setDisplayed( visible )
		}
	},

	filterLibraryTree: function() {
		this.down( 'libraryfilterbutton' ).filterHandler()
	},

	filterNodes: function( store, filters ) {
		var me = this

		store.getRootNode().cascadeBy( function() {
			var type = this.get( 'iconCls' )

			if( Ext.Array.contains( filters, type ) || "folder" == this.get( 'cls' )  ) {
				me.setNodeVisible( this, true )
			} else {
				me.setNodeVisible( this, false )
			}
		})
	},

	initComponent: function() {
		var me         = this,
			cellEditor = Ext.create( 'Spelled.view.scene.plugin.CellEditing' )

		Ext.applyIf( me, {
				plugins:[ cellEditor ],
				listeners: {
					afteritemexpand : function() {
						me.filterLibraryTree()
					},
					afterrender: function() {
						cellEditor.removeManagedListener( cellEditor.view, 'celldblclick' )
					},
					validateedit: function( editor, e ) {
						if( !cellEditor.isJavaScriptCompliant( e.value ) ){
							Ext.MessageBox.alert( 'Error', "Usage of invalid characters. No: '.' or '/' allowed" )
							return false
						}
					}
				},
				tbar: [
					{
						text: 'Create',
						icon: 'images/icons/add.png',
						menu: { xtype: 'librarymenu' }
					},
					{
						xtype: 'libraryfilterbutton',
						filterFn: Ext.bind( this.filterNodes, this ),
						assetsOnly: false
					}
				]
			}
		)

		me.callParent( arguments )
	}
});