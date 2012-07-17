Ext.define('Spelled.store.asset.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
            "type":"appearance",
            "name":"2D Static Appearance"
        },
		{
			"type":"animation",
			"name":"2D Animated Appearance"
		},
		{
			"type":"spriteSheet",
			"name":"Sprite Sheet"
		}//,
//        {
//            "type":"sounds",
//            "name":"Sounds"
//        }
    ]
});
