Ext.define('Spelled.store.template.Types', {
    extend: 'Ext.data.Store',

	fields: [ 'type', 'name', 'iconCls', 'sortOrder' ],

    data : [
        {
			"type":"component",
			iconCls : "tree-component-icon",
			sortOrder: 210,
            "name":"Component"
        },
        {
            "type":"entityTemplate",
			sortOrder : 220,
			iconCls : "tree-scene-entity-icon",
            "name":"Entity"
        },
        {
            "type":"system",
			iconCls : "tree-system-icon",
			sortOrder : 230,
            "name":"System"
        }
    ]
});
