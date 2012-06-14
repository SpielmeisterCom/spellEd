Ext.define('Spelled.store.system.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
            "type":"update",
            "name":"update"
        },
        {
            "type":"render",
            "name":"render"
        }
    ]
});