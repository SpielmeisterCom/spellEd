Ext.define('Spelled.store.config.Entities', {
    extend: 'Ext.data.Store',
	requires: ['Spelled.model.config.Entity'],

    model: 'Spelled.model.config.Entity',
    proxy: {
        type: 'memory'
    }
});