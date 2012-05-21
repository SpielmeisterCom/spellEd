Ext.define('Spelled.store.asset.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
            "type":"texture",
            "name":"Texture"
        },
        {
            "type":"sounds",
            "name":"Sounds"
        }
    ]
});