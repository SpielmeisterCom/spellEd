Ext.define('Spelled.store.config.Entities', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.config.Entity',
    proxy: {
        type: 'memory'
    }
});