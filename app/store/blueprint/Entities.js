Ext.define('Spelled.store.blueprint.Entities', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.blueprint.Entity',

    proxy: {
        type: 'memory'
    }
});