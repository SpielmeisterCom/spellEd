Ext.define('Spelled.store.template.Types', {
    extend: 'Ext.data.Store',

    fields: ['type', 'name'],

    data : [
        {
            "type":"componentTemplate",
            "name":"Component"
        },
        {
            "type":"entityTemplate",
            "name":"Entity"
        },
        {
            "type":"systemTemplate",
            "name":"System"
        }
    ]
});
