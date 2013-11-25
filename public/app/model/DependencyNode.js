Ext.define('Spelled.model.DependencyNode', {
    extend: 'Ext.data.Model',

	fields: [
		'libraryId',
		'text',
		'sortOrder',
		'isStatic',
		'type'
	],

	constructor: function() {
		this.callParent( arguments )
		//TODO: remove this if the ext proxy on tree will correctly apply the clientIdProperty
		this.setId( Ext.id( null, this.get( 'libraryId' ) + "###" ) )
	}
})