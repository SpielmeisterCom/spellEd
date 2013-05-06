Ext.define('Spelled.base.grid.column.Action', {
	extend: 'Ext.grid.column.Action',
	alias: 'widget.spelledactioncolumn',

	width: 30,
	icon: 'resources/images/icons/wrench-arrow.png',
	handler: function( gridView, rowIndex, colIndex, column, e, record) {
		gridView.getSelectionModel().select( rowIndex )
		this.up('panel').fireEvent( 'editclick', gridView, rowIndex, colIndex, column, e )
	}
})
