Ext.define('Spelled.store.template.component.Attributes', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.template.ComponentAttribute',
    proxy: {
        type: 'memory'
    }
});
