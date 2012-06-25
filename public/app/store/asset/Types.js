Ext.define('Spelled.store.asset.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
            "type":"appearance",
            "name":"Image"
        },
		{
			"type":"spriteSheet",
			"name":"Sprite Sheet"
		},
		{
			"type":"animation",
			"name":"Sprite Sheet Animation"
		},
        {
            "type":"sounds",
            "name":"Sounds"
        }
    ]
});