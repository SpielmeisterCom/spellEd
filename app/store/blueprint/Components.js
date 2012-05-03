Ext.define('Spelled.store.blueprint.Components', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.blueprint.Component',

    proxy: {
        type: 'memory'
    }
});