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
//		{
//			"type":"domvas",
//			"name":"2D Static Domvas Appearance"
//		},
		{
			"type":"spriteSheet",
			"name":"Sprite Sheet"
		},
		{
			"type":"keyFrameAnimation",
			"name":"Key frame animation"
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
			"name":"Keyboard mapping"
		}
    ]
});
