Ext.define('Spelled.store.BlacklistedComponentAttributes', {
    extend: 'Ext.data.Store',

    fields: [ 'id', 'attributes' ],

    data : [
		{
			"id": "spell.component.visualObject",
			attributes: [ 'pass', 'layer' ]
		}
    ]
});

