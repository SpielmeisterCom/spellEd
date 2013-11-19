Ext.define('Spelled.store.SupportedOrientations', {
	extend: 'Ext.data.Store',

	fields: ['type', 'name'],

	data : [
		{
			"type":"landscape",
			"name":"Landscape Mode Lock"
		},
		{
			"type":"portrait",
			"name":"Portrait Mode Lock"
		},
		{
			"type":"auto-rotation",
			"name":"Auto rotation"
		}
	]
});