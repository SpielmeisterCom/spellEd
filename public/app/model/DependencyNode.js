Ext.define('Spelled.model.DependencyNode', {
    extend: 'Ext.data.Model',

	fields: [
		'libraryId',
		'text',
		'sortOrder',
		'isStatic',
		'type'
	]
})