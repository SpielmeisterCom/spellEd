Ext.define('Spelled.store.blueprint.SystemInputDefinitions', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.blueprint.SystemInputDefinition',
    proxy: {
        type: 'memory'
    }
});