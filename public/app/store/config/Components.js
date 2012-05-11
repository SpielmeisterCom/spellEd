Ext.define('Spelled.store.config.Components', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.config.Component',
    proxy: {
        type: 'memory'
    }
});