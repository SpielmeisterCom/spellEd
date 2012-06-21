Ext.define('Spelled.store.asset.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
            "type":"appearance",
            "name":"Sprite"
        },
		{
			"type":"animatedAppearance",
			"name":"Sprite Animation"
		},
        {
            "type":"sounds",
            "name":"Sounds"
        }
    ]
});