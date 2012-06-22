Ext.define('Spelled.store.template.ComponentAttributes', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.template.ComponentAttribute',
    proxy: {
        type: 'memory'
    }
});
