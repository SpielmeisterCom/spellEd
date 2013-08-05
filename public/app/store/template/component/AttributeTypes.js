Ext.define('Spelled.store.template.component.AttributeTypes', {
    extend: 'Ext.data.Store',

	fields: ['type', 'name', 'defaultValue'],

	data : [
		{
			"defaultValue": "0",
			"type":"spellednumberfield",
			"name":"number"
		},
		{
			"defaultValue": "{}",
			"type":"spelledobjectfield",
			"name":"object"
		},
		{
			"defaultValue": "Default Value",
			"type":"spelledtextfield",
			"name":"string"
		},
		{
			"defaultValue": "[0,0]",
			"type":"spelledvec2field",
			"name":"vec2"
		},
		{
			"defaultValue": "[0,0,0]",
			"type":"spelledvec3field",
			"name":"vec3"
		},
		{
			"defaultValue": "[0,0,0,0]",
			"type":"spelledvec4field",
			"name":"vec4"
		},
		{
			"defaultValue": "[1,2,3,4,5,6,7,8,9]",
			"type":"spelledmat3field",
			"name":"mat3"
		},
		{
			"type":"spelledlistfield",
			"name":"list"
		},
		{
			"type":"spelledenumfield",
			"name":"enum"
		},
		{
			"defaultValue": "0",
			"type":"spelledintegerfield",
			"name":"integer"
		},
		{
			"defaultValue": "true",
			"type":"spelledbooleanfield",
			"name":"boolean"
		},
		{
			"type":"spelledanimatedappearancefield",
			"name":"assetId:animation"
		},
		{
			"type":"spelledspritesheetfield",
			"name":"assetId:spriteSheet"
		},
		{
			"type":"spelledappearancefield",
			"name":"assetId:appearance"
		},
		{
			"type":"spelledtextappearancefield",
			"name":"assetId:font"
		},
		{
			"type":"spelledsoundfield",
			"name":"assetId:sound"
		},
		{
			"type":"spelledkeyaction",
			"name":"assetId:inputMap"
		},
		{
			"type":"spelledkeyframeanimationfield",
			"name":"assetId:keyFrameAnimation"
		},
		{
			"type":"spelledtilemapfield",
			"name":"assetId:2dTileMap"
		},
        {
            "type":"spelledscript",
            "name":"assetId:script"
        },
		{
			"type":"spelledtranslationfield",
			"name":"assetId:translation"
		}
	]
});
