Ext.define('Spelled.store.AspectRatios', {
    extend: 'Ext.data.Store',

	fields: ['aspectRatio', 'name'],

	data : [
		{
			"aspectRatio": 0,
			"name":"Fit to screen"
		},
		{
			"aspectRatio": 1.333333333333333,
			"name":"4:3 (iPad landscape)"
		},
		{
			"aspectRatio": 0.75,
			"name":"3:4 (iPad portrait)"
		},
		{
			"aspectRatio": 0.6666666666666667,
			"name":"2:3 (iPhone portrait)"
		},
		{
			"aspectRatio": 1.5,
			"name":"3:2 (iPhone landscape)"
		},
		{
			"aspectRatio": 1.777777777777778,
			"name":"16:9"
		},
		{
			"aspectRatio": 1.6,
			"name":"16:10"
		}
	]
});
