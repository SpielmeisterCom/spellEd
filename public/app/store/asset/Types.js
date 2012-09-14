Ext.define('Spelled.store.asset.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
		{
			"type":"animation",
			"name":"2D Animated Appearance"
		},
        {
            "type":"appearance",
            "name":"2D Static Appearance"
        },
		{
			"type":"spriteSheet",
			"name":"Sprite Sheet"
		},
        {
            "type":"font",
            "name":"Font"
		},
		{
			"type":"sound",
			"name":"Sound"
		},
		{
			"type":"keyToActionMap",
			"name":"Key to action Mapping"
		}
    ]
});
