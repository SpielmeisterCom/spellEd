Ext.define('Spelled.model.LibraryNode', {
    extend: 'Ext.data.Model',

	fields: [
		'libraryId',
		'text',
		'sortOrder',
		'type'
	],

	convertToDependencyObject: function() {
		return {
			sortOrder: this.get( 'sortOrder' ),
			type: this.get( 'iconCls' ),
			libraryId: this.get( 'libraryId' ),
			id: this.get( 'id' )
		}
	}
})