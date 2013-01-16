Ext.define( 'Spelled.store.Languages', {
    extend: 'Ext.data.Store',

    fields: [ 'id', 'name' ],

    data : [
		{
			id: "de",
			name: "German"
		},
		{
			id: "fr",
			name: "French"
		},
		{
			id: "en",
			name: "English"
		}
    ]
});

