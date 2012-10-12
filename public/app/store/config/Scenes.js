Ext.define('Spelled.store.config.Scenes', {
    extend: 'Ext.data.Store',
	requires: ['Spelled.model.config.Scene'],

	model: 'Spelled.model.config.Scene',
    proxy: {
        type: 'memory'
    }
});
