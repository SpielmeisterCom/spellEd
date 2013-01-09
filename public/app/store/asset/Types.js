Ext.define('Spelled.store.asset.Types', {
    extend: 'Ext.data.Store',

    fields: [ 'type', 'name', 'iconCls', 'sortOrder', 'storeId' ],

    data : [
	    {
		    "type":"appearance",
		    "name":"2D Static Appearance (Image)",
		    "iconCls": "tree-asset-2dstaticappearance-icon",
		    "sortOrder": 10,
			"storeId": "asset.Appearances"
	    },
	    {
		    "type":"spriteSheet",
		    "name":"Sprite Sheet",
		    "iconCls": "tree-asset-spritesheet-icon",
		    "sortOrder": 20,
			"storeId": "asset.SpriteSheets"
	    },
	    {
			"type":"animation",
			"name":"2D Animation",
			"iconCls": "tree-asset-2danimation-icon",
		    "sortOrder": 30,
			"storeId": "asset.Animations"
		},

//		{
//			"type":"domvas",
//			"name":"2D Static Domvas Appearance"
//		},

		{
			"type":"keyFrameAnimation",
			"name":"Keyframe animation",
			"iconCls": "tree-asset-keyframeanimation-icon",
			"sortOrder": 40,
			"storeId": "asset.KeyFrameAnimations"
		},
        {
            "type":"font",
            "name":"Font",
	        "iconCls": "tree-asset-2dtextappearance-icon",
	        "sortOrder": 50,
			"storeId": "asset.Fonts"
		},
		{
			"type":"sound",
			"name":"Sound",
			"iconCls": "tree-asset-sound-icon",
			"sortOrder": 60,
			"storeId": "asset.Sounds"
		},
		{
			"type":"keyToActionMap",
			"name":"Keyboard mapping",
			"iconCls": "tree-asset-keytoactionmap-icon",
			"sortOrder": 70,
			"storeId": "asset.KeyToActionMappings"
		},
		{
			"type":"2dTileMap",
			"name":"2d Tilemap",
			"iconCls": "tree-asset-2dtilemap-icon",
			"sortOrder": 80,
			"storeId": "asset.TileMaps"
		},
		{
			"type":"script",
			"name":"Script",
			"iconCls": "tree-script-icon",
			"sortOrder": 10,
			"storeId": "script.Scripts"
		}
    ]
});

