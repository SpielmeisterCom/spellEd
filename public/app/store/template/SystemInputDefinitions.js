Ext.define('Spelled.store.template.SystemInputDefinitions', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.template.SystemInputDefinition',
    proxy: {
        type: 'memory'
    }
});
