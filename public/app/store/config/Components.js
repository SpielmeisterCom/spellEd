Ext.define('Spelled.store.config.Components', {
    extend: 'Ext.data.Store',
	requires: ['Spelled.model.config.Component'],

    model: 'Spelled.model.config.Component',
    proxy: {
        type: 'memory'
    }
});