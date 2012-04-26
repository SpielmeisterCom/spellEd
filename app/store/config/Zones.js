Ext.define('Spelled.store.config.Zones', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.config.Zone',
    proxy: {
        type: 'memory'
    }
});