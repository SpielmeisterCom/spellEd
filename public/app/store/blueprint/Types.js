Ext.define('Spelled.store.blueprint.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
            "type":"componentBlueprint",
            "name":"Component"
        },
        {
            "type":"entityBlueprint",
            "name":"Entity"
        },
        {
            "type":"systemBlueprint",
            "name":"System"
        }
    ]
});