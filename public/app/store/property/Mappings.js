Ext.define('Spelled.store.property.Mappings', {
    extend: 'Ext.data.Store',

	fields: [ 'type', 'name', 'target' ],

	data : [
		{
			"name"  : "spelledanimatedappearancefield",
			"target": "asset",
			"type"  : "libraryLink"
		},
		{
			"name"  :"spelledappearancefield",
			"target": "asset",
			"type"  :"libraryLink"
		},
		{
			"name"  :"spelledtextappearancefield",
			"target": "asset",
			"type"  :"libraryLink"
		},
		{
			"name"  :"spelledsoundfield",
			"target": "asset",
			"type"  :"libraryLink"
		},
		{
			"name"  :"spelledkeyaction",
			"target": "asset",
			"type"  :"libraryLink"
		},
		{
			"name"  :"spelledkeyframeanimationfield",
			"target": "asset",
			"type"  :"libraryLink"
		},
		{
			"name"  :"spelledtilemapfield",
			"target": "asset",
			"type"  :"libraryLink"
		},
        {
            "name"  :"spelledscript",
			"target": "script",
            "type"  :"libraryLink"
        }
	]
});
