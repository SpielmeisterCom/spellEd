Ext.define('Spelled.store.asset.Types', {
    extend: 'Ext.data.Store',

    fields: [ 'type', 'name', 'iconCls', 'sortOrder' ],

    data : [
	    {
		    "type":"appearance",
		    "name":"2D Static Appearance (Image)",
		    "iconCls": "tree-asset-2dstaticappearance-icon",
		    "sortOrder": 10
	    },
	    {
		    "type":"spriteSheet",
		    "name":"Sprite Sheet",
		    "iconCls": "tree-asset-spritesheet-icon",
		    "sortOrder": 20
	    },
	    {
			"type":"animation",
			"name":"2D Animation",
			"iconCls": "tree-asset-2danimation-icon",
		    "sortOrder": 30
		},

//		{
//			"type":"domvas",
//			"name":"2D Static Domvas Appearance"
//		},

		{
			"type":"keyFrameAnimation",
			"name":"Keyframe animation",
			"iconCls": "tree-asset-keyframeanimation-icon",
			"sortOrder": 40
		},
        {
            "type":"font",
            "name":"Font",
	        "iconCls": "tree-asset-2dtextappearance-icon",
	        "sortOrder": 50
		},
		{
			"type":"sound",
			"name":"Sound",
			"iconCls": "tree-asset-sound-icon",
			"sortOrder": 60
		},
		{
			"type":"keyToActionMap",
			"name":"Keyboard mapping",
			"iconCls": "tree-asset-keytoactionmap-icon",
			"sortOrder": 70
		}
    ]
});

