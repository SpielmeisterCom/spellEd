Ext.define('Spelled.store.grouping.Components', {
    extend: 'Ext.data.Store',

	fields: [
		'name',
		'icon'
	],

	data : [
		{
			name: 'Test',
			icon: 'test.png'
		}
	]
});