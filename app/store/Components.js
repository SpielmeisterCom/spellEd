Ext.define('Spelled.store.Components', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Components',
    proxy: {
        type: 'memory'
    }
});