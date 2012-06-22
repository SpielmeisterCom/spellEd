Ext.define('Spelled.store.config.Scenes', {
    extend: 'Ext.data.Store',

    model: 'Spelled.model.config.Scene',
    proxy: {
        type: 'memory'
    }
});
