Ext.define('Spelled.store.Entities', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Entity',
    proxy: {
        type: 'memory'
    }
});