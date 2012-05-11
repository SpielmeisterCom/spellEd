Ext.define('Spelled.store.blueprint.ComponentAttributes', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.blueprint.ComponentAttribute',
    proxy: {
        type: 'memory'
    }
});