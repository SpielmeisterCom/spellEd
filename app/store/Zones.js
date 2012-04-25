Ext.define('Spelled.store.Zones', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.Zone',
    proxy: {
        type: 'memory'
    }
});