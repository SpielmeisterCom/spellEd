Ext.define('Spelled.store.template.component.AttributeTypes', {
    extend: 'Ext.data.Store',

	fields: ['type', 'name'],

	data : [
		{
			"type":"spellednumberfield",
			"name":"number"
		},
		{
			"type":"spelledobjectfield",
			"name":"object"
		},
		{
			"type":"spelledtextfield",
			"name":"string"
		},
		{
			"type":"spelledvec2field",
			"name":"vec2"
		},
		{
			"type":"spelledlistfield",
			"name":"list"
		},
		{
			"type":"spelledintegerfield",
			"name":"integer"
		},
		{
			"type":"spelledbooleanfield",
			"name":"boolean"
		},
		{
			"type":"spelledanimatedappearancefield",
			"name":"assetId:animatedAppearance"
		},
		{
			"type":"spelledappearancefield",
			"name":"assetId:appearance"
		},
		{
			"type":"spelledtextappearancefield",
			"name":"assetId:font"
		}
	]
});
